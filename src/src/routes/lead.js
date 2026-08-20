import { Router } from "express";
import rateLimit from "express-rate-limit";
import { saveLead, getAllLeads } from "../services/leadService.js";
import { requireAdminKey } from "../middleware/requireAdminKey.js";

const router = Router();

// Rate limiter for lead submissions (POST) — prevents form-spam
const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Too many submissions. Please wait a moment and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for admin reads (GET) — generous for legitimate admin use
const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Sanitize string input to prevent XSS when leads are displayed.
function sanitize(str) {
  if (typeof str !== "string") return undefined;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * @swagger
 * /api/lead:
 *   post:
 *     summary: Submit a new lead
 *     description: Saves a new lead with contact information
 *     tags:
 *       - Leads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Lead's name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Lead's email address
 *                 example: "john@example.com"
 *               website:
 *                 type: string
 *                 description: Lead's website (optional)
 *                 example: "example.com"
 *               phone:
 *                 type: string
 *                 description: Lead's phone number (optional)
 *                 example: "1234567890"
 *               requirement:
 *                 type: string
 *                 description: Lead's requirements (optional)
 *                 example: "SEO services"
 *     responses:
 *       201:
 *         description: Lead successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lead:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     website:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     requirement:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - missing required fields or invalid email
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
 */
router.post("/", submitLimiter, (req, res) => {
  const { name, email, website, phone, requirement } = req.body ?? {};

  if (!name || !email) {
    return res.status(400).json({ error: "Fields 'name' and 'email' are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Validate field lengths to prevent abuse
  if (name.length > 200) {
    return res.status(400).json({ error: "Name is too long (max 200 characters)." });
  }
  if (email.length > 320) {
    return res.status(400).json({ error: "Email is too long (max 320 characters)." });
  }
  if (website && website.length > 500) {
    return res.status(400).json({ error: "Website is too long (max 500 characters)." });
  }
  if (phone && phone.length > 30) {
    return res.status(400).json({ error: "Phone is too long (max 30 characters)." });
  }
  if (requirement && requirement.length > 2000) {
    return res.status(400).json({ error: "Requirement is too long (max 2000 characters)." });
  }

  const lead = saveLead({
    name: sanitize(name),
    email: sanitize(email),
    website: sanitize(website),
    phone: sanitize(phone),
    requirement: sanitize(requirement),
  });
  res.status(201).json({ message: "Lead saved.", lead });
});

/**
 * @swagger
 * /api/lead:
 *   get:
 *     summary: Get all leads (Admin only)
 *     description: Retrieves all submitted leads. Requires x-admin-key header
 *     tags:
 *       - Leads
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of all leads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   website:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   requirement:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - missing or invalid admin key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       503:
 *         description: Service unavailable - admin key not configured
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/", readLimiter, requireAdminKey, (req, res) => {
  res.json(getAllLeads());
});

export default router;
