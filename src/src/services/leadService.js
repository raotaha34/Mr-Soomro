import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Vercel's filesystem is read-only except /tmp, so leads must be written there.
// Locally (no VERCEL env) we keep writing to the project root as before.
const LEADS_FILE = process.env.VERCEL
  ? "/tmp/leads.json"
  : path.join(__dirname, "../../leads.json");

function readLeads() {
  if (!fs.existsSync(LEADS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeLeads(leads) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

export function saveLead(lead) {
  const leads = readLeads();
  const newLead = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...lead,
  };
  leads.push(newLead);
  writeLeads(leads);
  return newLead;
}

export function getAllLeads() {
  return readLeads();
}
