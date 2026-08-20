import { Router } from "express";
import { answerQuery } from "../services/ragService.js";

const router = Router();

const MAX_MESSAGE_LENGTH = 1000;

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a message to the RAG chatbot
 *     description: Processes a user message using RAG (Retrieval-Augmented Generation) and returns an AI response based on the knowledge base
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's message/question
 *                 example: "What services do you offer?"
 *     responses:
 *       200:
 *         description: Successful response with AI answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *                   description: The AI-generated response
 *                 aiConnected:
 *                   type: boolean
 *                   description: Whether the AI API was connected
 *                 sources:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Source files used for context
 *                 matchedChunks:
 *                   type: number
 *                   description: Number of relevant chunks found
 *       400:
 *         description: Bad request - missing or invalid message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       429:
 *         description: Too many requests - rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/", async (req, res) => {
  const { message } = req.body ?? {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Field 'message' (non-empty string) is required." });
  }

  const trimmed = message.trim();
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return res
      .status(400)
      .json({ error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).` });
  }

  try {
    const result = await answerQuery(trimmed);
    res.json(result);
  } catch (err) {
    console.error("Chat error:", err.message);
    res
      .status(err.statusCode || 500)
      .json({ error: err.userMessage || "Something went wrong generating a response." });
  }
});

export default router;
