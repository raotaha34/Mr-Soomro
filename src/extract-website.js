// Extracts EVERY visible word from the Mr. Soomro website (all HTML pages)
// into knowledge/*.txt so the RAG chatbot knows navbar items, contact info,
// every service, and every package price.
// Usage: node extract-website.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = "C:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro";
const KNOWLEDGE_DIR = path.join(__dirname, "knowledge");

const EXCLUDE_DIRS = new Set(["node_modules", ".git", "assets", "images", "css", "js"]);
const REMOVE_TAG_CONTENTS = ["script", "style", "noscript", "iframe", "svg", "head"];

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“");
}

function extractTextFromHTML(html) {
  let text = html;
  REMOVE_TAG_CONTENTS.forEach((tag) => {
    text = text.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gim"), " ");
  });
  // Keep block boundaries as separators so words don't glue together
  text = text.replace(/<\/(p|div|li|h[1-6]|section|article|header|footer|nav|tr|td|th|a|span|button|label)>/gi, " \n ");
  text = text.replace(/<[^>]+>/g, " ");
  text = decodeEntities(text);
  // Normalize each line, drop empty ones, dedupe consecutive identical lines
  const lines = text
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const deduped = [];
  for (const line of lines) {
    if (deduped.length === 0 || deduped[deduped.length - 1] !== line) deduped.push(line);
  }
  return deduped.join("\n");
}

function extractLinks(html) {
  const links = [];
  const pattern = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = pattern.exec(html)) !== null) {
    const label = decodeEntities(m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    const href = m[1].trim();
    if (label && href && !href.startsWith("#") && !href.startsWith("javascript")) {
      links.push(`${label} -> ${href}`);
    }
  }
  return [...new Set(links)];
}

function extractNav(html) {
  const navMatch = html.match(/<nav\b[\s\S]*?<\/nav>/gi) || [];
  const headerMatch = html.match(/<header\b[\s\S]*?<\/header>/gi) || [];
  const items = [];
  [...navMatch, ...headerMatch].forEach((block) => {
    extractTextFromHTML(block)
      .split("\n")
      .forEach((l) => items.push(l));
  });
  return [...new Set(items)].slice(0, 40);
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.html$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function walk(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) found.push(...walk(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      found.push(full);
    }
  }
  return found;
}

// Removes previously generated site files so deleted pages don't linger.
function cleanOldSiteFiles() {
  for (const f of fs.readdirSync(KNOWLEDGE_DIR)) {
    if (f.startsWith("site-") && f.endsWith(".txt")) {
      fs.unlinkSync(path.join(KNOWLEDGE_DIR, f));
    }
  }
}

function main() {
  cleanOldSiteFiles();
  const files = walk(SITE_ROOT);
  let totalChars = 0;
  let count = 0;

  for (const file of files) {
    const rel = path.relative(SITE_ROOT, file).replace(/\\/g, "/");
    const html = fs.readFileSync(file, "utf-8");
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "")
      .replace(/\s+/g, " ")
      .trim();
    const body = extractTextFromHTML(html);
    const nav = extractNav(html);
    const links = extractLinks(html);

    let out = "";
    out += `PAGE: ${title || rel}\n`;
    out += `URL: https://mr-soomro.vercel.app/${rel === "index.html" ? "" : rel}\n`;
    out += `FILE: ${rel}\n\n`;
    if (nav.length) out += `--- NAVBAR / HEADER ITEMS ---\n${nav.join("\n")}\n\n`;
    out += `--- FULL PAGE CONTENT ---\n${body}\n\n`;
    if (links.length) out += `--- LINKS ON THIS PAGE ---\n${links.join("\n")}\n`;

    const outFile = path.join(KNOWLEDGE_DIR, `site-${slugify(rel)}.txt`);
    fs.writeFileSync(outFile, out, "utf-8");
    totalChars += out.length;
    count++;
    console.log(`  ✓ ${rel} -> ${path.basename(outFile)} (${(out.length / 1024).toFixed(1)} KB)`);
  }

  console.log(`\n✅ Extracted ${count} pages, ${(totalChars / 1024).toFixed(0)} KB total, into ${KNOWLEDGE_DIR}`);
}

main();
