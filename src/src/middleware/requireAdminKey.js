import crypto from "crypto";

// Constant-time compare so the key cannot be recovered by timing the responses.
function keysMatch(provided, expected) {
  const a = Buffer.from(String(provided));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Protects internal-only routes (like reading captured leads).
// Requires header: x-admin-key: <ADMIN_API_KEY from .env>
export function requireAdminKey(req, res, next) {
  const configuredKey = process.env.ADMIN_API_KEY;

  if (!configuredKey) {
    // Fail closed, not open. If no key is configured, block access
    // rather than silently allowing anyone through.
    return res.status(503).json({
      error: "Admin access is not configured. Set ADMIN_API_KEY in .env.",
    });
  }

  const providedKey = req.headers["x-admin-key"];

  if (typeof providedKey !== "string" || !keysMatch(providedKey, configuredKey)) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  next();
}
