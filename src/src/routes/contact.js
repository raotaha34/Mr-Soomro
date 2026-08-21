import { Router } from "express";
import rateLimit from "express-rate-limit";
import { sendContactEmail } from "../controllers/contactController.js";

const router = Router();

// Rate limiter for contact form — prevents spam email submissions
const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { success: false, message: "Too many submissions. Please wait a moment and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Send a contact form email
 *     description: Sends the contact form submission as an email via Gmail SMTP to the site owner
 *     tags:
 *       - Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: Sender's name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Sender's email address
 *                 example: "john@example.com"
 *               message:
 *                 type: string
 *                 description: The message content
 *                 example: "I need help with SEO for my website"
 *               website:
 *                 type: string
 *                 description: Sender's website URL (optional)
 *                 example: "https://example.com"
 *               phone:
 *                 type: string
 *                 description: Sender's phone number (optional)
 *                 example: "+92 309 210 2705"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - missing fields or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       429:
 *         description: Too many requests - rate limit exceeded
 *       503:
 *         description: Email service not configured or authentication failed
 *       500:
 *         description: Failed to send email
 */
router.post("/", contactLimiter, sendContactEmail);

export default router;
