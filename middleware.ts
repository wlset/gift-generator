import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if we're on the server and if the API key is available
  const hasGeminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

  // Log for debugging
  console.log("Middleware check - API key available:", !!hasGeminiKey)

  // Continue with the request
  return NextResponse.next()
}

// Only run the middleware on the homepage
export const config = {
  matcher: "/",
}

