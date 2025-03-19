import type { NextRequest } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Helper function to check if the message is about non-dog animals
function isIrrelevant(question: string): boolean {
  const irrelevantAnimals = [
    "cat",
    "rabbit",
    "bird",
    "hamster",
    "fish",
    "turtle",
    "parrot",
    "guinea pig",
    "ferret",
    "lizard",
    "snake",
    "mouse",
    "rat",
    "chinchilla",
    "horse",
    "goat",
    "sheep",
    "pig",
    "cow",
    "duck",
    "chicken",
    "frog",
    "gecko",
    "hedgehog",
    "alpaca",
  ]
  return irrelevantAnimals.some((animal) => question.toLowerCase().includes(animal))
}

// Fallback response generator
function generateFallbackResponse(question: string): string {
  const lowerQuestion = question.toLowerCase()

  // Check for greetings
  if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/i.test(lowerQuestion)) {
    return "Hello! How can I assist you with your dog's health today?"
  }

  // Check for thanks
  if (/\b(thank you|thanks|thank)\b/i.test(lowerQuestion)) {
    return "You're welcome! I'm happy to help with any other questions about your dog."
  }

  // Food-related fallback
  if (/\b(food|feed|diet|eat|nutrition|hungry)\b/i.test(lowerQuestion)) {
    return "Dogs need a balanced diet with protein, carbohydrates, fats, vitamins, and minerals.\n\nHigh-quality commercial dog food is usually the best option for most dogs. Always ensure fresh water is available.\n\nFeed according to your dog's size, age, and activity level. Maintain consistent feeding times and avoid table scraps and human food that may be toxic to dogs.\n\nConsult your veterinarian for specific dietary recommendations."
  }

  // Health-related fallback
  if (/\b(health|sick|ill|disease|condition|vet|vaccine|medicine|symptoms|treatment)\b/i.test(lowerQuestion)) {
    return "Regular veterinary check-ups are essential for your dog's health. Core vaccines for dogs include rabies, distemper, parvovirus, and adenovirus.\n\nIf your dog shows any of these symptoms, consult a veterinarian:\n- Persistent vomiting or diarrhea\n- Significant change in appetite or water consumption\n- Lethargy or decreased activity\n- Difficulty breathing\n- Unusual lumps or bumps"
  }

  // Behavior-related fallback
  if (/\b(behavior|training|train|bark|aggressive|anxiety|scared|fear|play|socialize)\b/i.test(lowerQuestion)) {
    return "Dogs need regular exercise and mental stimulation. Positive reinforcement is the most effective training method.\n\nKeep training sessions short (5-15 minutes) but frequent. Socialization with other dogs and people is important for puppies.\n\nCommon behavior issues include:\n- Excessive barking (often caused by boredom or anxiety)\n- Chewing (natural behavior that can be redirected to appropriate toys)\n- Jumping up (can be addressed by ignoring and rewarding four paws on floor)\n- Pulling on leash (requires consistent training)"
  }

  // Default fallback
  return "I can provide information about dog health, nutrition, behavior, and care. Could you please provide more details about your question?"
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]
    const userMessage = latestMessage.content.trim()

    // Check for irrelevant content (non-dog related)
    if (isIrrelevant(userMessage)) {
      return new Response(
        JSON.stringify({
          role: "assistant",
          content: "I can only assist with dog issues/concerns.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    }

    // Check for greetings or polite responses
    const greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"]
    const politeResponses = ["thank you", "thanks", "alright", "okay"]

    if (greetings.some((word) => userMessage.toLowerCase().includes(word))) {
      return new Response(
        JSON.stringify({
          role: "assistant",
          content: "Hello! How can I assist you with your dog's concerns?",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    } else if (politeResponses.some((word) => userMessage.toLowerCase().includes(word))) {
      return new Response(
        JSON.stringify({
          role: "assistant",
          content: "You're welcome! Let me know if you need any help with your dog.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    }

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Use the standard Cohere model
          const cohereResponse = await fetch("https://api.cohere.ai/v1/generate", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              model: "command", // Use the standard command model
              prompt: `You are DogTor, an AI veterinary assistant that helps dog owners with questions about their pets' health, behavior, and care. You only answer questions related to dogs.

Format your responses with clear structure:
- Use double line breaks between paragraphs
- Use a dash or hyphen followed by a space for bullet points
- Start each bullet point on a new line
- Keep your answers concise but informative
- Use proper formatting to make your response easy to read

User question: ${userMessage}

DogTor's response:`,
              max_tokens: 500,
              temperature: 0.7,
              k: 0,
              stop_sequences: [],
              return_likelihoods: "NONE",
            }),
          })

          if (!cohereResponse.ok) {
            throw new Error(`Cohere API error: ${cohereResponse.status}`)
          }

          const cohereData = await cohereResponse.json()

          if (cohereData.generations && cohereData.generations.length > 0) {
            const generatedText = cohereData.generations[0].text.trim()

            // Split the text into chunks to simulate streaming
            const chunks = generatedText.match(/.{1,20}/g) || []

            // Send each chunk with a small delay to simulate streaming
            for (const chunk of chunks) {
              const formattedChunk = encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)
              controller.enqueue(formattedChunk)
              // Add a small delay between chunks
              await new Promise((resolve) => setTimeout(resolve, 50))
            }
          } else {
            throw new Error("No generations in Cohere response")
          }
        } catch (error) {
          console.error("Error with Cohere:", error)

          // Use fallback response generator
          const fallbackResponse = generateFallbackResponse(userMessage)

          // Split the fallback text into chunks to simulate streaming
          const chunks = fallbackResponse.match(/.{1,20}/g) || []

          // Send each chunk with a small delay to simulate streaming
          for (const chunk of chunks) {
            const formattedChunk = encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)
            controller.enqueue(formattedChunk)
            // Add a small delay between chunks
            await new Promise((resolve) => setTimeout(resolve, 50))
          }
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
    console.error("Error in chat API:", error)

    return new Response(
      JSON.stringify({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  }
}

