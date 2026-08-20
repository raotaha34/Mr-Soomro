import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chunkText } from "../utils/chunkText.js";
import { embed, cosineSimilarity } from "./embeddingService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_DIR = path.join(__dirname, "../../knowledge");

// In-memory store: [{ text, source, vector }]
let store = [];
let loaded = false;

export function loadKnowledgeBase() {
  const files = fs.readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith(".txt"));

  store = [];
  for (const file of files) {
    const filePath = path.join(KNOWLEDGE_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const chunks = chunkText(raw, file);

    for (const chunk of chunks) {
      store.push({
        text: chunk.text,
        source: chunk.source,
        vector: embed(chunk.text),
      });
    }
  }

  loaded = true;
  console.log(`Vector store loaded: ${store.length} chunks from ${files.length} files.`);
  return store.length;
}

export function search(query, topK = 3) {
  if (!loaded) loadKnowledgeBase();

  const queryVector = embed(query);

  const scored = store.map((entry) => ({
    ...entry,
    score: cosineSimilarity(queryVector, entry.vector),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Filter out near-zero matches so irrelevant chunks don't pollute the prompt.
  return scored.filter((s) => s.score > 0.05).slice(0, topK);
}

export function getStoreSize() {
  return store.length;
}
