// Verifies every HTML page has exactly one favicon + one apple-touch-icon link
// with a href that resolves to assets/<name> from the page's directory.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, normalize } from "node:path";

let bad = 0, total = 0;

function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e.startsWith(".vercel") || e === ".git") continue;
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (e.endsWith(".html")) check(p);
  }
}

function check(file) {
  total++;
  const t = readFileSync(file, "utf8");
  const icons = t.match(/<link[^>]*rel="icon"[^>]*>/g) || [];
  const apples = t.match(/<link[^>]*rel="apple-touch-icon"[^>]*>/g) || [];
  if (icons.length !== 1 || apples.length !== 1) {
    bad++; console.log("BAD COUNT", file, "icon:" + icons.length, "apple:" + apples.length);
    return;
  }
  const href = (icons[0].match(/href="([^"]+)"/) || [])[1] || "";
  const clean = normalize(href.split("?")[0]).replace(/\\/g, "/");
  if (!clean.endsWith("assets/favicon.png")) { bad++; console.log("BAD HREF", file, href); }
}

walk(".");
console.log(bad ? bad + " problems out of " + total : "ALL " + total + " PAGES OK: exactly 1 favicon + 1 apple-touch-icon, correct hrefs");
