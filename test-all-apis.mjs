// Comprehensive API test for all endpoints
const BASE = "http://localhost:5000";
let passed = 0, failed = 0, total = 0;

async function test(name, url, opts = {}, expectStatus = 200) {
  total++;
  try {
    const r = await fetch(url, opts);
    const text = await r.text();
    let d;
    try { d = JSON.parse(text); } catch { d = text; }

    const actual = r.status;
    const ok = actual === expectStatus;
    const icon = ok ? "PASS" : "FAIL";
    ok ? passed++ : failed++;

    const resp = typeof d === "string" ? d : JSON.stringify(d).substring(0, 180);
    console.log(`  ${icon}  [${actual}] ${name}${ok ? "" : ` (expected ${expectStatus})`}`);
    console.log(`        ${resp}`);
    console.log();
    return { status: actual, data: d };
  } catch (e) {
    failed++;
    console.log(`  FAIL  [ERR] ${name} — ${e.message}`);
    console.log();
  }
}

const H = { "Content-Type": "application/json" };
const post = (url, body) => ({ method: "POST", headers: H, body: JSON.stringify(body) });

console.log("=".repeat(65));
console.log("  MR. SOOMRO — FULL API TEST SUITE  (5 endpoints, 16 tests)");
console.log("=".repeat(65));
console.log();

// ═══════════════════════════════════════════════
//  1. GET /api/health
// ═══════════════════════════════════════════════
console.log("─ 1. GET /api/health ─");
await test("Health check", `${BASE}/api/health`, {}, 200);

// ═══════════════════════════════════════════════
//  2. POST /api/chat
// ═══════════════════════════════════════════════
console.log("─ 2. POST /api/chat ─");
await test("Valid question", `${BASE}/api/chat`,
  post(`${BASE}/api/chat`, { message: "What services do you offer?" }), 200);

await test("Empty message → 400", `${BASE}/api/chat`,
  post(`${BASE}/api/chat`, { message: "" }), 400);

await test("Missing message → 400", `${BASE}/api/chat`,
  post(`${BASE}/api/chat`, {}), 400);

await test("Message too long → 400", `${BASE}/api/chat`,
  post(`${BASE}/api/chat`, { message: "x".repeat(1001) }), 400);

// ═══════════════════════════════════════════════
//  3. POST /api/lead
// ═══════════════════════════════════════════════
console.log("─ 3. POST /api/lead ─");
await test("Valid submission → 201", `${BASE}/api/lead`,
  post(`${BASE}/api/lead`, { name: "Final Test", email: "final@test.com", website: "test.com", phone: "123", requirement: "SEO" }), 201);

await test("Missing email → 400", `${BASE}/api/lead`,
  post(`${BASE}/api/lead`, { name: "Test" }), 400);

await test("Missing name → 400", `${BASE}/api/lead`,
  post(`${BASE}/api/lead`, { email: "t@t.com" }), 400);

await test("Bad email format → 400", `${BASE}/api/lead`,
  post(`${BASE}/api/lead`, { name: "Test", email: "not-an-email" }), 400);

await test("Name too long → 400", `${BASE}/api/lead`,
  post(`${BASE}/api/lead`, { name: "A".repeat(201), email: "t@t.com" }), 400);

// ═══════════════════════════════════════════════
//  4. GET /api/lead (Admin)
// ═══════════════════════════════════════════════
console.log("─ 4. GET /api/lead (Admin auth) ─");
await test("No auth header → 401", `${BASE}/api/lead`, {}, 401);

await test("Wrong admin key → 401", `${BASE}/api/lead`,
  { headers: { "x-admin-key": "wrong-key" } }, 401);

await test("Correct admin key → 200", `${BASE}/api/lead`,
  { headers: { "x-admin-key": "uikf3452hbikujg87894" } }, 200);

// ═══════════════════════════════════════════════
//  5. POST /api/contact (Email + Lead save)
// ═══════════════════════════════════════════════
console.log("─ 5. POST /api/contact (Email + Save) ─");

// Get current lead count before contact test
const beforeLeads = await fetch(`${BASE}/api/lead`, { headers: { "x-admin-key": "uikf3452hbikujg87894" } });
const leadsBefore = (await beforeLeads.json()).length;

// Run validation tests FIRST (before hitting rate limiter)
await test("Missing fields → 400", `${BASE}/api/contact`,
  post(`${BASE}/api/contact`, { name: "Test" }), 400);

await test("Bad email → 400", `${BASE}/api/contact`,
  post(`${BASE}/api/contact`, { name: "Test", email: "bad", message: "hi" }), 400);

await test("Name too long → 400", `${BASE}/api/contact`,
  post(`${BASE}/api/contact`, { name: "B".repeat(201), email: "t@t.com", message: "hi" }), 400);

// Now send the real email (last, since rate limiter is 3/min)
await test("Valid contact → 200 (email + save)", `${BASE}/api/contact`,
  post(`${BASE}/api/contact`, {
    name: "Final Contact Test",
    email: "contact@test.com",
    message: "Hello from the full test suite. Please confirm contact form works.",
    website: "https://example.com",
    phone: "+92 309 210 2705",
  }), 200);

// Verify lead was saved
const afterLeads = await fetch(`${BASE}/api/lead`, { headers: { "x-admin-key": "uikf3452hbikujg87894" } });
const leadsAfter = (await afterLeads.json()).length;
total++;
if (leadsAfter > leadsBefore) {
  passed++;
  console.log(`  PASS  [VERIFY] Lead saved to leads.json (count: ${leadsBefore} → ${leadsAfter})`);
} else {
  failed++;
  console.log(`  FAIL  [VERIFY] Lead NOT saved (count: ${leadsBefore} → ${leadsAfter})`);
}
console.log();

// ═══════════════════════════════════════════════
//  SUMMARY
// ═══════════════════════════════════════════════
console.log("=".repeat(65));
const pct = Math.round((passed / total) * 100);
console.log(`  RESULTS: ${passed}/${total} passed (${pct}%)  |  ${failed} failed`);
console.log("=".repeat(65));
