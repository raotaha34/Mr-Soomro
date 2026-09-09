const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let css = fs.readFileSync(cssFile, 'utf8');

// Normalize line endings for matching
const hasCRLF = css.includes('\r\n');
console.log('File has CRLF:', hasCRLF);

// ── Enhance 768px breakpoint ──
// Find the closing of the 768px block - use regex to handle both line endings
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

// Match the end of 768px block: .whys{padding:60px 20px} followed by }
const re768 = /(\.whys\{padding:60px 20px\}\s*\n)(\s*\})/;
if (re768.test(css)) {
  css = css.replace(re768, '$1' + extra768.trim() + '\n$2');
  console.log('✓ 768px enhanced');
} else {
  // Try alternate approach - find the 768px block and insert before its closing brace
  const re768alt = /@media\(max-width:768px\)\s*\{([\s\S]*?)\n\}\s*\n\s*@media\(max-width:480px\)/;
  const match768 = css.match(re768alt);
  if (match768) {
    const block = match768[1];
    const newBlock = block + '\n' + extra768.trim();
    css = css.replace(block, newBlock);
    console.log('✓ 768px enhanced (alt method)');
  } else {
    console.log('✗ Could not find 768px block');
  }
}

// ── Enhance 480px breakpoint ──
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

// Match the end of 480px block
const re480 = /(\.hh1\{font-size:clamp\(48px,14vw,76px)\}\s*\.cnf\{padding:26px\}\s*\n)(\s*\})/;
if (re480.test(css)) {
  css = css.replace(re480, '$1' + extra480.trim() + '\n$2');
  console.log('✓ 480px enhanced');
} else {
  // Alternate: find 480px block
  const re480alt = /@media\(max-width:480px\)\s*\{([\s\S]*?)\n\}/;
  const match480 = css.match(re480alt);
  if (match480) {
    const block = match480[1];
    const newBlock = block + '\n' + extra480.trim();
    css = css.replace(block, newBlock);
    console.log('✓ 480px enhanced (alt method)');
  } else {
    console.log('✗ Could not find 480px block');
  }
}

fs.writeFileSync(cssFile, css, 'utf8');

// Verify
const updated = fs.readFileSync(cssFile, 'utf8');
console.log('');
console.log('─── Verification ───');
console.log('  ' + (updated.includes('.fsub{width:100%') ? '✓' : '✗') + ' 768px extra rules present');
console.log('  ' + (updated.includes('.bblu,.bout{width:100%') ? '✓' : '✗') + ' 480px extra rules present');
console.log('  ' + (updated.includes('.stbar{padding:50px 20px}') ? '✓' : '✗') + ' Stats bar responsive');
console.log('  ' + (updated.includes('.eband{padding:60px 20px}') ? '✓' : '✗') + ' Email band responsive');
console.log('');
console.log('Done!');
