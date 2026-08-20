// Groq AI Service - Free tier with generous limits
// Get API key: https://console.groq.com/keys
const DEFAULT_MODEL = "openai/gpt-oss-20b";
const API_BASE = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_TIMEOUT_MS = 30000;
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function scrub(text, apiKey) {
  return apiKey ? String(text).split(apiKey).join("***") : String(text);
}

export async function generateAnswer(systemPrompt, userMessage) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    // No key configured yet — fail clearly instead of pretending to work.
    return {
      answer:
        "AI is not connected yet. Add GROQ_API_KEY to your .env file to enable real answers.",
      aiConnected: false,
    };
  }

  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await callGroq(apiKey, systemPrompt, userMessage);
    } catch (error) {
      lastError = error;
      // Groq returns 429/503 when rate limited — those are worth retrying
      if (!error.retryable || attempt === MAX_ATTEMPTS) break;
      await sleep(500 * 2 ** (attempt - 1));
    }
  }

  // A busy or broken upstream is not the caller's fault, so surface it as such
  const wrapped = new Error(lastError.message);
  wrapped.statusCode = lastError.retryable ? 503 : 502;
  wrapped.userMessage = lastError.retryable
    ? "The AI service is busy right now. Please try again in a moment."
    : "The AI service could not be reached. Please try again later.";
  throw wrapped;
}

async function callGroq(apiKey, systemPrompt, userMessage) {
  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  const timeoutMs = Number(process.env.GROQ_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: Number(process.env.GROQ_MAX_OUTPUT_TOKENS) || 512,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      const error = new Error(
        `Groq API error (${response.status}) for model "${model}": ${scrub(errText, apiKey).slice(0, 500)}`
      );
      error.retryable = RETRY_STATUSES.has(response.status);
      throw error;
    }

    const data = await response.json();

    const choice = data.choices?.[0];
    if (!choice) {
      return {
        answer: "The AI did not return a response. Please try again.",
        aiConnected: true,
      };
    }

    const text = choice.message?.content?.trim();
    
    if (!text) {
      // Reasoning models may put thinking in `reasoning` and leave `content` empty
      // when token budget is tight. Fall back gracefully.
      const reasoning = choice.message?.reasoning?.trim();
      if (reasoning) {
        return {
          answer: "I processed your question but couldn't formulate a full response. Please try rephrasing.",
          aiConnected: true,
        };
      }
      return {
        answer: "No response generated. Please try again.",
        aiConnected: true,
      };
    }

    return { answer: text, aiConnected: true };
  } catch (error) {
    if (error.name === "AbortError") {
      return {
        answer: "Response took too long. Please try again.",
        aiConnected: true,
      };
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
