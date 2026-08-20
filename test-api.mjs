// Quick API test script - run from project root: node test-api.mjs
const BASE = "http://localhost:5000";
const ADMIN_KEY = "uikf3452hbikujg87894";

async function test(name, fn) {
  try {
    const result = await fn();
    console.log(`✅ ${name}: ${JSON.stringify(result).substring(0, 200)}`);
  } catch (err) {
    console.log(`❌ ${name}: ${err.message}`);
  }
}

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, ...data };
}

async function get(url, headers = {}) {
  const res = await fetch(url, { headers });
  const data = await res.json();
  return { status: res.status, ...data };
}

console.log("=== TESTING ALL API ENDPOINTS ===\n");

// 1. Health check
await test("GET /api/health", () => get(`${BASE}/api/health`));

// 2. Chat - valid message
await test("POST /api/chat (valid)", () =>
  post(`${BASE}/api/chat`, { message: "What services do you offer?" })
);

// 3. Chat - empty message (should 400)
await test("POST /api/chat (empty msg)", () =>
  post(`${BASE}/api/chat`, { message: "" })
);

// 4. Chat - missing message (should 400)
await test("POST /api/chat (no message)", () =>
  post(`${BASE}/api/chat`, {})
);

// 5. Chat - message too long (should 400)
await test("POST /api/chat (too long)", () =>
  post(`${BASE}/api/chat`, { message: "a".repeat(1001) })
);

// 6. Chat - pricing question
await test("POST /api/chat (pricing)", () =>
  post(`${BASE}/api/chat`, { message: "How much does Reddit marketing cost?" })
);

// 7. Chat - contact question
await test("POST /api/chat (contact)", () =>
  post(`${BASE}/api/chat`, { message: "How can I contact Mr. Soomro?" })
);

// 8. Lead - valid submission
await test("POST /api/lead (valid)", () =>
  post(`${BASE}/api/lead`, {
    name: "Test User",
    email: "test@example.com",
    website: "example.com",
    phone: "1234567890",
    requirement: "SEO services",
  })
);

// 9. Lead - missing fields (should 400)
await test("POST /api/lead (no fields)", () =>
  post(`${BASE}/api/lead`, {})
);

// 10. Lead - invalid email (should 400)
await test("POST /api/lead (bad email)", () =>
  post(`${BASE}/api/lead`, { name: "Test", email: "notanemail" })
);

// 11. Lead - XSS attempt (should sanitize)
await test("POST /api/lead (xss test)", () =>
  post(`${BASE}/api/lead`, {
    name: '<script>alert("xss")</script>',
    email: "xss@test.com",
    website: '<img onerror=alert(1)>',
  })
);

// 12. Lead - name too long (should 400)
await test("POST /api/lead (long name)", () =>
  post(`${BASE}/api/lead`, { name: "a".repeat(201), email: "long@test.com" })
);

// 13. GET leads - no auth (should 401)
await test("GET /api/lead (no auth)", () => get(`${BASE}/api/lead`));

// 14. GET leads - wrong key (should 401)
await test("GET /api/lead (wrong key)", () =>
  get(`${BASE}/api/lead`, { "x-admin-key": "wrong-key" })
);

// 15. GET leads - correct key (should 200)
await test("GET /api/lead (correct key)", () =>
  get(`${BASE}/api/lead`, { "x-admin-key": ADMIN_KEY })
);

console.log("\n=== ALL TESTS COMPLETE ===");
