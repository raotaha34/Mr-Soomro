const fs = require('fs');
const path = require('path');

const reviewsFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html');
let html = fs.readFileSync(reviewsFile, 'utf8');

// ── 1. Update nav CTA button ──
html = html.replace(
  '<a href="../index.html#contact" class="nav-cta">Free SEO Audit</a>',
  '<a href="#" class="nav-cta" onclick="openAuditModal(event)">Free SEO Audit</a>'
);

// ── 2. Update CTA section button ──
html = html.replace(
  '<a href="../index.html#contact" class="cta-btn-primary">Get Free SEO Audit</a>',
  '<a href="#" class="cta-btn-primary" onclick="openAuditModal(event)">Get Free SEO Audit</a>'
);

// ── 3. Add audit modal before </body> ──
const auditModal = `
<!-- SEO AUDIT MODAL -->
<div id="auditModal" style="display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);align-items:center;justify-content:center;padding:20px;">
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;padding:40px 32px;position:relative;box-shadow:0 40px 80px rgba(0,0,0,.25);max-height:90vh;overflow-y:auto;">
    <button onclick="closeAuditModal()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;border:1px solid #e5e5e5;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:#666;" aria-label="Close">&times;</button>
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#f5911e,#f5a623);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px;">&#128200;</div>
      <h2 style="font-family:'DM Sans',sans-serif;font-size:28px;font-weight:800;color:#1a1a1a;margin:0 0 8px;">Get Free SEO Audit</h2>
      <p style="font-size:15px;color:#666;margin:0;">Submit your details and we'll send you a comprehensive SEO report.</p>
    </div>
    <form id="auditForm" onsubmit="submitAudit(event)" style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label style="display:block;font-size:13px;font-weight:600;color:#333;margin-bottom:6px;">Website URL *</label>
        <input type="url" id="auditUrl" required placeholder="https://example.com" style="width:100%;padding:12px 16px;border:1px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;transition:border-color .2s;" onfocus="this.style.borderColor='#f5911e'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="display:block;font-size:13px;font-weight:600;color:#333;margin-bottom:6px;">Full Name *</label>
        <input type="text" id="auditName" required placeholder="Your name" style="width:100%;padding:12px 16px;border:1px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;transition:border-color .2s;" onfocus="this.style.borderColor='#f5911e'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="display:block;font-size:13px;font-weight:600;color:#333;margin-bottom:6px;">Email *</label>
        <input type="email" id="auditEmail" required placeholder="you@email.com" style="width:100%;padding:12px 16px;border:1px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;transition:border-color .2s;" onfocus="this.style.borderColor='#f5911e'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="display:block;font-size:13px;font-weight:600;color:#333;margin-bottom:6px;">Phone</label>
        <input type="tel" id="auditPhone" placeholder="+92 300 1234567" style="width:100%;padding:12px 16px;border:1px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;transition:border-color .2s;" onfocus="this.style.borderColor='#f5911e'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <button type="submit" id="auditSubmitBtn" style="width:100%;padding:14px;background:linear-gradient(135deg,#f5911e,#f5a623);color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;transition:all .3s;margin-top:4px;">Get My Free Audit</button>
      <p id="auditMsg" style="text-align:center;font-size:14px;margin:0;min-height:20px;"></p>
    </form>
  </div>
</div>
<script>
function openAuditModal(e) {
  if (e) e.preventDefault();
  var m = document.getElementById('auditModal');
  m.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeAuditModal() {
  var m = document.getElementById('auditModal');
  m.style.display = 'none';
  document.body.style.overflow = '';
}
document.getElementById('auditModal').addEventListener('click', function(e) {
  if (e.target === this) closeAuditModal();
});
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
    message: 'SEO Audit Request - Website: ' + document.getElementById('auditUrl').value,
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
    msg.textContent = 'Audit request sent! We will get back to you soon.';
    document.getElementById('auditForm').reset();
    setTimeout(closeAuditModal, 2500);
  } catch(err) {
    try {
      var res2 = await fetch('https://src-five-sage.vercel.app/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, phone: data.phone, website: data.website, source: 'audit-modal' })
      });
      if (!res2.ok) throw new Error('Lead API also failed');
      msg.style.color = '#16a34a';
      msg.textContent = 'Audit request sent! We will get back to you soon.';
      document.getElementById('auditForm').reset();
      setTimeout(closeAuditModal, 2500);
    } catch(err2) {
      msg.style.color = '#dc2626';
      msg.textContent = 'Something went wrong. Please try again.';
    }
  }
  btn.textContent = 'Get My Free Audit';
  btn.disabled = false;
}
</script>
`;

if (!html.includes('auditModal')) {
  html = html.replace('</body>', auditModal + '\n</body>');
  console.log('✓ Audit modal added to reviews.html');
} else {
  console.log('✓ Audit modal already exists');
}

fs.writeFileSync(reviewsFile, html, 'utf8');
console.log('✓ reviews.html saved');
