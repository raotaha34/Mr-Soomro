const fs = require('fs');
const path = require('path');

const files = [
  'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\index.html',
  'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html',
  'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\services.html',
  'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html',
];

files.forEach(f => {
  let html = fs.readFileSync(f, 'utf8');
  // Bump CSS cache version from ?v=3 to ?v=4
  html = html.replace(/css\/style\.css\?v=3/g, 'css/style.css?v=4');
  // Bump JS cache version
  html = html.replace(/script\.js\?v=3/g, 'script.js?v=4');
  fs.writeFileSync(f, html, 'utf8');
  console.log('✓ ' + path.basename(f) + ': cache version bumped');
});

console.log('\nDone!');
