const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\css\\style.css');
let content = fs.readFileSync(cssFile, 'utf8');

// Use regex to find and replace the rule regardless of whitespace/line endings
const regex = /#mainNav:not\(\.site-navbar\)\s*\{[^}]*background:\s*transparent\s*!important;[^}]*border:\s*0\s*!important;[^}]*box-shadow:\s*none\s*!important;[^}]*\}/;

const match = content.match(regex);
if (match) {
  console.log('Found rule:');
  console.log(JSON.stringify(match[0]));
  
  const replacement = `#mainNav:not(.site-navbar) {\n  background: transparent !important;\n  backdrop-filter: none !important;\n  -webkit-backdrop-filter: none !important;\n  border: 0 !important;\n  box-shadow: none !important;\n}`;
  
  content = content.replace(regex, replacement);
  fs.writeFileSync(cssFile, content, 'utf8');
  console.log('\nSUCCESS: Updated #mainNav:not(.site-navbar) rule in style.css');
} else {
  console.log('Rule not found. Dumping nearby content for debugging...');
  const idx = content.indexOf('#mainNav:not');
  if (idx !== -1) {
    console.log('Found #mainNav:not at index:', idx);
    console.log('Nearby content:', JSON.stringify(content.substring(idx, idx + 200)));
  } else {
    console.log('#mainNav:not not found in file at all');
  }
}
