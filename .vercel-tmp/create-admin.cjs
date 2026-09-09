const fs = require('fs');
const path = require('path');

// ── 1. Add ADMIN_USERNAME to backend .env ──
const envFile = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\src\\.env');
let envContent = fs.readFileSync(envFile, 'utf8');

if (!envContent.includes('ADMIN_USERNAME')) {
  envContent += '\n# Admin panel username\nADMIN_USERNAME=basitsoomro\n';
  fs.writeFileSync(envFile, envContent, 'utf8');
  console.log('Added ADMIN_USERNAME to .env');
} else {
  console.log('ADMIN_USERNAME already in .env');
}

// ── 2. Add to .env.example too ──
const envExample = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\src\\.env.example');
if (fs.existsSync(envExample)) {
  let exampleContent = fs.readFileSync(envExample, 'utf8');
  if (!exampleContent.includes('ADMIN_USERNAME')) {
    exampleContent += '\n# Admin panel username\nADMIN_USERNAME=basitsoomro\n';
    fs.writeFileSync(envExample, exampleContent, 'utf8');
    console.log('Added ADMIN_USERNAME to .env.example');
  }
}

// ── 3. Create admin.html ──
const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Panel | Mr. Soomro</title>
  <link rel="icon" href="../assets/favicon.png?v=2" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --A: #f97316;
      --A2: #f59e0b;
      --T: #1a1714;
      --Tm: #3d3833;
      --Ts: #7a746d;
      --Tmut: #b0a89e;
      --bg: #fafaf7;
      --bg2: #f2f0ea;
      --surface: #ffffff;
      --bdr: rgba(26,23,20,0.1);
      --A-glow: rgba(249,115,22,0.18);
      --fd: 'Inter', sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--fd); background: var(--bg); color: var(--T); min-height: 100vh; }

    /* ── LOGIN SCREEN ── */
    .login-wrap {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; padding: 20px;
      background: linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%);
    }
    .login-card {
      background: var(--surface); border: 1px solid var(--bdr);
      border-radius: 20px; padding: 48px 40px; width: 100%; max-width: 420px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.06);
    }
    .login-logo {
      width: 52px; height: 52px; border-radius: 50%; margin: 0 auto 24px;
      background: linear-gradient(135deg, var(--A), var(--A2));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(245,145,30,.3);
    }
    .login-logo::before {
      content: ''; width: 28px; height: 28px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19V5'/%3E%3Cpath d='M4 19h16'/%3E%3Cpath d='m7 15 3-3 3 2 5-6'/%3E%3Cpath d='M15 8h3v3'/%3E%3C/svg%3E") center / contain no-repeat;
    }
    .login-title { font-size: 24px; font-weight: 800; text-align: center; margin-bottom: 8px; }
    .login-sub { font-size: 14px; color: var(--Ts); text-align: center; margin-bottom: 32px; }
    .form-group { margin-bottom: 20px; }
    .form-group label {
      display: block; font-size: 11px; font-weight: 700;
      letter-spacing: .14em; text-transform: uppercase; color: var(--Ts); margin-bottom: 8px;
    }
    .form-group input {
      width: 100%; padding: 14px 16px; border: 1.5px solid var(--bdr);
      border-radius: 12px; background: var(--bg); font: inherit; font-size: 15px;
      color: var(--T); outline: none; transition: all .3s;
    }
    .form-group input:focus { border-color: var(--A); background: var(--surface); box-shadow: 0 0 0 3px rgba(249,115,22,.1); }
    .form-group input::placeholder { color: var(--Tmut); }
    .login-btn {
      width: 100%; padding: 16px; border: none; border-radius: 12px; cursor: pointer;
      background: linear-gradient(135deg, var(--A), var(--A2)); color: #fff;
      font-family: var(--fd); font-size: 14px; font-weight: 700;
      letter-spacing: .08em; text-transform: uppercase;
      box-shadow: 0 8px 28px var(--A-glow); transition: all .35s;
    }
    .login-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px var(--A-glow); }
    .login-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
    .login-error {
      display: none; margin-top: 16px; padding: 12px 16px; border-radius: 10px;
      background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
      font-size: 13px; font-weight: 500; text-align: center;
    }
    .login-error.show { display: block; }

    /* ── DASHBOARD ── */
    .dashboard { display: none; min-height: 100vh; }
    .dashboard.active { display: block; }
    .dash-header {
      background: var(--surface); border-bottom: 1px solid var(--bdr);
      padding: 16px 40px; display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 100;
    }
    .dash-header-left { display: flex; align-items: center; gap: 14px; }
    .dash-logo {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, var(--A), var(--A2));
      display: flex; align-items: center; justify-content: center;
    }
    .dash-logo::before {
      content: ''; width: 20px; height: 20px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19V5'/%3E%3Cpath d='M4 19h16'/%3E%3Cpath d='m7 15 3-3 3 2 5-6'/%3E%3Cpath d='M15 8h3v3'/%3E%3C/svg%3E") center / contain no-repeat;
    }
    .dash-title { font-size: 18px; font-weight: 700; }
    .dash-title span { color: var(--A); }
    .logout-btn {
      padding: 8px 20px; border: 1.5px solid var(--bdr); border-radius: 8px;
      background: transparent; color: var(--Ts); font-family: var(--fd);
      font-size: 12px; font-weight: 600; text-transform: uppercase;
      letter-spacing: .06em; cursor: pointer; transition: all .3s;
    }
    .logout-btn:hover { border-color: #dc2626; color: #dc2626; background: #fef2f2; }
    .dash-body { padding: 32px 40px; max-width: 1400px; margin: 0 auto; }

    /* Stats row */
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .stat-card {
      background: var(--surface); border: 1px solid var(--bdr); border-radius: 16px;
      padding: 24px; transition: all .3s;
    }
    .stat-card:hover { border-color: rgba(249,115,22,.25); box-shadow: 0 8px 24px rgba(0,0,0,.04); }
    .stat-label { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--Ts); margin-bottom: 8px; }
    .stat-value { font-size: 32px; font-weight: 800; color: var(--T); }
    .stat-value.accent { color: var(--A); }

    /* Toolbar */
    .toolbar {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 20px; gap: 16px; flex-wrap: wrap;
    }
    .search-box {
      flex: 1; min-width: 240px; padding: 12px 16px; border: 1.5px solid var(--bdr);
      border-radius: 10px; background: var(--surface); font: inherit; font-size: 14px;
      color: var(--T); outline: none; transition: all .3s;
    }
    .search-box:focus { border-color: var(--A); box-shadow: 0 0 0 3px rgba(249,115,22,.1); }
    .refresh-btn {
      padding: 12px 24px; border: 1.5px solid var(--bdr); border-radius: 10px;
      background: var(--surface); color: var(--T); font-family: var(--fd);
      font-size: 13px; font-weight: 600; cursor: pointer; transition: all .3s;
      display: flex; align-items: center; gap: 8px;
    }
    .refresh-btn:hover { border-color: var(--A); color: var(--A); }
    .refresh-btn.spinning svg { animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Table */
    .table-wrap {
      background: var(--surface); border: 1px solid var(--bdr);
      border-radius: 16px; overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    thead { background: var(--bg2); }
    th {
      padding: 14px 20px; font-size: 11px; font-weight: 700;
      letter-spacing: .12em; text-transform: uppercase; color: var(--Ts);
      text-align: left; border-bottom: 1px solid var(--bdr);
    }
    td {
      padding: 16px 20px; font-size: 14px; color: var(--Tm);
      border-bottom: 1px solid var(--bdr); vertical-align: top;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(249,115,22,.02); }
    td.name { font-weight: 600; color: var(--T); }
    td.email a { color: var(--A); text-decoration: none; font-weight: 500; }
    td.email a:hover { text-decoration: underline; }
    td.date { font-size: 12px; color: var(--Ts); white-space: nowrap; }
    td .req-badge {
      display: inline-block; padding: 4px 12px; border-radius: 20px;
      font-size: 11px; font-weight: 600; letter-spacing: .04em;
      background: rgba(249,115,22,.08); color: var(--A); border: 1px solid rgba(249,115,22,.2);
    }

    /* Empty & loading states */
    .empty-state { padding: 60px 20px; text-align: center; }
    .empty-state p { font-size: 16px; color: var(--Ts); margin-bottom: 8px; }
    .empty-state small { font-size: 13px; color: var(--Tmut); }
    .loading-row td { text-align: center; padding: 40px; color: var(--Ts); }

    /* Responsive */
    @media (max-width: 768px) {
      .dash-header { padding: 14px 20px; }
      .dash-body { padding: 20px; }
      .table-wrap { overflow-x: auto; }
      table { min-width: 700px; }
      .stats-row { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .stats-row { grid-template-columns: 1fr; }
      .login-card { padding: 36px 24px; }
    }
  </style>
</head>
<body>

  <!-- ════════ LOGIN SCREEN ════════ -->
  <div class="login-wrap" id="loginScreen">
    <div class="login-card">
      <div class="login-logo"></div>
      <h1 class="login-title">Admin Panel</h1>
      <p class="login-sub">Sign in to view leads dashboard</p>
      <form id="loginForm" autocomplete="off">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" placeholder="Enter admin username" required autocomplete="username">
        </div>
        <div class="form-group">
          <label for="adminKey">Admin Key</label>
          <input type="password" id="adminKey" placeholder="Enter admin key" required autocomplete="current-password">
        </div>
        <button type="submit" class="login-btn" id="loginBtn">Sign In</button>
        <div class="login-error" id="loginError"></div>
      </form>
    </div>
  </div>

  <!-- ════════ DASHBOARD ════════ -->
  <div class="dashboard" id="dashboard">
    <header class="dash-header">
      <div class="dash-header-left">
        <div class="dash-logo"></div>
        <div class="dash-title">Leads <span>Dashboard</span></div>
      </div>
      <button class="logout-btn" onclick="logout()">Logout</button>
    </header>

    <div class="dash-body">
      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-label">Total Leads</div>
          <div class="stat-value accent" id="statTotal">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Today</div>
          <div class="stat-value" id="statToday">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">This Week</div>
          <div class="stat-value" id="statWeek">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">With Phone</div>
          <div class="stat-value" id="statPhone">0</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <input type="text" class="search-box" id="searchBox" placeholder="Search by name, email, or requirement...">
        <button class="refresh-btn" id="refreshBtn" onclick="fetchLeads()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Refresh
        </button>
      </div>

      <!-- Leads Table -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Requirement</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody id="leadsBody">
            <tr class="loading-row"><td colspan="6">Loading leads...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    /* ── CONFIG ── */
    const API_BASE = "https://src-five-sage.vercel.app";
    const ADMIN_USERNAME = "basitsoomro";
    const ADMIN_KEY = "uikf3452hbikujg87894";

    let allLeads = [];

    /* ── LOGIN ── */
    document.getElementById("loginForm").addEventListener("submit", function(e) {
      e.preventDefault();
      const user = document.getElementById("username").value.trim().toLowerCase();
      const key = document.getElementById("adminKey").value.trim();
      const errEl = document.getElementById("loginError");
      const btn = document.getElementById("loginBtn");

      errEl.classList.remove("show");

      if (user !== ADMIN_USERNAME || key !== ADMIN_KEY) {
        errEl.textContent = "Invalid username or admin key.";
        errEl.classList.add("show");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Signing in...";

      // Verify key works by calling the API
      fetch(API_BASE + "/api/lead", {
        headers: { "x-admin-key": ADMIN_KEY }
      })
      .then(function(r) {
        if (!r.ok) throw new Error("API returned " + r.status);
        return r.json();
      })
      .then(function(leads) {
        allLeads = Array.isArray(leads) ? leads : [];
        showDashboard();
      })
      .catch(function(err) {
        errEl.textContent = "Could not connect to server. Please try again.";
        errEl.classList.add("show");
        btn.disabled = false;
        btn.textContent = "Sign In";
      });
    });

    /* ── SHOW DASHBOARD ── */
    function showDashboard() {
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("dashboard").classList.add("active");
      renderLeads(allLeads);
      updateStats(allLeads);
    }

    /* ── LOGOUT ── */
    function logout() {
      document.getElementById("dashboard").classList.remove("active");
      document.getElementById("loginScreen").style.display = "flex";
      document.getElementById("loginBtn").disabled = false;
      document.getElementById("loginBtn").textContent = "Sign In";
      document.getElementById("adminKey").value = "";
      document.getElementById("loginError").classList.remove("show");
    }

    /* ── FETCH LEADS ── */
    function fetchLeads() {
      var btn = document.getElementById("refreshBtn");
      btn.classList.add("spinning");
      fetch(API_BASE + "/api/lead", {
        headers: { "x-admin-key": ADMIN_KEY }
      })
      .then(function(r) { return r.json(); })
      .then(function(leads) {
        allLeads = Array.isArray(leads) ? leads : [];
        renderLeads(allLeads);
        updateStats(allLeads);
        btn.classList.remove("spinning");
      })
      .catch(function() {
        btn.classList.remove("spinning");
      });
    }

    /* ── RENDER TABLE ── */
    function renderLeads(leads) {
      var tbody = document.getElementById("leadsBody");
      if (!leads.length) {
        tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><p>No leads found</p><small>Leads will appear here when submitted through the website.</small></div></td></tr>';
        return;
      }
      // Sort newest first
      leads.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
      var html = "";
      for (var i = 0; i < leads.length; i++) {
        var l = leads[i];
        var date = l.createdAt ? new Date(l.createdAt) : null;
        var dateStr = date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
        var timeStr = date ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";
        html += '<tr>' +
          '<td>' + (i + 1) + '</td>' +
          '<td class="name">' + esc(l.name) + '</td>' +
          '<td class="email"><a href="mailto:' + esc(l.email) + '">' + esc(l.email) + '</a></td>' +
          '<td>' + (l.phone ? esc(l.phone) : '<span style="color:var(--Tmut)">—</span>') + '</td>' +
          '<td>' + (l.requirement ? '<span class="req-badge">' + esc(l.requirement) + '</span>' : '<span style="color:var(--Tmut)">—</span>') + '</td>' +
          '<td class="date">' + dateStr + '<br>' + timeStr + '</td>' +
          '</tr>';
      }
      tbody.innerHTML = html;
    }

    /* ── STATS ── */
    function updateStats(leads) {
      document.getElementById("statTotal").textContent = leads.length;
      var now = new Date();
      var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      var todayCount = 0, weekCount = 0, phoneCount = 0;
      for (var i = 0; i < leads.length; i++) {
        var d = leads[i].createdAt ? new Date(leads[i].createdAt) : null;
        if (d && d >= todayStart) todayCount++;
        if (d && d >= weekStart) weekCount++;
        if (leads[i].phone) phoneCount++;
      }
      document.getElementById("statToday").textContent = todayCount;
      document.getElementById("statWeek").textContent = weekCount;
      document.getElementById("statPhone").textContent = phoneCount;
    }

    /* ── SEARCH ── */
    document.getElementById("searchBox").addEventListener("input", function() {
      var q = this.value.toLowerCase().trim();
      if (!q) { renderLeads(allLeads); return; }
      var filtered = allLeads.filter(function(l) {
        return (l.name && l.name.toLowerCase().indexOf(q) !== -1) ||
               (l.email && l.email.toLowerCase().indexOf(q) !== -1) ||
               (l.requirement && l.requirement.toLowerCase().indexOf(q) !== -1) ||
               (l.phone && l.phone.indexOf(q) !== -1);
      });
      renderLeads(filtered);
    });

    /* ── ESCAPE HTML ── */
    function esc(s) {
      if (!s) return "";
      var d = document.createElement("div");
      d.textContent = s;
      return d.innerHTML;
    }
  </script>
</body>
</html>`;

const adminPath = path.resolve('c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\admin.html');
fs.writeFileSync(adminPath, adminHtml, 'utf8');
console.log('Created admin page at: pages/admin.html');
console.log('\n─── CREDENTIALS ───');
console.log('Username:  basitsoomro');
console.log('Admin Key: uikf3452hbikujg87894');
console.log('API Base:  https://src-five-sage.vercel.app');
console.log('─────────────────────');
