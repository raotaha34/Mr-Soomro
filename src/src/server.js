import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
// Side-effect import: forces Vercel's file tracer to bundle swagger-ui assets.
import "./swaggerAssetsRef.js";
import chatRouter from "./routes/chat.js";
import leadRouter from "./routes/lead.js";
import contactRouter from "./routes/contact.js";
import { loadKnowledgeBase } from "./services/vectorService.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Behind Vercel's edge/proxy, trust X-Forwarded-For so express-rate-limit and
// req.ip reflect the real client instead of the proxy. Defaults to 1 hop; the
// value can be overridden (or disabled with 0) via TRUST_PROXY_HOPS.
app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS ?? 1));

const allowedOrigins = [
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "file://",
];

if (process.env.ALLOWED_ORIGINS) {
  const extra = process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);
  allowedOrigins.push(...extra);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Respond 403 directly instead of throwing, so rejected preflights
      // don't surface as HTML 500 pages from the default error handler.
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json());

// Limits how many AI calls a single IP can trigger — protects your Groq API bill
// from being run up by spam or abuse.
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: { error: "Too many messages. Please wait a moment and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/chat", chatLimiter, chatRouter);
app.use("/api/lead", leadRouter);
app.use("/api/contact", contactRouter);

// Swagger configuration
// Swagger UI targets the FIRST server in the list. On Vercel we point it at the
// stable production alias — VERCEL_URL is a per-deployment URL that stops
// resolving after the next deploy, which causes "Failed to fetch" errors.
const productionUrl = process.env.PUBLIC_URL || "https://src-five-sage.vercel.app";

const swaggerServers = process.env.VERCEL
  ? [{ url: productionUrl, description: "Production server" }]
  : [
      { url: `http://localhost:${PORT}`, description: "Development server" },
      { url: productionUrl, description: "Production server" },
    ];

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mr. Soomro RAG Chatbot API",
      version: "1.0.0",
      description: "API for Mr. Soomro SEO agency RAG chatbot",
    },
    servers: swaggerServers,
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-admin-key",
          description: "Admin API key for accessing protected endpoints",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Load and chunk the knowledge base once at startup, not on every request.
const chunkCount = loadKnowledgeBase();
console.log(`Knowledge base ready: ${chunkCount} chunks indexed.`);

if (!process.env.GROQ_API_KEY) {
  console.warn("WARNING: GROQ_API_KEY not set. Chat will respond with a placeholder message.");
}
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("WARNING: EMAIL_USER/EMAIL_PASS not set. Contact form emails will not work.");
}

// Only start a persistent server when run directly (e.g. `npm start`).
// On Vercel the platform handles HTTP, so api/index.js imports this app instead.
if (process.env.VERCEL !== "1" && process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
