"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PawPrint, Send, User, Sparkles, Lock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatbotSection() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Track the number of exchanges (user message + assistant response)
  const [exchangeCount, setExchangeCount] = useState(0)
  const MAX_EXCHANGES = 3

  // Check if chat limit is reached
  const isChatLimitReached = exchangeCount >= MAX_EXCHANGES

  // Handle redirect to registration page
  const handleGetFullAccess = () => {
    router.push("/register")
  }

  // Only scroll to bottom when a new message is added
  const scrollToBottom = () => {
    if (messagesEndRef.current && chatContainerRef.current) {
      // Only scroll the chat container, not the whole page
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  // Scroll to bottom only when messages are added, not on every update
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages.length])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || isChatLimitReached) return

    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create a new abort controller
    abortControllerRef.current = new AbortController()

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Add assistant message with empty content that will be streamed
    const assistantMessageId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      },
    ])

    try {
      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error details:", errorText)
        throw new Error(`API error: ${response.status} ${errorText}`)
      }

      // Check if it's a streaming response
      const contentType = response.headers.get("Content-Type")
      if (contentType && contentType.includes("text/event-stream")) {
        // Handle streaming response
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error("Response body is not readable")
        }

        let accumulatedContent = ""
        const decoder = new TextDecoder()

        // Process the stream
        const processStream = async () => {
          let buffer = ""

          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              break
            }

            // Decode the chunk and add to buffer
            buffer += decoder.decode(value, { stream: true })

            // Process complete events in the buffer
            const lines = buffer.split("\n\n")
            buffer = lines.pop() || "" // Keep the last incomplete chunk in the buffer

            for (const line of lines) {
              if (line.trim() === "") continue

              // Parse the event data
              const dataMatch = line.match(/data: (.+)/)
              if (dataMatch && dataMatch[1]) {
                try {
                  const data = JSON.parse(dataMatch[1])

                  if (data.chunk) {
                    // Add the chunk to accumulated content
                    accumulatedContent += data.chunk

                    // Update the message with the accumulated content
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId ? { ...msg, content: accumulatedContent } : msg,
                      ),
                    )
                  } else if (data.error) {
                    throw new Error(data.error)
                  }
                } catch (e) {
                  console.error("Error parsing event data:", e, line)
                }
              }
            }
          }
        }

        await processStream()

        // Increment exchange count after successful response
        setExchangeCount((prev) => prev + 1)
      } else {
        // Handle non-streaming response (fallback)
        const data = await response.json()

        // Update the message with the complete content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: data.content || "Sorry, I couldn't process your request." }
              : msg,
          ),
        )

        // Increment exchange count after successful response
        setExchangeCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // Update the message to show the error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Sorry, there was an error processing your request. Please try again." }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  // Simple formatting for message content with just paragraph breaks
  const formatMessageContent = (content: string) => {
    if (!content) {
      return (
        <div className="flex space-x-2">
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"></div>
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></div>
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></div>
        </div>
      )
    }

    // Simple paragraph formatting
    return <div className="whitespace-pre-wrap">{content}</div>
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <section className="py-16 md:py-24 flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle AI dots pattern */}
      <div className="absolute inset-0 ai-dots"></div>

      <div className="container mx-auto relative px-4 md:px-6 z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
            <Sparkles className="h-4 w-4" />
            Live Demo
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">Try DogTor Now</h2>
          <p className="max-w-[900px] mx-auto text-gray-500 md:text-lg/relaxed lg:text-base/relaxed dark:text-gray-400">
            Ask our AI vet assistant about your dog's health concerns
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="gradient-border">
            <Card className="glass-card border-0 shadow-xl overflow-hidden backdrop-blur-md">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 border-b py-3">
                <CardTitle className="flex items-center gap-2 text-white">
                  <PawPrint className="h-5 w-5" />
                  DogTor Chat
                  {isChatLimitReached && (
                    <div className="ml-auto flex items-center text-xs font-normal bg-white/20 px-2 py-1 rounded-full">
                      <Lock className="h-3 w-3 mr-1" />
                      Demo Limit Reached
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={chatContainerRef} className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center">
                      <div className="space-y-2">
                        <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center animate-pulse-slow">
                            <PawPrint className="h-10 w-10 text-purple-500" />
                          </div>
                        </div>
                        <h3 className="text-lg font-medium">Welcome to DogTor!</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                          Ask me anything about your dog's health. For example: "My dog hasn't eaten in 2 days" or "What
                          vaccines does my puppy need?"
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
                          <Button
                            variant="outline"
                            className="w-full h-auto py-4 px-5 text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50 text-base"
                            onClick={() => handleQuickPrompt("What vaccines does my puppy need?")}
                          >
                            What vaccines does my puppy need?
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full h-auto py-4 px-5 text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50 text-base"
                            onClick={() => handleQuickPrompt("My dog is scratching a lot, what could it be?")}
                          >
                            My dog is scratching a lot
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full h-auto py-4 px-5 text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50 text-base"
                            onClick={() => handleQuickPrompt("What human foods are toxic to dogs?")}
                          >
                            Toxic human foods for dogs
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full h-auto py-4 px-5 text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50 text-base"
                            onClick={() => handleQuickPrompt("How often should I bathe my dog?")}
                          >
                            How often to bathe my dog
                          </Button>
                        </div>
                        <p className="text-xs text-purple-500 mt-2">
                          <Lock className="h-3 w-3 inline mr-1" />
                          Demo limited to {MAX_EXCHANGES} exchanges
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                          >
                            <Avatar
                              className={
                                message.role === "user"
                                  ? "bg-primary/10 ring-2 ring-purple-300/50"
                                  : "bg-primary/20 ring-2 ring-purple-300/50"
                              }
                            >
                              <AvatarFallback>
                                {message.role === "user" ? (
                                  <User className="h-5 w-5" />
                                ) : (
                                  <PawPrint className="h-5 w-5" />
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 ${
                                message.role === "user"
                                  ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg"
                                  : "glass-card shadow-md"
                              }`}
                            >
                              {message.role === "assistant" ? formatMessageContent(message.content) : message.content}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Show upgrade message after limit is reached */}
                      {isChatLimitReached && (
                        <div className="mt-6 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center">
                          <div className="flex justify-center mb-2">
                            <div className="h-10 w-10 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                              <Lock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                            </div>
                          </div>
                          <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300">
                            Demo Limit Reached
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            You've reached the limit of {MAX_EXCHANGES} exchanges in the demo. Sign up for unlimited
                            access to DogTor.
                          </p>
                          <Button
                            onClick={handleGetFullAccess}
                            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white group"
                            type="button"
                          >
                            Get Full Access
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      )}

                      <div ref={messagesEndRef} className="h-0.5" />
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t border-white/10">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder={isChatLimitReached ? "Demo limit reached" : "Ask about your dog's health..."}
                    className="flex-1 border-purple-200/50 dark:border-purple-800/50 focus-visible:ring-purple-500 bg-white/80 dark:bg-gray-900/80"
                    disabled={isLoading || isChatLimitReached}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim() || isChatLimitReached}
                    className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

