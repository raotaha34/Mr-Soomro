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
import { loadKnowledgeBase } from "./services/vectorService.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000', 'http://localhost:8080', 'http://127.0.0.1:8080', 'file://'],
  credentials: true
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Knowledge base ready: ${chunkCount} chunks indexed.`);
  if (!process.env.GROQ_API_KEY) {
    console.warn("WARNING: GROQ_API_KEY not set. Chat will respond with a placeholder message.");
  }
});
