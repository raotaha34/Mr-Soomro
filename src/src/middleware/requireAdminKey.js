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

  if (!providedKey || providedKey !== configuredKey) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  next();
}
