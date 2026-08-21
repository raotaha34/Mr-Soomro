const fs = require('fs');
const path = require('path');

const API_BASE = 'https://src-five-sage.vercel.app';

// ── Modal HTML + CSS + JS to inject before </body> ──
function getModalSnippet() {
  return `
<!-- ═══════ AUDIT MODAL ═══════ -->
<style>
  .audit-modal-overlay {
    display: none; position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,.55); backdrop-filter: blur(4px);
    align-items: center; justify-content: center; padding: 20px;
    animation: amFadeIn .25s ease;
  }
  .audit-modal-overlay.active { display: flex; }
  @keyframes amFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes amSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .audit-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 460px;
    padding: 40px 36px; position: relative; box-shadow: 0 30px 80px rgba(0,0,0,.18);
    animation: amSlideUp .35s ease; border: 1px solid rgba(249,115,22,.15);
  }
  .audit-modal-close {
    position: absolute; top: 16px; right: 16px; width: 36px; height: 36px;
    border: 1px solid rgba(26,23,20,.1); border-radius: 50%; background: #fff;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: #7a746d; transition: all .2s;
  }
  .audit-modal-close:hover { background: #fef2f2; border-color: #ef4444; color: #ef4444; }
  .audit-modal-logo {
    width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 20px;
    background: linear-gradient(135deg,#f97316,#f59e0b);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(245,145,30,.3);
  }
  .audit-modal-logo::before {
    content: ''; width: 24px; height: 24px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19V5'/%3E%3Cpath d='M4 19h16'/%3E%3Cpath d='m7 15 3-3 3 2 5-6'/%3E%3Cpath d='M15 8h3v3'/%3E%3C/svg%3E") center / contain no-repeat;
  }
  .audit-modal h3 { font-size: 22px; font-weight: 800; text-align: center; margin-bottom: 6px; color: #1a1714; font-family: 'Inter', sans-serif; }
  .audit-modal .am-sub { font-size: 14px; color: #7a746d; text-align: center; margin-bottom: 28px; line-height: 1.5; }
  .am-fg { margin-bottom: 16px; }
  .am-fg label { display: block; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #7a746d; margin-bottom: 6px; font-family: 'Inter', sans-serif; }
  .am-fg input {
    width: 100%; padding: 13px 16px; border: 1.5px solid rgba(26,23,20,.1);
    border-radius: 10px; background: #fafaf7; font: inherit; font-size: 14px;
    color: #1a1714; outline: none; transition: all .3s; box-sizing: border-box;
  }
  .am-fg input:focus { border-color: #f97316; background: #fff; box-shadow: 0 0 0 3px rgba(249,115,22,.1); }
  .am-fg input::placeholder { color: #b0a89e; }
  .am-submit {
    width: 100%; padding: 15px; border: none; border-radius: 10px; cursor: pointer;
    background: linear-gradient(135deg,#f97316,#f59e0b); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; margin-top: 8px;
    box-shadow: 0 8px 28px rgba(249,115,22,.18); transition: all .35s;
  }
  .am-submit:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(249,115,22,.25); }
  .am-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .am-msg { display: none; font-size: 13px; margin-top: 12px; font-weight: 600; text-align: center; }
  @media (max-width: 480px) { .audit-modal { padding: 32px 24px; } }
</style>

<div class="audit-modal-overlay" id="auditModal">
  <div class="audit-modal">
    <button class="audit-modal-close" onclick="closeAuditModal()" aria-label="Close">&times;</button>
    <div class="audit-modal-logo"></div>
    <h3>Get Your Free SEO Audit</h3>
    <p class="am-sub">Enter your details and we'll send a personalised audit within 24 hours.</p>
    <div class="am-fg"><label for="am-w">Website URL *</label><input type="url" id="am-w" placeholder="https://yoursite.com" required></div>
    <div class="am-fg"><label for="am-n">Name *</label><input type="text" id="am-n" placeholder="Your Name" required></div>
    <div class="am-fg"><label for="am-e">Business Email *</label><input type="email" id="am-e" placeholder="your@email.com" required></div>
    <div class="am-fg"><label for="am-p">Phone (Optional)</label><input type="tel" id="am-p" placeholder="+92 309 210 2705"></div>
    <button type="button" class="am-submit" id="amSubmit" onclick="submitAuditModal()"><span>Get My Free SEO Audit</span></button>
    <div class="am-msg" id="amMsg"></div>
  </div>
</div>

<script>
(function() {
  var API_BASE = "${API_BASE}";

  window.openAuditModal = function(e) {
    if (e) e.preventDefault();
    document.getElementById("auditModal").classList.add("active");
    document.body.style.overflow = "hidden";
  };
  window.closeAuditModal = function() {
    document.getElementById("auditModal").classList.remove("active");
    document.body.style.overflow = "";
  };
  // Close on overlay click
  document.getElementById("auditModal").addEventListener("click", function(e) {
    if (e.target === this) closeAuditModal();
  });
  // Close on Escape
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeAuditModal();
  });

  window.submitAuditModal = function() {
    var btn = document.getElementById("amSubmit");
    var msg = document.getElementById("amMsg");
    var data = {
      website: document.getElementById("am-w").value.trim(),
      name: document.getElementById("am-n").value.trim(),
      email: document.getElementById("am-e").value.trim(),
      phone: document.getElementById("am-p").value.trim()
    };
    msg.style.display = "none";
    if (!data.website || !data.name || !data.email) {
      msg.style.display = "block"; msg.style.color = "#ef4444";
      msg.textContent = "Please fill all required fields."; return;
    }
    btn.disabled = true; btn.querySelector("span").textContent = "Sending...";
    var contactBody = {
      name: data.name, email: data.email, website: data.website, phone: data.phone,
      message: "Free SEO Audit request for " + data.website + ". Phone: " + (data.phone || "not provided") + "."
    };
    var leadBody = Object.assign({}, data, { requirement: "Free SEO Audit" });

    fetch(API_BASE + "/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactBody)
    }).then(function(r) {
      if (!r.ok) throw new Error("Contact failed: " + r.status); return r.json();
    }).catch(function() {
      return fetch(API_BASE + "/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadBody)
      }).then(function(r) {
        if (!r.ok) throw new Error("Lead failed: " + r.status); return r.json();
      });
    }).then(function() {
      msg.style.display = "block"; msg.style.color = "#f97316";
      msg.textContent = "Thank you! We'll send your SEO audit within 24 hours.";
      document.getElementById("am-w").value = "";
      document.getElementById("am-n").value = "";
      document.getElementById("am-e").value = "";
      document.getElementById("am-p").value = "";
      btn.disabled = false; btn.querySelector("span").textContent = "Get My Free SEO Audit";
      setTimeout(function() { closeAuditModal(); msg.style.display = "none"; }, 3000);
    }).catch(function(err) {
      msg.style.display = "block"; msg.style.color = "#ef4444";
      msg.textContent = "Something went wrong. Please try again.";
      btn.disabled = false; btn.querySelector("span").textContent = "Get My Free SEO Audit";
    });
  };

  // Bind all audit buttons
  document.querySelectorAll('a[href*="#contact"], a.audit-trigger').forEach(function(btn) {
    var text = (btn.textContent || "").toLowerCase();
    if (text.indexOf("audit") !== -1 || text.indexOf("free seo") !== -1) {
      btn.addEventListener("click", function(e) { openAuditModal(e); });
    }
  });
})();
</script>`;
}

// ── Process ABOUT page ──
function processAbout() {
  const filePath = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Change audit buttons to trigger modal instead of linking to index.html#contact
  // Button 1: <a href="../index.html#contact" class="abtn-primary">Free SEO Audit
  html = html.replace(
    /<a href="\.\.\/index\.html#contact" class="abtn-primary">([\s\S]*?)<\/a>/g,
    '<a href="#" class="abtn-primary" onclick="openAuditModal(event)">$1</a>'
  );

  // Button 2: <a href="../index.html#contact" class="cta-btn-primary">Get Free SEO Audit
  html = html.replace(
    /<a href="\.\.\/index\.html#contact" class="cta-btn-primary">([\s\S]*?)<\/a>/g,
    '<a href="#" class="cta-btn-primary" onclick="openAuditModal(event)">$1</a>'
  );

  // Also fix navbar "Free SEO Audit" link
  html = html.replace(
    /<a href="\.\.\/index\.html#contact" class="ncta">Free SEO Audit<\/a>/g,
    '<a href="#" class="ncta" onclick="openAuditModal(event)">Free SEO Audit</a>'
  );

  // 2. Inject modal before </body>
  if (!html.includes('id="auditModal"')) {
    html = html.replace('</body>', getModalSnippet() + '\n</body>');
    console.log('  Injected audit modal into about.html');
  } else {
    console.log('  Audit modal already exists in about.html');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('  Updated about.html buttons');
}

// ── Process SERVICES page ──
function processServices() {
  const filePath = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\services.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Change hero button: <a href="#contact" class="btn btn-primary">...Get Free SEO Audit
  html = html.replace(
    /<a href="#contact" class="btn btn-primary">([\s\S]*?)<\/a>/g,
    '<a href="#" class="btn btn-primary" onclick="openAuditModal(event)">$1</a>'
  );

  // 2. Change CTA section button: <a href="#contact" class="btn-white">...Get Your Free SEO Audit
  html = html.replace(
    /<a href="#contact" class="btn-white">([\s\S]*?)<\/a>/g,
    '<a href="#" class="btn-white" onclick="openAuditModal(event)">$1</a>'
  );

  // 3. Fix nav CTA links
  html = html.replace(
    /<a href="#contact" class="nav-cta">Free Audit<\/a>/g,
    '<a href="#" class="nav-cta" onclick="openAuditModal(event)">Free Audit</a>'
  );
  html = html.replace(
    /<a href="#contact" class="nav-cta" onclick="closeMobile\(\)">Free SEO Audit<\/a>/g,
    '<a href="#" class="nav-cta" onclick="closeMobile();openAuditModal(event)">Free SEO Audit</a>'
  );

  // 4. Inject modal before </body>
  if (!html.includes('id="auditModal"')) {
    html = html.replace('</body>', getModalSnippet() + '\n</body>');
    console.log('  Injected audit modal into services.html');
  } else {
    console.log('  Audit modal already exists in services.html');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('  Updated services.html buttons');
}

// ── Run ──
console.log('Processing About page...');
processAbout();
console.log('\nProcessing Services page...');
processServices();
console.log('\nDone! Both pages now have the audit modal.');
