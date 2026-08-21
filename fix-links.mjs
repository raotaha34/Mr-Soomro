// Normalize broken relative links inside Services/*.html so they resolve
// from the Services/ directory up to the site root (../pages, ../assets, ../index.html).
import fs from "fs";
import path from "path";

const dir = "c:/Users/Connect2Aryans/Desktop/Mr-Soomro/Services";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));

const pageNames = "about|services|blogs|reviews|privacy|terms|cookie-policy";
let changed = 0;

for (const f of files) {
  const p = path.join(dir, f);
  let html = fs.readFileSync(p, "utf-8");
  const before = html;

  // Bare page names -> ../pages/name.html   (href="about.html", href="services.html#x")
  html = html.replace(
    new RegExp('href="(' + pageNames + ')\\.html([^"]*)"', "g"),
    'href="../pages/$1.html$2"'
  );

  // href="pages/..." -> ../pages/...   (missing ../)
  html = html.replace(/href="pages\//g, 'href="../pages/');

  // href="index.html..." -> ../index.html...
  html = html.replace(/href="index\.html/g, 'href="../index.html');

  // assets -> ../assets
  html = html.replace(/(href|src)="assets\//g, '$1="../assets/');

  // css/js referenced from root -> ../
  html = html.replace(/(href|src)="css\//g, '$1="../css/');
  html = html.replace(/(src)="pages\/script\.js"/g, '$1="../pages/script.js"');
  html = html.replace(/(href|src)="images\//g, '$1="../images/');

  if (html !== before) {
    fs.writeFileSync(p, html);
    changed++;
    console.log("fixed:", f);
  }
}
console.log(`\n${changed} files updated.`);
