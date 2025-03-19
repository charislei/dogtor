import { CohereClientV2 } from "cohere-ai"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    // Initialize the Cohere client
    const client = new CohereClientV2({
      token: process.env.COHERE_API_KEY || "",
    })

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Follow the example exactly
          const cohereStream = await client.chatStream({
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
            temperature: 0.3,
          })

          // Process each chunk from the stream
          for await (const chunk of cohereStream) {
            if (chunk.eventType === "text-generation") {
              // Format the chunk as expected by the client
              const formattedChunk = encoder.encode(`data: ${JSON.stringify({ chunk: chunk.text })}\n\n`)
              controller.enqueue(formattedChunk)
            }
          }
        } catch (error) {
          console.error("Error in Cohere stream:", error)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: error instanceof Error ? error.message : String(error) })}\n\n`,
            ),
          )
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error in test-cohere-stream API:", error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

