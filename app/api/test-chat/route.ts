import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Always use the standard command model
    const modelId = "command"

    // Test the Cohere generate API with the command model
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        prompt: `You are DogTor, an AI veterinary assistant that helps dog owners with questions about their pets' health, behavior, and care. You only answer questions related to dogs.

User question: What should I feed my dog?

DogTor's response:`,
        max_tokens: 300,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: "NONE",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({
          success: false,
          error: `Cohere API error: ${response.status}`,
          details: errorText,
          modelUsed: modelId,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    }

    const data = await response.json()
    let responseText = ""

    if (data.generations && data.generations.length > 0) {
      responseText = data.generations[0].text.trim()
    }

    return new Response(
      JSON.stringify({
        success: true,
        modelUsed: modelId,
        response: responseText || "No text generated",
        fullResponse: data,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  }
}

