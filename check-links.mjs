// Static link/asset checker: scans all HTML files, verifies local hrefs/srcs exist.
import fs from "fs";
import path from "path";

const ROOT = "c:/Users/Connect2Aryans/Desktop/Mr-Soomro";
const htmlFiles = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) htmlFiles.push(p);
  }
}
walk(ROOT);

const broken = [];
const checked = new Set();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf-8");
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const dir = path.dirname(file);
  const attrs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const a of attrs) {
    if (!a || a.startsWith("http") || a.startsWith("mailto:") || a.startsWith("tel:") || a.startsWith("#") || a.startsWith("data:") || a.startsWith("javascript:")) continue;
    let clean = a.split("#")[0].split("?")[0];
    if (!clean) continue;
    let target = path.resolve(dir, clean);
    // clean-URL support: /about -> about.html etc handled by .htaccess; check both
    const candidates = [target, target + ".html"];
    const key = rel + " -> " + a;
    if (checked.has(key)) continue;
    checked.add(key);
    if (!candidates.some((c) => fs.existsSync(c) && fs.statSync(c).isFile())) {
      broken.push(`${rel}: ${a}`);
    }
  }
}

console.log(`Scanned ${htmlFiles.length} HTML files.`);
if (broken.length) {
  console.log(`\nBROKEN LOCAL LINKS (${broken.length}):`);
  broken.forEach((b) => console.log("  " + b));
} else {
  console.log("No broken local links found.");
}
