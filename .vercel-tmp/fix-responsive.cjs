const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let css = fs.readFileSync(cssFile, 'utf8');

// ── 1. Add @media(max-width:1024px) block to fill the gap ──
// This handles the 1025-1100px range where 1100px breakpoint fires but inline styles don't
const breakpoint1024 = `
/* ── 1024px: Flatten 3D hero + fix overflow ── */
@media(max-width:1024px) {
  .hero-visual { perspective:none;position:relative }
  .visual-3d-scene,.visual-main { position:relative;height:auto;animation:none;transform:none;transform-style:flat }
  .dashboard-3d { position:relative;top:auto;left:auto;transform:none;width:100%;max-width:440px;margin:0 auto }
  .card-1,.card-2,.card-3 { display:none }
  .visual-glow { position:absolute;inset:-10px;filter:blur(30px) }
  .hcnt { max-width:100% }
  .hsub { max-width:100% }
  .hero-proof { flex-wrap:wrap }
  .hacts { flex-wrap:wrap }
  .abg { grid-template-columns:1fr;gap:60px }
  .abvis { max-width:500px;margin:0 auto }
  .cng { grid-template-columns:1fr;gap:50px }
  .ftt { grid-template-columns:repeat(3,1fr) }
  .stbar { padding:60px 40px }
  .stg { gap:28px }
  .eband { padding:70px 40px }
  .ebfrm { max-width:100% }
  .whys { padding:80px 40px }
  #clients { padding:80px 40px }
  #testimonials { padding:100px 40px }
  .tq { font-size:clamp(22px,3.5vw,40px) }
  .prg { gap:30px }
  .whyg { gap:20px }
  nav { overflow:hidden }
  .nlinks { gap:24px }
  .nlinks a { font-size:12px }
}
`;

// ── 2. Enhance existing 768px breakpoint with missing rules ──
// Add these BEFORE the closing } of the 768px block
const extra768 = `
  .stbar{padding:50px 20px}
  .eband{padding:60px 20px}
  #testimonials{padding:80px 20px}
  .tq{font-size:20px}
  .tst{margin-bottom:18px}
  .tct{margin-top:36px}
  .whys{padding:60px 20px}
  .frw{grid-template-columns:1fr}
  .fsub{width:100%;text-align:center;justify-content:center}
  .soc-row{justify-content:center}
  .nlogo .tag{display:none}
  .hero-trust{gap:20px}
  .trust-num{font-size:24px}
`;

// ── 3. Enhance 480px breakpoint ──
const extra480 = `
  .stbar{padding:40px 20px}
  .stg{grid-template-columns:1fr 1fr;gap:20px}
  .eband{padding:50px 20px}
  .ebtit{font-size:28px}
  .ebsub{font-size:14px}
  .tq{font-size:18px}
  .tau{flex-direction:column;align-items:flex-start;gap:12px}
  .tav{width:44px;height:44px}
  .tnm{font-size:17px}
  .trl{font-size:12px}
  .ftt{grid-template-columns:1fr}
  .ftbt{flex-direction:column;text-align:center}
  .ftbl{justify-content:center;flex-wrap:wrap}
  .hh1{font-size:clamp(40px,12vw,60px)}
  .hsub{font-size:15px}
  .bblu,.bout{width:100%;justify-content:center}
  .hacts{width:100%}
  .proof-text{font-size:12px}
  .cnf{padding:24px}
  .prnm{font-size:20px}
  .prd{font-size:14px}
  .prn{width:60px;height:60px;font-size:20px}
`;

// Insert 1024px block BEFORE the existing 768px responsive block
css = css.replace(
  '@media(max-width:768px) {',
  breakpoint1024.trim() + '\n@media(max-width:768px) {'
);

// Insert extra 768px rules BEFORE the closing } of the 768px block
// Find the 768px block's closing brace
const idx768close = css.indexOf('.whys{padding:60px 20px}\n}');
if (idx768close !== -1) {
  const insertPos = idx768close + '.whys{padding:60px 20px}'.length;
  css = css.slice(0, insertPos) + '\n' + extra768.trim() + css.slice(insertPos);
}

// Insert extra 480px rules BEFORE the closing } of the 480px block
const idx480close = css.indexOf('.hh1{font-size:clamp(48px,14vw,76px)} .cnf{padding:26px}\n}');
if (idx480close !== -1) {
  const insertPos480 = idx480close + '.hh1{font-size:clamp(48px,14vw,76px)} .cnf{padding:26px}'.length;
  css = css.slice(0, insertPos480) + '\n' + extra480.trim() + css.slice(insertPos480);
}

// ── 4. Add global responsive safeguards ──
// Ensure no element overflows viewport
const globalSafeguards = `
/* ── GLOBAL RESPONSIVE SAFEGUARDS ── */
img,video,svg,canvas { max-width:100%;height:auto }
table { max-width:100%;overflow-x:auto;display:block }
.hero-container,.abg,.cng,.stg,.whyg,.prg,.frw,.ftt { width:100%;overflow:hidden }
section,footer,.hero,.stbar,.eband,.whys,#clients,#testimonials { overflow-x:hidden }
`;

// Insert safeguards just before the REVEAL section
css = css.replace(
  '/* ── REVEAL ── */',
  globalSafeguards + '\n/* ── REVEAL ── */'
);

fs.writeFileSync(cssFile, css, 'utf8');

// ── Verify ──
const updated = fs.readFileSync(cssFile, 'utf8');
const checks = [
  { label: '1024px breakpoint added', pass: updated.includes('@media(max-width:1024px)') },
  { label: 'Hero 3D scene flattened at 1024px', pass: updated.includes('.visual-3d-scene,.visual-main { position:relative') },
  { label: 'Dashboard repositioned', pass: updated.includes('.dashboard-3d { position:relative;top:auto') },
  { label: 'Nav overflow hidden', pass: updated.includes('nav { overflow:hidden }') },
  { label: 'Global safeguards added', pass: updated.includes('GLOBAL RESPONSIVE SAFEGUARDS') },
  { label: 'Enhanced 768px rules', pass: updated.includes('.fsub{width:100%') },
  { label: 'Enhanced 480px rules', pass: updated.includes('.bblu,.bout{width:100%') },
];

console.log('─── Comprehensive Responsive Fixes ───');
checks.forEach(c => console.log(`  ${c.pass ? '✓' : '✗'} ${c.label}`));
console.log('');
console.log('All responsive fixes applied to style.css!');
