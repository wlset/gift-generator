import { NextResponse } from "next/server"

export async function GET() {
  // Check for API keys (we'll mask them for security)
  const geminiKey = process.env.GEMINI_API_KEY
  const googleGenAIKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  // Create masked versions for display (only show first 4 and last 4 chars)
  const maskKey = (key: string | undefined) => {
    if (!key) return "not set"
    if (key.length <= 8) return "****" // Too short to meaningfully mask
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    apiKeysConfigured: {
      GEMINI_API_KEY: geminiKey ? "set" : "not set",
      GOOGLE_GENERATIVE_AI_API_KEY: googleGenAIKey ? "set" : "not set",
      maskedGeminiKey: maskKey(geminiKey),
      maskedGoogleGenAIKey: maskKey(googleGenAIKey),
    },
    timestamp: new Date().toISOString(),
  })
}

