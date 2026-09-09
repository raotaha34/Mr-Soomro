// Adds ?v=2 to script.js and css/style.css references in every HTML page
// so browsers drop stale cached assets after the responsive fixes.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
let changed = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".vercel") || entry === ".git") continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (entry.endsWith(".html")) bump(p);
  }
}

function bump(file) {
  let src = readFileSync(file, "utf8");
  const out = src
    .replace(/(src="[^"]*?script\.js)(\?[^"]*)?"/g, '$1?v=3"')
    .replace(/(href="[^"]*?style\.css)(\?[^"]*)?"/g, '$1?v=3"');
  if (out !== src) {
    writeFileSync(file, out);
    changed++;
    console.log("busted:", file.replace(ROOT + "\\", ""));
  }
}

walk(ROOT);
console.log(`\nDone. ${changed} files updated.`);
