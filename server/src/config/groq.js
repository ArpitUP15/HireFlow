import Groq from "groq-sdk";
export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
// Initialize lazily: the rest of HireFlow works before an API key is configured.
export function getGroq() {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey || !apiKey.startsWith("gsk_") || apiKey.includes("your_")) {
    throw Object.assign(
      new Error(
        "Add your real GROQ_API_KEY to server/.env and restart the backend.",
      ),
      { status: 503 },
    );
  }
  return new Groq({
    apiKey,
    timeout: Number(process.env.GROQ_TIMEOUT_MS) || 90000,
    maxRetries: 0,
  });
}
