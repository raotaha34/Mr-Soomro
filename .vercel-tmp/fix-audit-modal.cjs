const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════
// 1. Delete audit.html
// ═══════════════════════════════════════════
const auditFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\audit.html');
if (fs.existsSync(auditFile)) {
  fs.unlinkSync(auditFile);
  console.log('✓ audit.html deleted');
}

// ═══════════════════════════════════════════
// Shared audit modal HTML + CSS + JS
// ═══════════════════════════════════════════
const auditModalBlock = `
<!-- SEO AUDIT MODAL -->
<div id="auditModal" style="display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .3s;">
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;padding:40px 32px;position:relative;box-shadow:0 40px 80px rgba(0,0,0,.2);max-height:90vh;overflow-y:auto;">
    <button onclick="closeAuditModal()" style="position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;border:1px solid #e5e5e5;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:#666;transition:all .2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'" aria-label="Close">&times;</button>
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#f5911e,#f5a623);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
      </div>
      <h2 style="font-family:'DM Sans',sans-serif;font-size:26px;font-weight:800;color:#1a1a1a;margin:0 0 6px;">Get Your Free SEO Audit</h2>
      <p style="font-size:14px;color:#666;margin:0;line-height:1.5;">Fill in your details and we'll send you a comprehensive SEO report within 24 hours.</p>
    </div>
    <form id="auditForm" onsubmit="submitAudit(event)" style="display:flex;flex-direction:column;gap:14px;">
      <div>
        <label style="display:block;font-size:13px;font-weight:600;color:#333;margin-bottom:5px;">Website URL *</label>
        <input type="url" id="auditUrl" required placeholder="https://yoursite.com" style="width:100%;padding:12px 16px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;transition:border-color .2s;font-family:inherit;" onfocus="this.style.borderColor='#f5911e'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="display:block;font-size:13px;font-weight:600;color:#333;margin-bottom:5px;">Name *</label>
        <input type="text" id="auditName" required placeholder="Your Name" style="width:100%;padding:12px 16px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;transition:border-color .2s;font-family:inherit;" onfocus="this.style.borderColor='#f5911e'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="display:block;font-size:13px;font-weight:600;color:#333;margin-bottom:5px;">Business Email *</label>
        <input type="email" id="auditEmail" required placeholder="your@email.com" style="width:100%;padding:12px 16px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;transition:border-color .2s;font-family:inherit;" onfocus="this.style.borderColor='#f5911e'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="display:block;font-size:13px;font-weight:600;color:#333;margin-bottom:5px;">Phone <span style="font-weight:400;color:#999;">(Optional)</span></label>
        <input type="tel" id="auditPhone" placeholder="+92 309 210 2705" style="width:100%;padding:12px 16px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;transition:border-color .2s;font-family:inherit;" onfocus="this.style.borderColor='#f5911e'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <button type="submit" id="auditSubmitBtn" style="width:100%;padding:14px;background:linear-gradient(135deg,#f5911e,#f5a623);color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;transition:all .3s;margin-top:4px;font-family:inherit;">Get My Free SEO Audit</button>
      <p id="auditMsg" style="text-align:center;font-size:14px;margin:0;min-height:20px;"></p>
      <p style="text-align:center;font-size:12px;color:#999;margin:0;">No obligation. No pressure. Just a clear SEO roadmap.</p>
    </form>
  </div>
</div>
<script>
function openAuditModal(e){if(e)e.preventDefault();var m=document.getElementById('auditModal');m.style.display='flex';setTimeout(function(){m.style.opacity='1'},10);document.body.style.overflow='hidden'}
function closeAuditModal(){var m=document.getElementById('auditModal');m.style.opacity='0';setTimeout(function(){m.style.display='none'},300);document.body.style.overflow=''}
document.getElementById('auditModal').addEventListener('click',function(e){if(e.target===this)closeAuditModal()});
async function submitAudit(e){
  e.preventDefault();
  var btn=document.getElementById('auditSubmitBtn'),msg=document.getElementById('auditMsg');
  btn.textContent='Sending...';btn.disabled=true;msg.style.color='#666';msg.textContent='';
  var data={
    name:document.getElementById('auditName').value,
    email:document.getElementById('auditEmail').value,
    phone:document.getElementById('auditPhone').value,
    website:document.getElementById('auditUrl').value,
    message:'SEO Audit Request - Website: '+document.getElementById('auditUrl').value,
    subject:'Free SEO Audit Request'
  };
  try{
    var r=await fetch('https://src-five-sage.vercel.app/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    if(!r.ok)throw new Error('fail');
    msg.style.color='#16a34a';msg.textContent='Audit request sent! We\\'ll get back to you within 24 hours.';
    document.getElementById('auditForm').reset();setTimeout(closeAuditModal,2500);
  }catch(err){
    try{
      var r2=await fetch('https://src-five-sage.vercel.app/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.name,email:data.email,phone:data.phone,website:data.website,source:'audit-modal'})});
      if(!r2.ok)throw new Error('fail');
      msg.style.color='#16a34a';msg.textContent='Audit request sent! We\\'ll get back to you within 24 hours.';
      document.getElementById('auditForm').reset();setTimeout(closeAuditModal,2500);
    }catch(err2){msg.style.color='#dc2626';msg.textContent='Something went wrong. Please try again.';}
  }
  btn.textContent='Get My Free SEO Audit';btn.disabled=false;
}
</script>`;

// ═══════════════════════════════════════════
// 2. Services page: Add modal + update button
// ═══════════════════════════════════════════
const servicesFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\services.html');
let svc = fs.readFileSync(servicesFile, 'utf8');

// Change the CTA button to open modal
svc = svc.replace(
  '<a href="#contact" class="btn-white">\nGet Your Free SEO Audit',
  '<a href="#" class="btn-white" onclick="openAuditModal(event)">\nGet Your Free SEO Audit'
);

// Add modal before </body>
if (!svc.includes('id="auditModal"')) {
  svc = svc.replace('</body>', auditModalBlock + '\n</body>');
  console.log('✓ services.html: audit modal added');
}

// Update nav CTA
svc = svc.replace(/<a href="[^"]*" class="nav-cta">Free SEO Audit<\/a>/, '<a href="#" class="nav-cta" onclick="openAuditModal(event)">Free SEO Audit</a>');
svc = svc.replace(/<a href="[^"]*" class="ncta">Free SEO Audit<\/a>/, '<a href="#" class="ncta" onclick="openAuditModal(event)">Free SEO Audit</a>');

fs.writeFileSync(servicesFile, svc, 'utf8');
console.log('✓ services.html: buttons updated');

// ═══════════════════════════════════════════
// 3. Reviews page: Update existing modal to match contact form fields
// ═══════════════════════════════════════════
const reviewsFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html');
let rev = fs.readFileSync(reviewsFile, 'utf8');

// Remove old audit modal block and replace with new one
rev = rev.replace(/<!-- SEO AUDIT MODAL -->[\s\S]*?<\/script>/, auditModalBlock.trim());

// Update nav CTA
rev = rev.replace(/<a href="[^"]*" class="nav-cta" onclick="openAuditModal\(event\)">Free SEO Audit<\/a>/, '<a href="#" class="nav-cta" onclick="openAuditModal(event)">Free SEO Audit</a>');

fs.writeFileSync(reviewsFile, rev, 'utf8');
console.log('✓ reviews.html: audit modal updated');

// ═══════════════════════════════════════════
// 4. About page: Change nav CTA from audit.html to open modal
// ═══════════════════════════════════════════
const aboutFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html');
let abt = fs.readFileSync(aboutFile, 'utf8');

abt = abt.replace(
  '<a href="audit.html" class="ncta">Free SEO Audit</a>',
  '<a href="#" class="ncta" onclick="openAuditModal(event)">Free SEO Audit</a>'
);

// Add modal if not present
if (!abt.includes('id="auditModal"')) {
  abt = abt.replace('</body>', auditModalBlock + '\n</body>');
}
fs.writeFileSync(aboutFile, abt, 'utf8');
console.log('✓ about.html: audit modal added');

// ═══════════════════════════════════════════
// 5. Blogs page: Same
// ═══════════════════════════════════════════
const blogsFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\blogs.html');
if (fs.existsSync(blogsFile)) {
  let blg = fs.readFileSync(blogsFile, 'utf8');
  blg = blg.replace(/<a href="audit\.html" class="ncta">Free SEO Audit<\/a>/, '<a href="#" class="ncta" onclick="openAuditModal(event)">Free SEO Audit</a>');
  if (!blg.includes('id="auditModal"')) {
    blg = blg.replace('</body>', auditModalBlock + '\n</body>');
  }
  fs.writeFileSync(blogsFile, blg, 'utf8');
  console.log('✓ blogs.html: audit modal added');
}

// ═══════════════════════════════════════════
// 6. Index.html: Update nav CTA
// ═══════════════════════════════════════════
const indexFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\index.html');
let idx = fs.readFileSync(indexFile, 'utf8');

// Update nav CTA to open modal
idx = idx.replace(
  '<a href="pages/audit.html" class="ncta">Free SEO Audit</a>',
  '<a href="#" class="ncta" onclick="openAuditModal(event)">Free SEO Audit</a>'
);

// Add modal if not present
if (!idx.includes('id="auditModal"')) {
  idx = idx.replace('</body>', auditModalBlock + '\n</body>');
}
fs.writeFileSync(indexFile, idx, 'utf8');
console.log('✓ index.html: audit modal added');

console.log('\n═══════════════════════════════');
console.log('All done! audit.html removed, modals added to all pages');
console.log('═══════════════════════════════');
