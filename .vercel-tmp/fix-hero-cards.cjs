const fs = require('fs');
const path = require('path');

const file = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\index.html');
let html = fs.readFileSync(file, 'utf8');

// ── Fix 1: .hero-visual — add overflow:visible, auto height ──
html = html.replace(
  /\.hero-visual \{\s*position: relative;\s*z-index: 3;\s*perspective: 1200px;\s*height: 560px;\s*display: flex;\s*align-items: center;\s*justify-content: center;\s*\}/,
  `.hero-visual {
      position: relative;
      z-index: 3;
      perspective: 1200px;
      min-height: 520px;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
    }`
);

// ── Fix 2: .visual-3d-scene — overflow visible ──
html = html.replace(
  /\.visual-3d-scene \{\s*position: relative;\s*width: 100%;\s*height: 100%;\s*transform-style: preserve-3d;\s*animation: sceneFloat 8s ease-in-out infinite;\s*\}/,
  `.visual-3d-scene {
      position: relative;
      width: 100%;
      min-height: 480px;
      height: auto;
      transform-style: preserve-3d;
      animation: sceneFloat 8s ease-in-out infinite;
      overflow: visible;
    }`
);

// ── Fix 3: Reposition cards INSIDE bounds, no overlap ──
// Card 1: top-right area
html = html.replace(
  /\.card-1 \{\s*top: 8%;\s*right: -20px;\s*transform: translateZ\(80px\);\s*animation: card1Float 6s ease-in-out infinite;\s*\}/,
  `.card-1 {
      top: 5%;
      right: 5%;
      transform: translateZ(80px);
      animation: card1Float 6s ease-in-out infinite;
    }`
);

// Card 2: bottom-left area
html = html.replace(
  /\.card-2 \{\s*bottom: 18%;\s*left: -30px;\s*transform: translateZ\(60px\);\s*animation: card2Float 7s ease-in-out infinite;\s*\}/,
  `.card-2 {
      bottom: 8%;
      left: 3%;
      transform: translateZ(60px);
      animation: card2Float 7s ease-in-out infinite;
    }`
);

// Card 3: middle-right area
html = html.replace(
  /\.card-3 \{\s*top: 42%;\s*right: -40px;\s*transform: translateZ\(100px\);\s*animation: card3Float 5.5s ease-in-out infinite;\s*\}/,
  `.card-3 {
      top: 45%;
      right: 2%;
      transform: translateZ(100px);
      animation: card3Float 5.5s ease-in-out infinite;
    }`
);

// ── Fix 4: Update card float animations to match new positions ──
html = html.replace(
  /@keyframes card1Float \{\s*0%, 100% \{ transform: translateZ\(80px\) translateY\(0\); \}\s*50% \{ transform: translateZ\(80px\) translateY\(-12px\); \}\s*\}/,
  `@keyframes card1Float {
      0%, 100% { transform: translateZ(80px) translateY(0); }
      50% { transform: translateZ(80px) translateY(-10px); }
    }`
);

html = html.replace(
  /@keyframes card2Float \{\s*0%, 100% \{ transform: translateZ\(60px\) translateY\(0\); \}\s*50% \{ transform: translateZ\(60px\) translateY\(-15px\); \}\s*\}/,
  `@keyframes card2Float {
      0%, 100% { transform: translateZ(60px) translateY(0); }
      50% { transform: translateZ(60px) translateY(-10px); }
    }`
);

html = html.replace(
  /@keyframes card3Float \{\s*0%, 100% \{ transform: translateZ\(100px\) translateY\(0\); \}\s*50% \{ transform: translateZ\(100px\) translateY\(-10px\); \}\s*\}/,
  `@keyframes card3Float {
      0%, 100% { transform: translateZ(100px) translateY(0); }
      50% { transform: translateZ(100px) translateY(-8px); }
    }`
);

// ── Fix 5: Update responsive rules — show cards at 1024px (they were hidden) ──
// At 1024px inline: change from display:none to visible with adjusted positions
html = html.replace(
  /\.card-1, \.card-2, \.card-3 \{ display: none; \}\s*\n\s*\.abg/,
  `.card-1 { right: 2%; top: 3%; }
      .card-2 { left: 2%; bottom: 5%; }
      .card-3 { right: 0; top: 48%; }
      .abg`
);

// ── Fix 6: Also fix the 768px card hiding ──
html = html.replace(
  /\.card-1, \.card-2, \.card-3 \{ display: none; \}\s*\n\s*\.stg/,
  `.card-1, .card-2, .card-3 { display: none; }
      .stg`
);

fs.writeFileSync(file, html, 'utf8');

// ── Verify ──
const updated = fs.readFileSync(file, 'utf8');
const checks = [
  { label: 'hero-visual: overflow visible', pass: /hero-visual[\s\S]*?overflow:\s*visible/.test(updated) },
  { label: 'hero-visual: auto height', pass: /hero-visual[\s\S]*?height:\s*auto/.test(updated) },
  { label: 'visual-3d-scene: overflow visible', pass: /visual-3d-scene[\s\S]*?overflow:\s*visible/.test(updated) },
  { label: 'card-1: inside bounds (right: 5%)', pass: updated.includes('right: 5%') },
  { label: 'card-2: inside bounds (left: 3%)', pass: updated.includes('left: 3%') },
  { label: 'card-3: inside bounds (right: 2%)', pass: updated.includes('right: 2%') },
  { label: '1024px: cards visible (not display:none)', pass: updated.includes('.card-1 { right: 2%; top: 3%; }') },
];

console.log('─── Hero Visual Card Fixes ───');
checks.forEach(c => console.log('  ' + (c.pass ? '✓' : '✗') + ' ' + c.label));
console.log('');
console.log('Done!');
