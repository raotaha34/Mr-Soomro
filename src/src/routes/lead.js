import { Router } from "express";
import { saveLead, getAllLeads } from "../services/leadService.js";
import { requireAdminKey } from "../middleware/requireAdminKey.js";

const router = Router();

const MAX_LENGTHS = { name: 100, email: 254, website: 200, phone: 30, requirement: 2000 };

function cleanField(value, field) {
  if (value === undefined || value === null || value === "") return { value: "" };
  if (typeof value !== "string") return { error: `Field '${field}' must be a string.` };
  const trimmed = value.trim();
  if (trimmed.length > MAX_LENGTHS[field]) {
    return { error: `Field '${field}' is too long (max ${MAX_LENGTHS[field]} characters).` };
  }
  return { value: trimmed };
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
router.post("/", (req, res) => {
  const body = req.body ?? {};
  const fields = {};

  for (const field of Object.keys(MAX_LENGTHS)) {
    const result = cleanField(body[field], field);
    if (result.error) return res.status(400).json({ error: result.error });
    fields[field] = result.value;
  }

  if (!fields.name || !fields.email) {
    return res.status(400).json({ error: "Fields 'name' and 'email' are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fields.email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const lead = saveLead(fields);
    res.status(201).json({ message: "Lead saved.", lead });
  } catch (err) {
    console.error("Lead save error:", err.message);
    res.status(500).json({ error: "Could not save your details. Please try again." });
  }
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
router.get("/", requireAdminKey, (req, res) => {
  res.json(getAllLeads());
});

export default router;
