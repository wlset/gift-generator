import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
export function getGoogleAIClient() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("Missing Google Generative AI API key")
  }

  return new GoogleGenerativeAI(apiKey)
}

