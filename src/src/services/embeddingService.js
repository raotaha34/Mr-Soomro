// Local, zero-cost "embedding" using TF-IDF style term-frequency vectors.
// This is a deliberate substitute for a paid embedding API (OpenAI, Voyage, etc.)
// so the project runs for free, per the plan's instruction to avoid paid
// services during early development. Swap this out for a real embedding API
// later if retrieval quality needs to improve.

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "to", "of", "and", "or", "in", "on", "at", "for", "with", "by", "as",
  "that", "this", "it", "its", "do", "does", "did", "you", "your", "we",
  "our", "i", "they", "their", "he", "she", "his", "her", "will", "can",
  "if", "not", "so", "but", "from", "about", "into", "over",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w));
}

// Builds a term-frequency vector (as a plain object: term -> count).
export function embed(text) {
  const tokens = tokenize(text);
  const vector = {};
  for (const token of tokens) {
    vector[token] = (vector[token] || 0) + 1;
  }
  return vector;
}

// Cosine similarity between two term-frequency vectors.
export function cosineSimilarity(vecA, vecB) {
  const keysA = Object.keys(vecA);
  const keysB = Object.keys(vecB);
  if (keysA.length === 0 || keysB.length === 0) return 0;

  let dot = 0;
  for (const key of keysA) {
    if (vecB[key]) dot += vecA[key] * vecB[key];
  }

  const magA = Math.sqrt(keysA.reduce((sum, k) => sum + vecA[k] ** 2, 0));
  const magB = Math.sqrt(keysB.reduce((sum, k) => sum + vecB[k] ** 2, 0));

  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}
