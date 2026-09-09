const fs = require('fs');
const path = require('path');

// ── Fix index.html: replace class toggle with direct style manipulation ──
const indexFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\index.html');
let html = fs.readFileSync(indexFile, 'utf8');

// Fix closeMob function - use direct style manipulation
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

// Fix burger click handler - use direct style manipulation
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

fs.writeFileSync(indexFile, html, 'utf8');
console.log('✓ index.html: JS fixed to use direct style.display');

// ── Fix about.html ──
const aboutFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html');
let aboutHtml = fs.readFileSync(aboutFile, 'utf8');

// Fix closeMob
aboutHtml = aboutHtml.replace(
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
aboutHtml = aboutHtml.replace(
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

fs.writeFileSync(aboutFile, aboutHtml, 'utf8');
console.log('✓ about.html: JS fixed');

// ── Fix services.html ──
const servicesFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\services.html');
let servicesHtml = fs.readFileSync(servicesFile, 'utf8');

servicesHtml = servicesHtml.replace(
  /function closeMob\(\)\s*\{[\s\S]*?const m = document\.getElementById\('mobNav'\);[\s\S]*?if \(m\) m\.classList\.remove\('open'\);[\s\S]*?\}/,
  `function closeMob() {
      var m = document.getElementById('mobNav');
      if (m) { m.classList.remove('open'); m.style.display = 'none'; }
      var b = document.getElementById('burger');
      if (b) { b.classList.remove('open'); }
      document.body.style.overflow = '';
    }`
);

servicesHtml = servicesHtml.replace(
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

fs.writeFileSync(servicesFile, servicesHtml, 'utf8');
console.log('✓ services.html: JS fixed');

// ── Fix reviews.html ──
const reviewsFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html');
let reviewsHtml = fs.readFileSync(reviewsFile, 'utf8');

reviewsHtml = reviewsHtml.replace(
  /function closeMob\(\)\s*\{[\s\S]*?const m = document\.getElementById\('mobNav'\);[\s\S]*?if \(m\) m\.classList\.remove\('open'\);[\s\S]*?\}/,
  `function closeMob() {
      var m = document.getElementById('mobNav');
      if (m) { m.classList.remove('open'); m.style.display = 'none'; }
      var b = document.getElementById('burger');
      if (b) { b.classList.remove('open'); }
      document.body.style.overflow = '';
    }`
);

reviewsHtml = reviewsHtml.replace(
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

fs.writeFileSync(reviewsFile, reviewsHtml, 'utf8');
console.log('✓ reviews.html: JS fixed');

// ── Also update the inline <style> to remove !important on display:none ──
// so the inline style.display can take effect
const allFiles = [indexFile, aboutFile, servicesFile, reviewsFile];
allFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Replace the inline style block to not force display:none on .mnav
  content = content.replace(
    /\/\* Mobile nav fix[\s\S]*?<\/style>/,
    `<style>
/* Mobile nav fix - guaranteed visibility */
#mobNav.open { display:flex !important; visibility:visible !important; opacity:1 !important; z-index:9999 !important; }
</style>`
  );
  fs.writeFileSync(f, content, 'utf8');
  console.log('✓ ' + path.basename(f) + ': inline style updated');
});

console.log('\nDone!');
