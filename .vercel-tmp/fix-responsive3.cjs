const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let css = fs.readFileSync(cssFile, 'utf8');

const hasCRLF = css.includes('\r\n');
console.log('File has CRLF:', hasCRLF);

// ── Enhance 768px breakpoint ──
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

// Use string-based approach: find the 768px block and the 480px block
// Find "@media(max-width:768px)" and "@media(max-width:480px)"
const idx768 = css.indexOf('@media(max-width:768px)');
const idx480 = css.indexOf('@media(max-width:480px)');

if (idx768 !== -1 && idx480 !== -1) {
  // Find the closing } of the 768px block (right before the 480px block)
  // Look backwards from idx480 to find the }
  let closeBrace768 = css.lastIndexOf('}', idx480);
  if (closeBrace768 !== -1) {
    css = css.slice(0, closeBrace768) + extra768.trim() + '\n' + css.slice(closeBrace768);
    console.log('✓ 768px enhanced');
  } else {
    console.log('✗ Could not find 768px closing brace');
  }
} else {
  console.log('✗ Could not find 768px or 480px blocks');
}

// Re-read positions after modification
const idx480b = css.indexOf('@media(max-width:480px)');

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

if (idx480b !== -1) {
  // Find the closing } of the 480px block
  // Look for the next } after the 480px block content
  const blockStart = css.indexOf('{', idx480b);
  if (blockStart !== -1) {
    // Find matching closing brace
    let depth = 1;
    let pos = blockStart + 1;
    while (pos < css.length && depth > 0) {
      if (css[pos] === '{') depth++;
      if (css[pos] === '}') depth--;
      if (depth > 0) pos++;
    }
    // pos is now at the closing }
    css = css.slice(0, pos) + extra480.trim() + '\n' + css.slice(pos);
    console.log('✓ 480px enhanced');
  }
}

fs.writeFileSync(cssFile, css, 'utf8');

// Verify
const updated = fs.readFileSync(cssFile, 'utf8');
console.log('');
console.log('─── Verification ───');
console.log('  ' + (updated.includes('.fsub{width:100%') ? '✓' : '✗') + ' 768px: form submit full width');
console.log('  ' + (updated.includes('.bblu,.bout{width:100%') ? '✓' : '✗') + ' 480px: buttons full width');
console.log('  ' + (updated.includes('.stbar{padding:50px 20px}') ? '✓' : '✗') + ' Stats bar responsive');
console.log('  ' + (updated.includes('.eband{padding:60px 20px}') ? '✓' : '✗') + ' Email band responsive');
console.log('  ' + (updated.includes('.tau{flex-direction:column') ? '✓' : '✗') + ' Testimonial author responsive');
console.log('  ' + (updated.includes('.nlogo .tag{display:none}') ? '✓' : '✗') + ' Logo tag hidden on mobile');
console.log('');
console.log('Done!');
