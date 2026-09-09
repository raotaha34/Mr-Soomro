const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let css = fs.readFileSync(cssFile, 'utf8');

// ═══════════════════════════════════════════
// FIX 1: Transparent navbar - remove backdrop-filter, border, make transparent
// ═══════════════════════════════════════════
css = css.replace(
  'nav { position:fixed;top:0;left:0;right:0;z-index:500;height:70px;padding:0 54px;display:flex;align-items:center;justify-content:space-between;background:rgb(255 255 255);backdrop-filter:blur(20px);border-bottom:1px solid var(--bdr);transition:all .4s }',
  'nav { position:fixed;top:0;left:0;right:0;z-index:500;height:70px;padding:0 54px;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;transition:all .4s;overflow:visible }'
);
css = css.replace(
  'nav.scr { background:rgba(255,255,255,.98);box-shadow:0 4px 30px rgba(249,115,22,.1);border-bottom-color:var(--bdr2) }',
  'nav.scr { background:#fff;box-shadow:0 4px 30px rgba(249,115,22,.1);border-bottom:none }'
);
console.log('✓ Fix 1: Navbar transparency removed');

// ═══════════════════════════════════════════
// FIX 2: Mobile sidebar - make opaque, display toggle
// ═══════════════════════════════════════════
css = css.replace(
  '.mnav { position:fixed;top:70px;left:0;right:0;bottom:0;background:rgba(255,255,255,.98);backdrop-filter:blur(20px);z-index:450;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;transform:translateX(100%);transition:transform .4s var(--ee);padding:40px 24px;overflow-y:auto }',
  '.mnav { position:fixed;top:70px;left:0;right:0;bottom:0;background:#fff;z-index:999;display:none;flex-direction:column;align-items:center;justify-content:center;gap:32px;padding:40px 24px;overflow-y:auto }'
);
css = css.replace(
  '.mnav.open { transform:translateX(0) }',
  '.mnav.open { display:flex !important }'
);
console.log('✓ Fix 2: Mobile sidebar made opaque, display toggle');

// ═══════════════════════════════════════════
// FIX 3: Hero visual overflow + responsive breakpoints
// ═══════════════════════════════════════════
// Base hero-visual: add overflow:visible
css = css.replace(
  '.hero-visual { position:relative;display:flex;align-items:center;justify-content:center }',
  '.hero-visual { position:relative;display:flex;align-items:center;justify-content:center;overflow:visible }'
);

// Fix 1100px breakpoint: keep 2-column, don't hide cards
css = css.replace(
  '.hero-container{grid-template-columns:1fr;gap:40px;text-align:center}',
  '.hero-container{grid-template-columns:1fr 1fr;gap:30px;text-align:left}'
);
css = css.replace(
  '.hero-visual{max-width:480px;margin:0 auto;order:-1} .visual-card{display:none}',
  '.hero-visual{max-width:100%;margin:0;order:0;overflow:visible}'
);
console.log('✓ Fix 3: 1100px breakpoint - 2-column layout, cards visible');

// ═══════════════════════════════════════════
// FIX 4: Add 1024px + 900px breakpoints before 768px
// ═══════════════════════════════════════════
const bp768 = '@media(max-width:768px)';
const idx768 = css.indexOf(bp768);
if (idx768 !== -1 && !css.includes('@media(max-width:1024px)')) {
  const newBreakpoints = `@media(max-width:1024px) {
  .hero-container{grid-template-columns:1fr 1fr;gap:24px}
  .visual-3d-scene { animation:none;transform:none;transform-style:flat }
  .dashboard-3d { position:relative;top:auto;left:auto;transform:none;width:100%;max-width:400px;margin:0 auto }
  .card-1,.card-2,.card-3 { display:flex }
}
@media(max-width:900px) {
  .hero-container { grid-template-columns:1fr;gap:40px;text-align:center }
  .hcnt { max-width:600px;margin:0 auto }
  .hero-visual { max-width:420px;margin:0 auto;order:-1 }
  .hero-trust { justify-content:center }
  .hero-proof { justify-content:center }
}
`;
  css = css.slice(0, idx768) + newBreakpoints + css.slice(idx768);
  console.log('✓ Fix 4: Added 1024px + 900px breakpoints');
}

// ═══════════════════════════════════════════
// FIX 5: At 768px, keep cards hidden (too small) + overflow guards
// ═══════════════════════════════════════════
// Add global overflow safeguards at the end
if (!css.includes('overflow-x:hidden')) {
  css += `\n\n/* ── GLOBAL OVERFLOW SAFEGUARDS ── */\nimg,video,svg,canvas { max-width:100%;height:auto }\n.hero-container,.abg,.cng,.stg,.whyg,.prg,.frw,.ftt { width:100%;overflow:hidden }\nsection,footer,.hero,.stbar,.eband,.whys,#clients,#testimonials { overflow-x:hidden }\n`;
  console.log('✓ Fix 5: Global overflow safeguards added');
}

fs.writeFileSync(cssFile, css, 'utf8');
console.log('\n✓ style.css saved');

// ═══════════════════════════════════════════
// FIX 6: index.html - hero visual + cards + JS
// ═══════════════════════════════════════════
const indexFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\index.html');
let html = fs.readFileSync(indexFile, 'utf8');

// Fix hero-visual: height:auto, overflow:visible
html = html.replace(
  '.hero-visual {\n      position: relative;\n      z-index: 3;\n      perspective: 1200px;\n      height: 560px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }',
  '.hero-visual {\n      position: relative;\n      z-index: 3;\n      perspective: 1200px;\n      min-height: 520px;\n      height: auto;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      overflow: visible;\n    }'
);

// Fix visual-3d-scene: height:auto, overflow:visible
html = html.replace(
  '.visual-3d-scene {\n      position: relative;\n      width: 100%;\n      height: 100%;\n      transform-style: preserve-3d;\n      animation: sceneFloat 8s ease-in-out infinite;\n    }',
  '.visual-3d-scene {\n      position: relative;\n      width: 100%;\n      min-height: 480px;\n      height: auto;\n      transform-style: preserve-3d;\n      animation: sceneFloat 8s ease-in-out infinite;\n      overflow: visible;\n    }'
);

// Fix card positions: move inside bounds
html = html.replace('right: -20px;', 'right: 5%;');
html = html.replace('left: -30px;', 'left: 3%;');
html = html.replace('right: -40px;', 'right: 2%;');

// Fix 1024px responsive: cards visible with adjusted positions
html = html.replace(
  '.card-1, .card-2, .card-3 { display: none; }',
  '.card-1, .card-2, .card-3 { display: flex; }\n      .card-1 { right: 2%; top: 3%; }\n      .card-2 { left: 2%; bottom: 5%; }\n      .card-3 { right: 0; top: 48%; }',
  { count: 1 }
);

// Fix mobile sidebar JS
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

// Bump cache
html = html.replace(/css\/style\.css\?v=\d+/g, 'css/style.css?v=6');
html = html.replace(/script\.js\?v=\d+/g, 'script.js?v=6');

fs.writeFileSync(indexFile, html, 'utf8');
console.log('✓ index.html: hero visual, cards, JS, cache fixed');

// ═══════════════════════════════════════════
// FIX 7: Other pages - mobile sidebar JS + cache
// ═══════════════════════════════════════════
const otherPages = [
  { path: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html', name: 'about.html' },
  { path: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\services.html', name: 'services.html' },
  { path: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html', name: 'reviews.html' },
];

otherPages.forEach(f => {
  let content = fs.readFileSync(f.path, 'utf8');

  // Fix mobile sidebar JS
  content = content.replace(
    /function closeMob\(\)\s*\{[\s\S]*?const m = document\.getElementById\('mobNav'\);[\s\S]*?if \(m\) m\.classList\.remove\('open'\);[\s\S]*?\}/,
    `function closeMob() {
      var m = document.getElementById('mobNav');
      if (m) { m.classList.remove('open'); m.style.display = 'none'; }
      var b = document.getElementById('burger');
      if (b) { b.classList.remove('open'); }
      document.body.style.overflow = '';
    }`
  );
  content = content.replace(
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

  // Bump cache
  content = content.replace(/css\/style\.css\?v=\d+/g, 'css/style.css?v=6');
  content = content.replace(/script\.js\?v=\d+/g, 'script.js?v=6');

  fs.writeFileSync(f.path, content, 'utf8');
  console.log('✓ ' + f.name + ': JS + cache fixed');
});

console.log('\n═══════════════════════════════');
console.log('All fixes applied successfully!');
console.log('═══════════════════════════════');
