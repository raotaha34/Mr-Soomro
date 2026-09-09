// Dev-only: serves the static website on its own port and proxies /api calls to
// the backend, so the frontend and API can run as two separate servers.
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SITE_ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.FRONTEND_PORT || 8080);
const API_HOST = process.env.API_HOST || "127.0.0.1";
const API_PORT = Number(process.env.API_PORT || 5000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function proxy(req, res) {
  const upstream = http.request(
    { host: API_HOST, port: API_PORT, path: req.url, method: req.method, headers: req.headers },
    (upRes) => {
      res.writeHead(upRes.statusCode || 502, upRes.headers);
      upRes.pipe(res);
    }
  );
  upstream.on("error", () => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `Backend not reachable on ${API_HOST}:${API_PORT}.` }));
  });
  req.pipe(upstream);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.pathname.startsWith("/api")) return proxy(req, res);

    const decoded = decodeURIComponent(url.pathname);
    // Keep path traversal (../) from escaping the site root.
    const target = path.join(SITE_ROOT, decoded === "/" ? "index.html" : decoded);
    if (!target.startsWith(SITE_ROOT) || decoded.split("/").filter(Boolean)[0] === "src") {
      res.writeHead(404).end("Not found");
      return;
    }

    const file = fs.existsSync(target) && fs.statSync(target).isDirectory()
      ? path.join(target, "index.html")
      : target;

    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" }).end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(PORT, () => {
    console.log(`Frontend on http://localhost:${PORT} (API proxied to ${API_HOST}:${API_PORT})`);
  });
