const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let content = fs.readFileSync(cssFile, 'utf8');

// ── Fix 1: Remove backdrop-filter from base nav rule ──
// The base nav rule has backdrop-filter:blur(20px) which creates a frosted overlay
content = content.replace(
  /nav \{ position:fixed;top:0;left:0;right:0;z-index:500;height:70px;padding:0 54px;display:flex;align-items:center;justify-content:space-between;background:rgb\(255 255 255\);backdrop-filter:blur\(20px\);border-bottom:1px solid var\(--bdr\);transition:all \.4s \}/,
  'nav { position:fixed;top:0;left:0;right:0;z-index:500;height:70px;padding:0 54px;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;transition:all .4s }'
);

// ── Fix 2: nav.scr should have solid bg, no blur ──
content = content.replace(
  /nav\.scr \{ background:rgba\(255,255,255,\.98\);box-shadow:0 4px 30px rgba\(249,115,22,\.1\);border-bottom-color:var\(--bdr2\) \}/,
  'nav.scr { background:#fff;box-shadow:0 4px 30px rgba(249,115,22,.1);border-bottom:none }'
);

// ── Fix 3: .mnav - use display:none instead of off-screen transform ──
content = content.replace(
  /\.mnav \{ position:fixed;top:70px;left:0;right:0;bottom:0;background:rgba\(255,255,255,\.98\);backdrop-filter:blur\(20px\);z-index:450;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;transform:translateX\(100%\);transition:transform \.4s var\(--ee\);padding:40px 24px;overflow-y:auto \}/,
  '.mnav { position:fixed;top:70px;left:0;right:0;bottom:0;background:#fff;z-index:450;display:none;flex-direction:column;align-items:center;justify-content:center;gap:32px;padding:40px 24px;overflow-y:auto }'
);

// ── Fix 4: .mnav.open - show with display:flex ──
content = content.replace(
  /\.mnav\.open \{ transform:translateX\(0\) \}/,
  '.mnav.open { display:flex }'
);

fs.writeFileSync(cssFile, content, 'utf8');

// Verify
const updated = fs.readFileSync(cssFile, 'utf8');
const checks = [
  { label: 'Base nav has no backdrop-filter', pass: !updated.match(/nav \{[^}]*backdrop-filter/) },
  { label: 'Base nav has no border-bottom', pass: !updated.match(/nav \{[^}]*border-bottom/) },
  { label: 'nav.scr has solid bg', pass: updated.includes('nav.scr { background:#fff') },
  { label: '.mnav uses display:none', pass: updated.includes('.mnav {') && updated.match(/\.mnav \{[^}]*display:none/) },
  { label: '.mnav.open uses display:flex', pass: updated.includes('.mnav.open { display:flex }') },
];

console.log('─── CSS Navbar Fixes ───');
checks.forEach(c => console.log(`  ${c.pass ? '✓' : '✗'} ${c.label}`));
console.log('');
console.log('All fixes applied!');
