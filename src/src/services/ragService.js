import { search } from "./vectorService.js";
import { generateAnswer } from "./aiService.js";

const SYSTEM_PROMPT_BASE = `You are the official Mr. Soomro website assistant.
Answer using ONLY the supplied website context below.
Never invent services, prices, or contact details that are not in the context.
If the answer is not contained in the context, say you don't have that information
and suggest the visitor contact Mr. Soomro directly.
Keep answers concise and professional.`;

export async function answerQuery(userMessage) {
  const relevantChunks = search(userMessage, 2); // Reduced from 3 to 2 for faster processing

  const context = relevantChunks.length
    ? relevantChunks.map((c) => `[Source: ${c.source}]\n${c.text}`).join("\n\n")
    : "No relevant information found in the knowledge base.";

  // Truncate context if too long to speed up processing
  const maxContextLength = 2000;
  const truncatedContext = context.length > maxContextLength 
    ? context.substring(0, maxContextLength) + "..." 
    : context;

  const systemPrompt = `${SYSTEM_PROMPT_BASE}\n\nCONTEXT:\n${truncatedContext}`;

  const result = await generateAnswer(systemPrompt, userMessage);

  return {
    answer: result.answer,
    aiConnected: result.aiConnected,
    sources: relevantChunks.map((c) => c.source),
    matchedChunks: relevantChunks.length,
  };
}
