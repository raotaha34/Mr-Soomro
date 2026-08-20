import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import chatRouter from "./routes/chat.js";
import leadRouter from "./routes/lead.js";
import { loadKnowledgeBase, getStoreSize } from "./services/vectorService.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// The static website lives one level above the backend folder.
const SITE_ROOT = process.env.SITE_ROOT
  ? path.resolve(process.env.SITE_ROOT)
  : path.resolve(__dirname, "../..");
const BACKEND_DIR_NAME = path.basename(path.resolve(__dirname, ".."));
const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting keys on the client IP, so the number of proxies in front of the
// app has to be declared explicitly (0 = no proxy, the safe local default).
app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS) || 0);

const DEFAULT_ORIGINS = [
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)
  .concat(DEFAULT_ORIGINS);

app.use(cors({
  // No Origin header (curl, same-origin) and "null" (pages opened via file://)
  // never carry cookies, so allowing them costs nothing.
  origin(origin, callback) {
    if (!origin || origin === "null" || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
  credentials: true,
}));
app.use(express.json({ limit: "32kb" }));

// Limits how many AI calls a single IP can trigger — protects the Gemini API bill
// from being run up by spam or abuse.
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: { error: "Too many messages. Please wait a moment and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limits how many lead submissions a single IP can make — prevents form-spam
// from filling leads.json with junk entries.
const leadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Too many submissions. Please wait a moment and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/chat", chatLimiter, chatRouter);
app.use("/api/lead", leadLimiter, leadRouter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mr. Soomro RAG Chatbot API",
      version: "1.0.0",
      description: "API for Mr. Soomro SEO agency RAG chatbot",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
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
  apis: [path.join(__dirname, "routes/*.js"), path.join(__dirname, "server.js")],
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
  res.json({ status: "ok", knowledgeChunks: getStoreSize(), aiConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

// The website itself is served from the same origin as the API, so the chat
// widget works without a second server or cross-origin configuration.
// The backend folder sits inside the site root and holds .env, node_modules and
// captured leads, so it is never served.
app.use((req, res, next) => {
  const first = decodeURIComponent(req.path).split("/").filter(Boolean)[0];
  if (first === BACKEND_DIR_NAME) return res.status(404).send("Not found");
  next();
});
app.use(express.static(SITE_ROOT));

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body is too large." });
  }
  if (err?.message?.includes("not allowed by CORS")) {
    return res.status(403).json({ error: "Origin not allowed." });
  }
  console.error("Unhandled error:", err?.message);
  res.status(500).json({ error: "Something went wrong." });
});

// Load and chunk the knowledge base once at startup, not on every request.
let chunkCount = 0;
try {
  chunkCount = loadKnowledgeBase();
} catch (err) {
  console.error(`Knowledge base failed to load: ${err.message}`);
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Knowledge base ready: ${chunkCount} chunks indexed.`);
  if (chunkCount === 0) {
    console.warn("WARNING: no knowledge chunks indexed. Chat answers will have no website context.");
  }
  if (!process.env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY not set. Chat will respond with a placeholder message.");
  }
  if (!process.env.ADMIN_API_KEY) {
    console.warn("WARNING: ADMIN_API_KEY not set. GET /api/lead will return 503.");
  }
});
