const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let css = fs.readFileSync(cssFile, 'utf8');

// ── Fix 1: Make .mnav fully opaque (no transparency/blur) ──
css = css.replace(
  '.mnav { position:fixed;top:70px;left:0;right:0;bottom:0;background:rgba(255,255,255,.98);backdrop-filter:blur(20px);z-index:450;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;transform:translateX(100%);transition:transform .4s var(--ee);padding:40px 24px;overflow-y:auto }',
  '.mnav { position:fixed;top:70px;left:0;right:0;bottom:0;background:#fff;z-index:999;display:none;flex-direction:column;align-items:center;justify-content:center;gap:32px;padding:40px 24px;overflow-y:auto }'
);

// ── Fix 2: .mnav.open shows with display:flex ──
css = css.replace(
  '.mnav.open { transform:translateX(0) }',
  '.mnav.open { display:flex !important }'
);

// ── Fix 3: Ensure hamburger button is visible and clickable ──
css = css.replace(
  '.nbg{display:flex;width:40px;height:40px;align-items:center;justify-content:center;border:1px solid var(--bdr);border-radius:10px}',
  '.nbg{display:flex !important;width:40px;height:40px;align-items:center;justify-content:center;border:1px solid var(--bdr);border-radius:10px;position:relative;z-index:1000;cursor:pointer;flex-shrink:0}'
);

// ── Fix 4: nav overflow visible so burger isn't clipped ──
css = css.replace(
  'nav { position:fixed;top:0;left:0;right:0;z-index:500;height:70px;padding:0 54px;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;transition:all .4s }',
  'nav { position:fixed;top:0;left:0;right:0;z-index:500;height:70px;padding:0 54px;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;transition:all .4s;overflow:visible }'
);

fs.writeFileSync(cssFile, css, 'utf8');
console.log('✓ style.css: mnav made fully opaque, display toggle fixed');

// ── Fix 5: Update JS to use direct style.display ──
const files = [
  { path: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\index.html', name: 'index.html' },
  { path: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html', name: 'about.html' },
  { path: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\services.html', name: 'services.html' },
  { path: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html', name: 'reviews.html' },
];

files.forEach(f => {
  let html = fs.readFileSync(f.path, 'utf8');

  // Fix closeMob
  html = html.replace(
    /function closeMob\(\)\s*\{[\s\S]*?const m = document\.getElementById\('mobNav'\);[\s\S]*?if \(m\) m\.classList\.remove\('open'\);[\s\S]*?\}/,
    `function closeMob() {
      var m = document.getElementById('mobNav');
      if (m) { m.classList.remove('open'); m.style.display = 'none'; }
      var b = document.getElementById('burger');
      if (b) { b.classList.remove('open'); }
      document.body.style.overflow = '';
    }`
  );

  // Fix burger click
  html = html.replace(
    /const burger = document\.getElementById\('burger'\);[\s\S]*?if \(burger\) burger\.addEventListener\('click', function\(\) \{[\s\S]*?this\.classList\.toggle\('open'\);[\s\S]*?document\.getElementById\('mobNav'\)\.classList\.toggle\('open'\);[\s\S]*?\}\);/,
    `var burger = document.getElementById('burger');
    if (burger) burger.addEventListener('click', function(e) {
      e.stopPropagation();
      var mobNav = document.getElementById('mobNav');
      var isOpen = this.classList.toggle('open');
      mobNav.classList.toggle('open');
      mobNav.style.display = isOpen ? 'flex' : 'none';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });`
  );

  // Bump cache version
  html = html.replace(/css\/style\.css\?v=3/g, 'css/style.css?v=5');
  html = html.replace(/script\.js\?v=3/g, 'script.js?v=5');

  fs.writeFileSync(f.path, html, 'utf8');
  console.log('✓ ' + f.name + ': JS + cache version updated');
});

console.log('\nDone!');
