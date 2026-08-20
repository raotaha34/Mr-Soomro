// Splits raw text into overlapping word-based chunks.
// Overlap keeps context from being cut off mid-idea at chunk boundaries.
export function chunkText(text, source, chunkSize = 120, overlap = 20) {
  const words = text
    .replace(/\r\n/g, "\n")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return [];

  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunkWords = words.slice(start, end);
    chunks.push({
      text: chunkWords.join(" "),
      source,
    });

    if (end === words.length) break;
    start += chunkSize - overlap;
  }

  return chunks;
}
