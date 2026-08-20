// Model is configurable so a retired model name can be swapped without a code change.
const DEFAULT_MODEL = "gemini-flash-latest";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_TIMEOUT_MS = 30000;
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function scrub(text, apiKey) {
  return apiKey ? String(text).split(apiKey).join("***") : String(text);
}

export async function generateAnswer(systemPrompt, userMessage) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // No key configured yet — fail clearly instead of pretending to work.
    return {
      answer:
        "AI is not connected yet. Add GEMINI_API_KEY to your .env file to enable real answers.",
      aiConnected: false,
    };
  }

  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await callGemini(apiKey, systemPrompt, userMessage);
    } catch (error) {
      lastError = error;
      // Gemini returns 429/503 when a model is briefly overloaded — those are
      // worth retrying, anything else is not.
      if (!error.retryable || attempt === MAX_ATTEMPTS) break;
      await sleep(500 * 2 ** (attempt - 1));
    }
  }

  // A busy or broken upstream is not the caller's fault, so surface it as such
  // instead of a generic 500.
  const wrapped = new Error(lastError.message);
  wrapped.statusCode = lastError.retryable ? 503 : 502;
  wrapped.userMessage = lastError.retryable
    ? "The AI service is busy right now. Please try again in a moment."
    : "The AI service could not be reached. Please try again later.";
  throw wrapped;
}

async function callGemini(apiKey, systemPrompt, userMessage) {
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE}/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Key travels in a header, not the query string, so it cannot leak via logs.
        "x-goog-api-key": apiKey,
      },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          maxOutputTokens: Number(process.env.GEMINI_MAX_OUTPUT_TOKENS) || 512,
          temperature: 0.5,
          candidateCount: 1,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      const error = new Error(
        `Gemini API error (${response.status}) for model "${model}": ${scrub(errText, apiKey).slice(0, 500)}`
      );
      error.retryable = RETRY_STATUSES.has(response.status);
      throw error;
    }

    const data = await response.json();

    // Gemini can return no candidates if the response was blocked by safety filters.
    const candidate = data.candidates?.[0];
    if (!candidate) {
      const blockReason = data.promptFeedback?.blockReason;
      return {
        answer: blockReason
          ? "The AI could not answer that question (blocked by a safety filter)."
          : "The AI did not return a response. Please try again.",
        aiConnected: true,
      };
    }

    const text = (candidate.content?.parts || [])
      .map((p) => p.text)
      .filter(Boolean)
      .join("")
      .trim();

    if (!text) {
      // Reasoning models can spend the whole output budget before emitting text.
      const answer =
        candidate.finishReason === "MAX_TOKENS"
          ? "The answer was cut off before it could be written. Please ask a shorter question."
          : "No response generated. Please try again.";
      return { answer, aiConnected: true };
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
