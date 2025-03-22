import { NextResponse } from "next/server"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function GET() {
  try {
    // Check for API keys
    const geminiKey = process.env.GEMINI_API_KEY
    const googleGenAIKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!geminiKey && !googleGenAIKey) {
      return NextResponse.json(
        {
          success: false,
          error: "No API keys found in environment variables",
        },
        { status: 500 },
      )
    }

    // Try a simple test prompt
    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt: 'Respond with a simple JSON array containing 3 colors: ["red", "blue", "green"]',
      maxTokens: 100,
    })

    return NextResponse.json({
      success: true,
      apiKeyPresent: true,
      response: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error testing Gemini API:", error)

    return NextResponse.json(
      {
        success: false,
        apiKeyPresent: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY),
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

