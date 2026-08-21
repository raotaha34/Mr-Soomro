import { search } from "./vectorService.js";
import { generateAnswer } from "./aiService.js";

const SYSTEM_PROMPT_BASE = `You are the official Mr. Soomro website assistant — a friendly, professional SEO expert helper.
For factual questions about services, pricing, process, reviews, or contact details, answer using ONLY the supplied website context below.
Never invent services, prices, or contact details that are not in the context.
If a factual answer is not contained in the context, say you don't have that information
and suggest the visitor contact Mr. Soomro directly.
If the visitor simply greets you (e.g. "hello", "hi", "hey", "salam", "good morning") or makes small talk,
do NOT say you lack information. Instead reply warmly in 1-2 sentences, introduce yourself as
Mr. Soomro's AI assistant, and invite them to ask about SEO services, pricing, or the free SEO audit.
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
