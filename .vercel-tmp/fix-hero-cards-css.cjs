const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let css = fs.readFileSync(cssFile, 'utf8');

// ── Fix 1: At 1100px, keep cards visible (remove display:none) ──
css = css.replace(
  '.hero-visual{max-width:100%;margin:0;order:0} .visual-card{display:none}',
  '.hero-visual{max-width:100%;margin:0;order:0;overflow:visible}'
);

// ── Fix 2: At 1024px, keep cards visible with adjusted positions ──
css = css.replace(
  '  .card-1,.card-2,.card-3 { display:none }',
  '  .card-1,.card-2,.card-3 { display:flex }'
);

// ── Fix 3: Ensure hero-visual in style.css also has overflow visible ──
// The base .hero-visual rule in style.css
css = css.replace(
  '.hero-visual { position:relative;display:flex;align-items:center;justify-content:center }',
  '.hero-visual { position:relative;display:flex;align-items:center;justify-content:center;overflow:visible }'
);

// ── Fix 4: At 768px, keep cards hidden (too small for them) ──
// This is fine as-is, just verify
const has768hide = css.includes('.visual-card{display:none} .visual-main');
console.log('768px hides cards:', has768hide ? 'yes' : 'check manually');

fs.writeFileSync(cssFile, css, 'utf8');

// Verify
const updated = fs.readFileSync(cssFile, 'utf8');
const checks = [
  { label: '1100px: cards not hidden', pass: !updated.includes('.hero-visual{max-width:100%;margin:0;order:0} .visual-card{display:none}') },
  { label: '1100px: overflow visible on visual', pass: updated.includes('.hero-visual{max-width:100%;margin:0;order:0;overflow:visible}') },
  { label: '1024px: cards visible (display:flex)', pass: updated.includes('.card-1,.card-2,.card-3 { display:flex }') },
  { label: 'Base hero-visual: overflow visible', pass: updated.includes('.hero-visual { position:relative;display:flex;align-items:center;justify-content:center;overflow:visible }') },
];

console.log('─── Style.css Card Fixes ───');
checks.forEach(c => console.log('  ' + (c.pass ? '✓' : '✗') + ' ' + c.label));
console.log('');
console.log('Done!');
