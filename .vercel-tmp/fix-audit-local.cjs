const fs = require('fs');

// ── Fix reviews.html ──
const revFile = 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html';
let rev = fs.readFileSync(revFile, 'utf8');

// CTA button: open local audit modal
rev = rev.replace(
  '<a href="services.html#contact" class="cta-btn-primary">Get Free SEO Audit</a>',
  '<a href="#" class="cta-btn-primary" onclick="openAuditModal(event)">Get Free SEO Audit</a>'
);

// Nav CTA: open local audit modal
rev = rev.replace(
  '<a href="services.html#contact" class="nav-cta">Free SEO Audit</a>',
  '<a href="#" class="nav-cta" onclick="openAuditModal(event)">Free SEO Audit</a>'
);

fs.writeFileSync(revFile, rev, 'utf8');
console.log('✓ reviews.html: audit buttons now open local modal');

// ── Fix about.html ──
const abtFile = 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html';
let abt = fs.readFileSync(abtFile, 'utf8');

// Hero button: open local audit modal
abt = abt.replace(
  '<a href="services.html#contact" class="abtn-primary">',
  '<a href="#" class="abtn-primary" onclick="openAuditModal(event)">'
);

// CTA section button: open local audit modal
abt = abt.replace(
  '<a href="services.html#contact" class="cta-btn-primary">',
  '<a href="#" class="cta-btn-primary" onclick="openAuditModal(event)">'
);

// Nav CTA: open local audit modal
abt = abt.replace(
  '<a href="services.html#contact" class="ncta">Free SEO Audit</a>',
  '<a href="#" class="ncta" onclick="openAuditModal(event)">Free SEO Audit</a>'
);

fs.writeFileSync(abtFile, abt, 'utf8');
console.log('✓ about.html: audit buttons now open local modal');

console.log('Done!');
