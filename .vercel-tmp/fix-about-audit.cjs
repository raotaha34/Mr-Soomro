const fs = require('fs');
const f = 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html';
let s = fs.readFileSync(f, 'utf8');

// Nav CTA: link to services page contact section
s = s.replace(
  '<a href="#" class="ncta" onclick="openAuditModal(event)">Free SEO Audit</a>',
  '<a href="services.html#contact" class="ncta">Free SEO Audit</a>'
);

// Hero button: link to services page contact section
s = s.replace(
  /href="\.\.\/index\.html#contact" class="abtn-primary"/g,
  'href="services.html#contact" class="abtn-primary"'
);

// CTA section button: link to services page contact section
s = s.replace(
  /href="\.\.\/index\.html#contact" class="cta-btn-primary"/g,
  'href="services.html#contact" class="cta-btn-primary"'
);

fs.writeFileSync(f, s, 'utf8');
console.log('Done - about.html buttons now link to services.html#contact');
