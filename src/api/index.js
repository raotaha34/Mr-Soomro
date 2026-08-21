// Vercel serverless entry point.
// Vercel handles the HTTP server; we just hand it the Express app.
// (ESM syntax because package.json sets "type": "module")
import app from "../src/server.js";

export default app;
