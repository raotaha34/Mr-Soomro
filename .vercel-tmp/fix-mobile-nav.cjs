const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let css = fs.readFileSync(cssFile, 'utf8');

// ── Fix 1: Make .mnav.open use !important to guarantee override ──
css = css.replace(
  '.mnav.open { display:flex }',
  '.mnav.open { display:flex !important }'
);

// ── Fix 2: Ensure .mnav has proper z-index above all content ──
css = css.replace(
  '.mnav { position:fixed;top:70px;left:0;right:0;bottom:0;background:#fff;z-index:450;display:none;flex-direction:column;align-items:center;justify-content:center;gap:32px;padding:40px 24px;overflow-y:auto }',
  '.mnav { position:fixed;top:70px;left:0;right:0;bottom:0;background:#fff;z-index:999;display:none;flex-direction:column;align-items:center;justify-content:center;gap:32px;padding:40px 24px;overflow-y:auto }'
);

// ── Fix 3: Ensure hamburger button is visible and clickable ──
// At 768px, make sure .nbg has proper z-index and position
css = css.replace(
  '.nbg{display:flex;width:40px;height:40px;align-items:center;justify-content:center;border:1px solid var(--bdr);border-radius:10px}',
  '.nbg{display:flex !important;width:40px;height:40px;align-items:center;justify-content:center;border:1px solid var(--bdr);border-radius:10px;position:relative;z-index:1000;cursor:pointer;flex-shrink:0}'
);

// ── Fix 4: Ensure nav doesn't clip the hamburger button ──
// Add overflow:visible to nav at 768px
const media768 = css.indexOf('@media(max-width:768px)');
if (media768 !== -1) {
  // Find the nav rule within 768px and add overflow:visible
  css = css.replace(
    /(@media\(max-width:768px\)\s*\{[^}]*?nav\{padding:0 16px;height:60px\})/,
    '$1 nav{overflow:visible}'
  );
}

// ── Fix 5: Also fix the nav base rule to not clip ──
css = css.replace(
  'nav { position:fixed;top:0;left:0;right:0;z-index:500;height:70px;padding:0 54px;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;transition:all .4s }',
  'nav { position:fixed;top:0;left:0;right:0;z-index:500;height:70px;padding:0 54px;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;transition:all .4s;overflow:visible }'
);

fs.writeFileSync(cssFile, css, 'utf8');

// Verify
const updated = fs.readFileSync(cssFile, 'utf8');
const checks = [
  { label: '.mnav.open uses !important', pass: updated.includes('.mnav.open { display:flex !important }') },
  { label: '.mnav z-index raised to 999', pass: updated.includes('.mnav { position:fixed;top:70px;left:0;right:0;bottom:0;background:#fff;z-index:999') },
  { label: '.nbg has !important + z-index', pass: updated.includes('.nbg{display:flex !important') && updated.includes('z-index:1000;cursor:pointer') },
  { label: 'nav base has overflow:visible', pass: updated.includes('nav { position:fixed;top:0;') && updated.includes('overflow:visible }') },
];

console.log('─── Mobile Sidebar Fix ───');
checks.forEach(c => console.log('  ' + (c.pass ? '✓' : '✗') + ' ' + c.label));
console.log('');
console.log('Done!');
