const fs = require('fs');
const path = require('path');

const auditPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Free SEO Audit - Mr. Soomro | Get Your Website Score in 24hrs</title>
  <meta name="description" content="Get a comprehensive free SEO audit for your website. Discover what's holding your rankings back and get actionable recommendations from Pakistan's top SEO expert.">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#FDF9F3">
  <link rel="canonical" href="https://mr-soomro.com/pages/audit.html">
  <link rel="stylesheet" href="../css/style.css?v=6">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Crimson+Text:wght@400;600;700;400i;600i&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" href="../images/favicon.png">
  <link rel="apple-touch-icon" href="../images/apple-touch-icon.png">
  <style>
    .audit-hero { min-height:auto;padding:140px 60px 80px;background:var(--bg3);position:relative;overflow:hidden }
    .audit-hero::before { content:'';position:absolute;top:-200px;right:-200px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,.08),transparent 70%);pointer-events:none }
    .audit-wrap { max-width:900px;margin:0 auto }
    .audit-eyebrow { display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--A);background:rgba(249,115,22,.08);border:1px solid rgba(249,115,22,.25);padding:8px 18px;border-radius:30px;margin-bottom:24px }
    .audit-h1 { font-family:var(--fd);font-size:clamp(36px,6vw,64px);line-height:.95;letter-spacing:-.01em;color:var(--T);margin-bottom:20px;font-weight:800 }
    .audit-h1 em { font-family:var(--fi);font-style:italic;color:var(--A) }
    .audit-sub { font-size:18px;color:var(--Tm);line-height:1.7;max-width:600px;margin-bottom:48px }
    .audit-grid { display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start }
    .audit-form-wrap { background:#fff;border-radius:20px;padding:36px 32px;box-shadow:0 20px 60px rgba(0,0,0,.08);border:1px solid var(--bdr) }
    .audit-form-title { font-family:var(--fd);font-size:22px;font-weight:800;color:var(--T);margin:0 0 6px }
    .audit-form-sub { font-size:14px;color:var(--Tm);margin:0 0 24px }
    .audit-field { margin-bottom:18px }
    .audit-field label { display:block;font-size:13px;font-weight:600;color:var(--T);margin-bottom:6px }
    .audit-field input,.audit-field textarea { width:100%;padding:12px 16px;border:1px solid var(--bdr);border-radius:10px;font-size:15px;font-family:var(--fb);color:var(--T);background:var(--bg);outline:none;box-sizing:border-box;transition:border-color .2s }
    .audit-field input:focus,.audit-field textarea:focus { border-color:var(--A) }
    .audit-field textarea { resize:vertical;min-height:80px }
    .audit-submit { width:100%;padding:14px;background:linear-gradient(135deg,var(--A),var(--A2));color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;transition:all .3s;font-family:var(--fb) }
    .audit-submit:hover { transform:translateY(-2px);box-shadow:0 8px 30px var(--A-glow) }
    .audit-submit:disabled { opacity:.6;cursor:not-allowed;transform:none;box-shadow:none }
    .audit-msg { text-align:center;font-size:14px;margin-top:12px;min-height:20px }
    .audit-benefits { padding-top:8px }
    .audit-benefit { display:flex;gap:16px;margin-bottom:28px }
    .audit-benefit-icon { width:44px;height:44px;border-radius:12px;background:rgba(249,115,22,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px }
    .audit-benefit h3 { font-family:var(--fd);font-size:16px;font-weight:700;color:var(--T);margin:0 0 4px }
    .audit-benefit p { font-size:14px;color:var(--Tm);line-height:1.6;margin:0 }
    .audit-trust { margin-top:40px;padding:24px;background:var(--surface);border-radius:14px;border:1px solid var(--bdr);text-align:center }
    .audit-trust p { font-size:13px;color:var(--Tm);margin:0 }
    .audit-trust strong { color:var(--T) }
    .audit-what { padding:80px 60px;background:var(--bg) }
    .audit-what-inner { max-width:900px;margin:0 auto }
    .audit-what h2 { font-family:var(--fd);font-size:clamp(28px,4vw,40px);font-weight:800;color:var(--T);text-align:center;margin:0 0 48px }
    .audit-steps { display:grid;grid-template-columns:repeat(3,1fr);gap:32px }
    .audit-step { text-align:center;padding:32px 24px;background:var(--surface);border-radius:16px;border:1px solid var(--bdr);transition:all .3s }
    .audit-step:hover { transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.06) }
    .audit-step-num { width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--A),var(--A2));color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;margin:0 auto 16px;font-family:var(--fd) }
    .audit-step h3 { font-family:var(--fd);font-size:17px;font-weight:700;color:var(--T);margin:0 0 8px }
    .audit-step p { font-size:14px;color:var(--Tm);line-height:1.6;margin:0 }
    @media(max-width:900px) {
      .audit-grid { grid-template-columns:1fr;gap:40px }
      .audit-hero { padding:120px 24px 60px }
      .audit-what { padding:60px 24px }
      .audit-steps { grid-template-columns:1fr }
    }
    @media(max-width:768px) {
      .audit-hero { padding:110px 20px 50px }
      .audit-h1 { font-size:clamp(28px,8vw,42px) }
      .audit-form-wrap { padding:28px 20px }
      .audit-what { padding:50px 20px }
    }
  </style>
</head>
<body>

  <!-- MOBILE NAV -->
  <div class="mnav" id="mobNav">
    <div class="mnav-links">
      <a href="../index.html" onclick="closeMob()">Home</a>
      <a href="about.html" onclick="closeMob()">About</a>
      <a href="services.html" onclick="closeMob()">Services</a>
      <a href="../index.html#process" onclick="closeMob()">Process</a>
      <a href="blogs.html" onclick="closeMob()">Blog</a>
      <a href="reviews.html" onclick="closeMob()">Reviews</a>
      <a href="../index.html#contact" onclick="closeMob()">Contact</a>
    </div>
    <div class="mob-social" aria-label="Social media links">
      <div class="mob-contact">Connect With Us</div>
      <a href="https://wa.me/923092102705" title="WhatsApp" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg></a>
      <a href="https://facebook.com/mrSoomro" title="Facebook" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
      <a href="https://linkedin.com/in/mrSoomro" title="LinkedIn" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
      <a href="https://instagram.com/mrSoomro" title="Instagram" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
      <a href="mailto:info@mr-soomro.com" title="Email" aria-label="Email"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-.9-2-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></a>
    </div>
  </div>

  <!-- NAVBAR -->
  <nav id="mainNav">
    <a href="../index.html" class="nlogo"><img src="../images/websitelogo.jpeg" alt="MR. Soomro SEO" style="height:40px;width:auto;display:block;"></a>
    <ul class="nlinks">
      <li><a href="about.html">About</a></li>
      <li><a href="services.html">Services</a></li>
      <li><a href="../index.html#process">Process</a></li>
      <li><a href="blogs.html">Blog</a></li>
      <li><a href="reviews.html">Reviews</a></li>
      <li><a href="audit.html" class="ncta">Free SEO Audit</a></li>
    </ul>
    <button class="nbg" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </nav>

  <main>
    <!-- AUDIT HERO + FORM -->
    <section class="audit-hero">
      <div class="audit-wrap">
        <div class="audit-eyebrow">Free SEO Audit</div>
        <h1 class="audit-h1">Get Your Free<br><em>SEO Audit</em> Today</h1>
        <p class="audit-sub">Find out exactly what's holding your website back from ranking higher on Google. Our comprehensive audit covers 50+ ranking factors.</p>

        <div class="audit-grid">
          <!-- LEFT: Form -->
          <div class="audit-form-wrap">
            <h2 class="audit-form-title">Request Your Audit</h2>
            <p class="audit-form-sub">Fill in the details below and we'll send your free report within 24 hours.</p>
            <form id="auditForm" onsubmit="submitAudit(event)">
              <div class="audit-field">
                <label for="auditUrl">Website URL *</label>
                <input type="url" id="auditUrl" required placeholder="https://example.com">
              </div>
              <div class="audit-field">
                <label for="auditName">Full Name *</label>
                <input type="text" id="auditName" required placeholder="Your name">
              </div>
              <div class="audit-field">
                <label for="auditEmail">Email Address *</label>
                <input type="email" id="auditEmail" required placeholder="you@email.com">
              </div>
              <div class="audit-field">
                <label for="auditPhone">Phone Number</label>
                <input type="tel" id="auditPhone" placeholder="+92 300 1234567">
              </div>
              <div class="audit-field">
                <label for="auditGoals">Goals (Optional)</label>
                <textarea id="auditGoals" placeholder="What are your main SEO goals?"></textarea>
              </div>
              <button type="submit" id="auditSubmitBtn" class="audit-submit">Get My Free Audit</button>
              <p id="auditMsg" class="audit-msg"></p>
            </form>
          </div>

          <!-- RIGHT: Benefits -->
          <div class="audit-benefits">
            <div class="audit-benefit">
              <div class="audit-benefit-icon">&#128269;</div>
              <div>
                <h3>50+ Ranking Factors</h3>
                <p>We analyze technical SEO, on-page optimization, backlinks, content quality, and user experience signals.</p>
              </div>
            </div>
            <div class="audit-benefit">
              <div class="audit-benefit-icon">&#128200;</div>
              <div>
                <h3>Actionable Recommendations</h3>
                <p>Get a clear priority list of fixes that will have the biggest impact on your rankings and traffic.</p>
              </div>
            </div>
            <div class="audit-benefit">
              <div class="audit-benefit-icon">&#9889;</div>
              <div>
                <h3>Delivered in 24 Hours</h3>
                <p>Receive your comprehensive audit report via email within 24 hours of submission.</p>
              </div>
            </div>
            <div class="audit-benefit">
              <div class="audit-benefit-icon">&#127919;</div>
              <div>
                <h3>Competitor Analysis</h3>
                <p>See how you stack up against your top 3 competitors and discover gaps you can exploit.</p>
              </div>
            </div>
            <div class="audit-benefit">
              <div class="audit-benefit-icon">&#128176;</div>
              <div>
                <h3>100% Free, No Strings</h3>
                <p>No hidden fees, no obligations. We believe in earning your trust through results.</p>
              </div>
            </div>

            <div class="audit-trust">
              <p><strong>100+ businesses</strong> have grown with our SEO strategies since 2016</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="audit-what">
      <div class="audit-what-inner">
        <h2>How It Works</h2>
        <div class="audit-steps">
          <div class="audit-step">
            <div class="audit-step-num">1</div>
            <h3>Submit Your Details</h3>
            <p>Fill out the form with your website URL and contact information. Tell us about your goals.</p>
          </div>
          <div class="audit-step">
            <div class="audit-step-num">2</div>
            <h3>We Analyze Your Site</h3>
            <p>Our team performs a deep-dive analysis of 50+ technical and on-page SEO factors.</p>
          </div>
          <div class="audit-step">
            <div class="audit-step-num">3</div>
            <h3>Get Your Report</h3>
            <p>Receive a detailed audit report with prioritized recommendations you can act on immediately.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer itemscope itemtype="https://schema.org/Organization">
    <div class="ftt">
      <div>
        <span class="ftlo" itemprop="name">MR.<span>Soomro</span></span>
        <p class="fttg" itemprop="description">Pakistan's trusted SEO agency helping businesses rank higher, attract more clients and grow sustainably with data-driven search strategies since 2016.</p>
        <div class="ft-soc-row">
          <a href="https://wa.me/923092102705" title="WhatsApp" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg></a>
          <a href="https://facebook.com/mrSoomro" title="Facebook" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
          <a href="https://linkedin.com/in/mrSoomro" title="LinkedIn" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
          <a href="https://instagram.com/mrSoomro" title="Instagram" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="mailto:info@mr-soomro.com" title="Email" aria-label="Email"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-.9-2-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></a>
        </div>
      </div>
      <div><div class="ftct">Technical SEO</div><ul class="ftlk"><li><a href="services.html">Website Audit</a></li><li><a href="services.html">Core Web Vitals</a></li><li><a href="services.html">Schema Markup</a></li><li><a href="services.html">Crawl Error Fixes</a></li></ul></div>
      <div><div class="ftct">On-Page & Off-Page</div><ul class="ftlk"><li><a href="services.html">Keyword Research</a></li><li><a href="services.html">Meta Optimization</a></li><li><a href="services.html">Guest Posting</a></li><li><a href="services.html">Link Building</a></li><li><a href="services.html">Digital PR</a></li></ul></div>
      <div><div class="ftct">More Services</div><ul class="ftlk"><li><a href="services.html">Google Business Profile</a></li><li><a href="services.html">Citation Building</a></li><li><a href="services.html">Shopify SEO</a></li><li><a href="services.html">WooCommerce SEO</a></li></ul></div>
      <div><div class="ftct">Company</div><ul class="ftlk"><li><a href="about.html">About</a></li><li><a href="services.html">Services</a></li><li><a href="../index.html#process">Process</a></li><li><a href="reviews.html">Reviews</a></li><li><a href="blogs.html">Blog</a></li><li><a href="../index.html#contact">Contact</a></li></ul></div>
    </div>
    <div class="ftbt">
      <div class="ftcp">\u00a9 2026 <a href="../index.html">Mr. Soomro SEO Agency</a>. All rights reserved.</div>
      <div class="ftbl"><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms &amp; Conditions</a><a href="cookie-policy.html">Cookie Policy</a></div>
    </div>
  </footer>

  <script>
    /* NAV */
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('mainNav');
      if (nav) nav.classList.toggle('scr', scrollY > 60);
    });

    function closeMob() {
      var m = document.getElementById('mobNav');
      if (m) { m.classList.remove('open'); m.style.display = 'none'; }
      var b = document.getElementById('burger');
      if (b) { b.classList.remove('open'); }
      document.body.style.overflow = '';
    }

    var burger = document.getElementById('burger');
    if (burger) burger.addEventListener('click', function(e) {
      e.stopPropagation();
      var mobNav = document.getElementById('mobNav');
      var isOpen = this.classList.toggle('open');
      mobNav.classList.toggle('open');
      mobNav.style.display = isOpen ? 'flex' : 'none';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* AUDIT FORM SUBMISSION */
    async function submitAudit(e) {
      e.preventDefault();
      var btn = document.getElementById('auditSubmitBtn');
      var msg = document.getElementById('auditMsg');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      msg.style.color = '#666';
      msg.textContent = '';

      var data = {
        name: document.getElementById('auditName').value,
        email: document.getElementById('auditEmail').value,
        phone: document.getElementById('auditPhone').value,
        website: document.getElementById('auditUrl').value,
        goals: document.getElementById('auditGoals').value,
        message: 'SEO Audit Request - Website: ' + document.getElementById('auditUrl').value + (document.getElementById('auditGoals').value ? ' | Goals: ' + document.getElementById('auditGoals').value : ''),
        subject: 'Free SEO Audit Request'
      };

      try {
        var res = await fetch('https://src-five-sage.vercel.app/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Contact API failed');
        msg.style.color = '#16a34a';
        msg.textContent = 'Audit request sent! We will get back to you within 24 hours.';
        document.getElementById('auditForm').reset();
      } catch(err) {
        try {
          var res2 = await fetch('https://src-five-sage.vercel.app/api/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: data.name, email: data.email, phone: data.phone, website: data.website, goals: data.goals, source: 'audit-page' })
          });
          if (!res2.ok) throw new Error('Lead API also failed');
          msg.style.color = '#16a34a';
          msg.textContent = 'Audit request sent! We will get back to you within 24 hours.';
          document.getElementById('auditForm').reset();
        } catch(err2) {
          msg.style.color = '#dc2626';
          msg.textContent = 'Something went wrong. Please try again.';
        }
      }
      btn.textContent = 'Get My Free Audit';
      btn.disabled = false;
    }
  </script>
  <script src="script.js?v=6"></script>
</body>
</html>`;

const auditFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\audit.html');
fs.writeFileSync(auditFile, auditPage, 'utf8');
console.log('✓ audit.html created');

// ═══════════════════════════════════════════
// Update reviews, services, contact (index.html) pages
// ═══════════════════════════════════════════

// ── Reviews: Update nav CTA + CTA section button ──
const reviewsFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html');
let reviews = fs.readFileSync(reviewsFile, 'utf8');

// Nav CTA
reviews = reviews.replace(
  '<a href="../index.html#contact" class="nav-cta">Free SEO Audit</a>',
  '<a href="audit.html" class="ncta">Free SEO Audit</a>'
);
// CTA section button
reviews = reviews.replace(
  '<a href="../index.html#contact" class="cta-btn-primary">Get Free SEO Audit</a>',
  '<a href="audit.html" class="cta-btn-primary">Get Free SEO Audit</a>'
);
fs.writeFileSync(reviewsFile, reviews, 'utf8');
console.log('✓ reviews.html: audit links updated');

// ── Services: Update nav CTA + any CTA buttons ──
const servicesFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\services.html');
let services = fs.readFileSync(servicesFile, 'utf8');

services = services.replace(
  '<a href="../index.html#contact" class="nav-cta">Free SEO Audit</a>',
  '<a href="audit.html" class="ncta">Free SEO Audit</a>'
);
// Also update any CTA section buttons
services = services.replace(
  /<a href="[^"]*#contact" class="cta-btn-primary">Get Free SEO Audit<\/a>/g,
  '<a href="audit.html" class="cta-btn-primary">Get Free SEO Audit</a>'
);
services = services.replace(
  /<a href="[^"]*#contact" class="cta-btn-primary">Free SEO Audit<\/a>/g,
  '<a href="audit.html" class="cta-btn-primary">Free SEO Audit</a>'
);
fs.writeFileSync(servicesFile, services, 'utf8');
console.log('✓ services.html: audit links updated');

// ── Index (Contact): Update nav CTA ──
const indexFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\index.html');
let index = fs.readFileSync(indexFile, 'utf8');

index = index.replace(
  '<a href="#contact" class="ncta">Free SEO Audit</a>',
  '<a href="pages/audit.html" class="ncta">Free SEO Audit</a>'
);
// Also update mobile nav CTA if present
index = index.replace(
  '<a href="#contact" class="ncta">Free SEO Audit</a>',
  '<a href="pages/audit.html" class="ncta">Free SEO Audit</a>'
);
fs.writeFileSync(indexFile, index, 'utf8');
console.log('✓ index.html: audit links updated');

// ── About: Update nav CTA ──
const aboutFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html');
let about = fs.readFileSync(aboutFile, 'utf8');

about = about.replace(
  '<a href="../index.html#contact" class="ncta">Free SEO Audit</a>',
  '<a href="audit.html" class="ncta">Free SEO Audit</a>'
);
fs.writeFileSync(aboutFile, about, 'utf8');
console.log('✓ about.html: audit links updated');

// ── Blogs: Update nav CTA ──
const blogsFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\blogs.html');
if (fs.existsSync(blogsFile)) {
  let blogs = fs.readFileSync(blogsFile, 'utf8');
  blogs = blogs.replace(
    '<a href="../index.html#contact" class="nav-cta">Free SEO Audit</a>',
    '<a href="audit.html" class="ncta">Free SEO Audit</a>'
  );
  blogs = blogs.replace(
    '<a href="../index.html#contact" class="ncta">Free SEO Audit</a>',
    '<a href="audit.html" class="ncta">Free SEO Audit</a>'
  );
  fs.writeFileSync(blogsFile, blogs, 'utf8');
  console.log('✓ blogs.html: audit links updated');
}

console.log('\\n═══════════════════════════════');
console.log('SEO Audit page created + all pages updated!');
console.log('═══════════════════════════════');
