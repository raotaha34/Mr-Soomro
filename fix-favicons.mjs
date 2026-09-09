// Ensures every HTML page has exactly one favicon + apple-touch-icon link
// pointing at the regenerated brand-mark icons, with correct relative depth.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, dirname, sep } from "node:path";

const ROOT = process.cwd();
let changed = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".vercel") || entry === ".git") continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (entry.endsWith(".html")) fix(p);
  }
}

function fix(file) {
  const rel = relative(ROOT, file);
  const depth = dirname(rel).split(sep).filter((s) => s && s !== ".").length;
  const prefix = "../".repeat(depth);
  let src = readFileSync(file, "utf8");
  const orig = src;

  // Drop every existing icon link (handles duplicates too)
  src = src.replace(/[ \t]*<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>\r?\n?/gi, "");

  const iconTag = `<link rel="icon" href="${prefix}assets/favicon.png?v=2" type="image/png">\n<link rel="apple-touch-icon" href="${prefix}assets/apple-touch-icon.png">`;

  if (/<meta[^>]*charset[^>]*>/i.test(src)) {
    src = src.replace(/<meta[^>]*charset[^>]*>/i, (m) => m + "\n" + iconTag);
  } else if (/<link/i.test(src)) {
    src = src.replace(/<link/i, iconTag + "\n<link");
  } else {
    src = src.replace(/<title/i, iconTag + "\n<title");
  }

  if (src !== orig) {
    writeFileSync(file, src);
    changed++;
    console.log("fixed:", rel);
  }
}

walk(ROOT);
console.log(`\nDone. ${changed} files updated.`);
