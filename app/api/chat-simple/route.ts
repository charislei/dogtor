import { StreamingTextResponse } from "ai"
import { cohere } from "@ai-sdk/cohere"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]
    const userMessage = lastMessage.content

    // Use a simple prompt for testing
    const prompt = `You are DogTor, an AI veterinary assistant. 
User: ${userMessage}
DogTor:`

    // Use streamText with minimal options
    const stream = await streamText({
      model: cohere("command"),
      prompt: prompt,
    })

    // Return streaming response
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error in chat-simple API:", error)
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

