import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEADS_FILE = path.join(__dirname, "../../leads.json");

function readLeads() {
  if (!fs.existsSync(LEADS_FILE)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    // Never overwrite an unreadable file silently — the leads in it are the
    // point of the whole feature.
    console.error(`leads.json could not be read (${err.message}). Refusing to overwrite it.`);
    throw new Error("Leads store is unreadable.");
  }
}

// Write to a temp file and rename, so a crash mid-write cannot truncate leads.json.
function writeLeads(leads) {
  const tmpFile = `${LEADS_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(leads, null, 2));
  fs.renameSync(tmpFile, LEADS_FILE);
}

export function saveLead(lead) {
  const leads = readLeads();
  const newLead = {
    ...lead,
    // Generated last so a submitted payload can never forge them.
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  leads.push(newLead);
  writeLeads(leads);
  return newLead;
}

export function getAllLeads() {
  try {
    return readLeads();
  } catch {
    return [];
  }
}
