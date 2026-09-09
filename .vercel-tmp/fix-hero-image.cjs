const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let css = fs.readFileSync(cssFile, 'utf8');

// ── Fix 1: At 1100px, keep 2-column hero (text left, image right) ──
// Remove single-column + order:-1 that pushes image above text
css = css.replace(
  '.hero-container{grid-template-columns:1fr;gap:40px;text-align:center}',
  '.hero-container{grid-template-columns:1fr 1fr;gap:30px;text-align:left}'
);
css = css.replace(
  '.hero-visual{max-width:480px;margin:0 auto;order:-1} .visual-card{display:none}',
  '.hero-visual{max-width:100%;margin:0;order:0} .visual-card{display:none}'
);
// Also fix hcnt which was constrained for single column
css = css.replace(
  '.hcnt{max-width:700px;margin:0 auto}',
  '.hcnt{max-width:100%;margin:0}'
);
css = css.replace(
  '.hero-trust{justify-content:center} .hero-proof{justify-content:center}',
  '.hero-trust{justify-content:flex-start} .hero-proof{justify-content:flex-start}'
);

// ── Fix 2: At 1024px, flatten 3D but keep 2-column layout ──
// Replace the 1024px block to keep 2-column hero
css = css.replace(
  '.hero-visual { perspective:none;position:relative }',
  '.hero-container{grid-template-columns:1fr 1fr;gap:24px} .hero-visual { perspective:none;position:relative }'
);

// ── Fix 3: Add 900px breakpoint to switch to single column properly ──
const breakpoint900 = `
/* ── 900px: Stack hero, image on top ── */
@media(max-width:900px) {
  .hero-container { grid-template-columns:1fr;gap:40px;text-align:center }
  .hcnt { max-width:600px;margin:0 auto }
  .hero-visual { max-width:420px;margin:0 auto;order:-1 }
  .hero-trust { justify-content:center }
  .hero-proof { justify-content:center }
  .visual-main { max-width:380px }
  .dashboard-3d { max-width:360px }
}
`;

// Insert before the 768px block
css = css.replace(
  '@media(max-width:768px) {',
  breakpoint900.trim() + '\n@media(max-width:768px) {'
);

// ── Fix 4: At 768px, ensure image is not compressed ──
// Replace the overly-small visual-main max-width:320px with a better value
css = css.replace(
  '.visual-main{max-width:320px;margin:0 auto}',
  '.visual-main{max-width:100%;margin:0 auto}'
);

fs.writeFileSync(cssFile, css, 'utf8');

// ── Verify ──
const updated = fs.readFileSync(cssFile, 'utf8');
const checks = [
  { label: '1100px: Hero keeps 2-col layout', pass: updated.includes('.hero-container{grid-template-columns:1fr 1fr;gap:30px;text-align:left}') },
  { label: '1100px: No order:-1 on visual', pass: updated.includes('.hero-visual{max-width:100%;margin:0;order:0}') },
  { label: '1024px: Hero still 2-col', pass: updated.includes('.hero-container{grid-template-columns:1fr 1fr;gap:24px}') },
  { label: '900px: Stacks with image on top', pass: updated.includes('.hero-container { grid-template-columns:1fr;gap:40px;text-align:center }') },
  { label: '900px: order:-1 on visual', pass: updated.includes('.hero-visual { max-width:420px;margin:0 auto;order:-1 }') },
  { label: '768px: visual-main not compressed', pass: updated.includes('.visual-main{max-width:100%') },
];

console.log('─── Hero Image Responsive Fix ───');
checks.forEach(c => console.log('  ' + (c.pass ? '✓' : '✗') + ' ' + c.label));
console.log('');
console.log('Done!');
