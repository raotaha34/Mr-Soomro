const fs = require('fs');
const path = require('path');

// ── Fix 1: Add bulletproof inline style to index.html ──
const indexFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\index.html');
let indexHtml = fs.readFileSync(indexFile, 'utf8');

// Add inline style for mnav right before </head>
const mnavFix = `
<style>
/* Mobile nav fix - guaranteed visibility */
.mnav { display:none !important; }
.mnav.open,.mnav[style*="flex"] { display:flex !important; }
#mobNav.open { display:flex !important; visibility:visible !important; opacity:1 !important; }
</style>
`;

if (!indexHtml.includes('Mobile nav fix')) {
  indexHtml = indexHtml.replace('</head>', mnavFix + '</head>');
  fs.writeFileSync(indexFile, indexHtml, 'utf8');
  console.log('✓ index.html: inline mnav fix added');
} else {
  console.log('✓ index.html: inline mnav fix already present');
}

// ── Fix 2: Same for about.html ──
const aboutFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html');
let aboutHtml = fs.readFileSync(aboutFile, 'utf8');
if (!aboutHtml.includes('Mobile nav fix')) {
  aboutHtml = aboutHtml.replace('</head>', mnavFix + '</head>');
  fs.writeFileSync(aboutFile, aboutHtml, 'utf8');
  console.log('✓ about.html: inline mnav fix added');
}

// ── Fix 3: Same for services.html ──
const servicesFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\services.html');
let servicesHtml = fs.readFileSync(servicesFile, 'utf8');
if (!servicesHtml.includes('Mobile nav fix')) {
  servicesHtml = servicesHtml.replace('</head>', mnavFix + '</head>');
  fs.writeFileSync(servicesFile, servicesHtml, 'utf8');
  console.log('✓ services.html: inline mnav fix added');
}

// ── Fix 4: Same for reviews.html ──
const reviewsFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html');
let reviewsHtml = fs.readFileSync(reviewsFile, 'utf8');
if (!reviewsHtml.includes('Mobile nav fix')) {
  reviewsHtml = reviewsHtml.replace('</head>', mnavFix + '</head>');
  fs.writeFileSync(reviewsFile, reviewsHtml, 'utf8');
  console.log('✓ reviews.html: inline mnav fix added');
}

// ── Fix 5: Also fix the CSS file ──
const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let css = fs.readFileSync(cssFile, 'utf8');

// Replace the mnav rules with more robust versions
css = css.replace(
  '.mnav { position:fixed;top:70px;left:0;right:0;bottom:0;background:#fff;z-index:999;display:none;flex-direction:column;align-items:center;justify-content:center;gap:32px;padding:40px 24px;overflow-y:auto }',
  '.mnav { position:fixed;top:70px;left:0;right:0;bottom:0;background:#fff;z-index:9999;display:none;flex-direction:column;align-items:center;justify-content:center;gap:32px;padding:40px 24px;overflow-y:auto }'
);

css = css.replace(
  '.mnav.open { display:flex !important }',
  '.mnav.open { display:flex !important;visibility:visible !important;opacity:1 !important }'
);

fs.writeFileSync(cssFile, css, 'utf8');
console.log('✓ style.css: mnav z-index raised to 9999');

console.log('\nDone!');
