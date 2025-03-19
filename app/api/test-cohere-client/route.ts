import { CohereClientV2 } from "cohere-ai"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    // Initialize the Cohere client
    const client = new CohereClientV2({
      token: process.env.COHERE_API_KEY || "",
    })

    // Test the chat method with properly formatted messages
    const response = await client.chat({
      model: "command", // Use a standard model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message,
            },
          ],
        },
      ],
      preamble:
        "You are DogTor, an AI veterinary assistant that helps dog owners with questions about their pets' health, behavior, and care. You only answer questions related to dogs.",
    })

    return new Response(
      JSON.stringify({
        success: true,
        response: response.text,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error("Error in test-cohere-client API:", error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

