"use server"

import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export type GiftFormData = {
  recipientName: string
  age: string
  gender: string
  relationship: string
  interests: string
  budget: string
  preferredGiftType: string
}

// Fallback gift ideas in case the API fails
const fallbackGiftIdeas = [
  {
    name: "Personalized Photo Album",
    description: "A custom photo album filled with memories.",
    reason: "A thoughtful way to celebrate your relationship and shared memories.",
    priceRange: "$25-$50",
    whereToBuy: ["Shutterfly", "Artifact Uprising", "Etsy"],
    recommendedBrands: ["Shutterfly", "Artifact Uprising", "Mixbook"],
  },
  {
    name: "Streaming Service Subscription",
    description: "A subscription to a premium streaming service.",
    reason: "Perfect for entertainment lovers to enjoy their favorite shows and movies.",
    priceRange: "$15-$20/month",
    whereToBuy: ["Netflix", "Disney+", "HBO Max"],
    recommendedBrands: ["Netflix", "Disney+", "Hulu"],
  },
  {
    name: "Gourmet Chocolate Box",
    description: "A selection of premium chocolates in an elegant gift box.",
    reason: "A delicious treat that's perfect for chocolate lovers.",
    priceRange: "$25-$50",
    whereToBuy: ["Godiva", "Lindt", "Local Chocolate Shops"],
    recommendedBrands: ["Godiva", "Ghirardelli", "Lindt"],
  },
  {
    name: "Wireless Earbuds",
    description: "High-quality wireless earbuds for music and calls.",
    reason: "Great for music lovers and people on the go.",
    priceRange: "$50-$150",
    whereToBuy: ["Amazon", "Best Buy", "Target"],
    recommendedBrands: ["Apple", "Samsung", "Jabra"],
  },
  {
    name: "Indoor Plant",
    description: "A low-maintenance indoor plant in a decorative pot.",
    reason: "Brings life to any space and shows thoughtfulness.",
    priceRange: "$15-$40",
    whereToBuy: ["Local Nurseries", "The Sill", "Bloomscape"],
    recommendedBrands: ["The Sill", "Bloomscape", "Plants.com"],
  },
]

export async function generateGiftIdeas(data: GiftFormData, isRegenerate = false) {
  try {
    // Check if API key is available
    const geminiKey = process.env.GEMINI_API_KEY
    const googleGenAIKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!geminiKey && !googleGenAIKey) {
      console.error("Missing API key: No GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY found in environment variables")
      return {
        success: false,
        error: "API key not configured. Please check your environment variables.",
        fallback: true,
        data: fallbackGiftIdeas,
      }
    }

    // Log which key we're using (without revealing the actual key)
    console.log("Using API key:", geminiKey ? "GEMINI_API_KEY" : "GOOGLE_GENERATIVE_AI_API_KEY")

    const prompt = `
      I need birthday gift ideas for someone with the following details:
      
      Name: ${data.recipientName}
      Age: ${data.age}
      Gender: ${data.gender}
      Relationship to me: ${data.relationship}
      Interests/Hobbies: ${data.interests}
      Budget: ${data.budget}
      Preferred Gift Type: ${data.preferredGiftType}
      
      ${isRegenerate ? "Please suggest 5 COMPLETELY DIFFERENT gift ideas than you might have suggested before. Be creative and think outside the box." : "Please suggest 5 specific gift ideas that would be meaningful and appropriate."}
      
      For each gift idea, provide:
      1. The name of the gift
      2. A brief description (1-2 sentences)
      3. Why it's appropriate for this person
      4. An estimated price range
      5. 2-3 specific stores or websites where this gift can be purchased
      6. 2-3 recommended brands that make high-quality versions of this gift
      
      Format the response as a JSON array with objects containing fields: 
      - name (string)
      - description (string)
      - reason (string)
      - priceRange (string)
      - whereToBuy (array of store names)
      - recommendedBrands (array of brand names)

      IMPORTANT: Your response must be a valid JSON array that can be parsed with JSON.parse().
      Start your response with [ and end with ].
    `

    console.log("Sending request to Gemini API...")

    try {
      // Set a timeout for the API request
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("API request timed out after 15 seconds")), 15000),
      )

      const apiPromise = generateText({
        model: google("gemini-1.5-pro"),
        prompt,
        maxTokens: 2048,
      })

      // Race the API request against the timeout
      const { text } = (await Promise.race([
        apiPromise,
        timeoutPromise.then(() => {
          throw new Error("API request timed out")
        }),
      ])) as { text: string }

      console.log("Received response from Gemini API")

      // Log a sample of the response for debugging
      console.log("Response sample:", text.substring(0, 200) + "...")

      // Try to extract JSON from the response
      let jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/)

      if (!jsonMatch) {
        console.error("Failed to extract JSON from response. Full response:", text)

        // Fallback: Try to find anything that looks like JSON
        jsonMatch = text.match(/\[[\s\S]*\]/)

        if (!jsonMatch) {
          return {
            success: false,
            error: "Failed to parse gift ideas from AI response. The response format was unexpected.",
            fallback: true,
            data: fallbackGiftIdeas,
          }
        }
      }

      try {
        const jsonText = jsonMatch[0]
        console.log("Attempting to parse JSON:", jsonText.substring(0, 100) + "...")

        const giftIdeas = JSON.parse(jsonText)

        // Validate the parsed data has the expected structure
        if (!Array.isArray(giftIdeas) || giftIdeas.length === 0) {
          console.error("Parsed JSON is not a valid array or is empty:", giftIdeas)
          return {
            success: false,
            error: "The AI generated an invalid response format. Please try again.",
            fallback: true,
            data: fallbackGiftIdeas,
          }
        }

        // Check if the first item has the expected properties
        const firstItem = giftIdeas[0]
        if (!firstItem.name || !firstItem.description || !firstItem.reason || !firstItem.priceRange) {
          console.error("Parsed JSON items are missing required properties:", firstItem)
          return {
            success: false,
            error: "The AI response is missing required information. Please try again.",
            fallback: true,
            data: fallbackGiftIdeas,
          }
        }

        return { success: true, data: giftIdeas }
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Text attempted to parse:", jsonMatch[0])
        return {
          success: false,
          error: "Failed to parse the AI response. Please try again.",
          fallback: true,
          data: fallbackGiftIdeas,
        }
      }
    } catch (apiError) {
      console.error("API request error:", apiError)
      return {
        success: false,
        error:
          apiError instanceof Error
            ? `API Error: ${apiError.message}`
            : "Failed to communicate with the AI service. Please try again.",
        fallback: true,
        data: fallbackGiftIdeas,
      }
    }
  } catch (error) {
    console.error("Error generating gift ideas:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred while generating gift ideas. Please try again.",
      fallback: true,
      data: fallbackGiftIdeas,
    }
  }
}

