const fs = require('fs');
const f = 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html';
let s = fs.readFileSync(f, 'utf8');

// CTA button: link to services page audit section
s = s.replace(
  '<a href="#" class="cta-btn-primary" onclick="openAuditModal(event)">Get Free SEO Audit</a>',
  '<a href="services.html#contact" class="cta-btn-primary">Get Free SEO Audit</a>'
);

// Nav CTA: also link to services page
s = s.replace(
  '<a href="#" class="nav-cta" onclick="openAuditModal(event)">Free SEO Audit</a>',
  '<a href="services.html#contact" class="nav-cta">Free SEO Audit</a>'
);

fs.writeFileSync(f, s, 'utf8');
console.log('Done - reviews.html audit buttons now link to services.html#contact');
