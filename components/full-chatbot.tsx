"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PawPrint, Send, User, LogOut, MessageCircle, BrainCircuit, Sparkles, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function FullChatbot() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Get user email from cookie
  useEffect(() => {
    const cookies = document.cookie.split(";")
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=")
      if (name === "session") {
        setUserEmail(decodeURIComponent(value))
        break
      }
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/")
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
    if (!input.trim() || isLoading) return

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

  // Handle quick prompt selection
  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  // Format message content with proper paragraph breaks and spacing
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

    // Process text to properly format paragraphs, lists, and other elements
    const processedContent = content
      // Replace sequences like "1." or "-" at the beginning of lines with proper formatting
      .replace(/^(\d+\.|-)\s+/gm, "<li>$&")
      .replace(/\n(\d+\.|-)\s+/g, "</li>\n<li>$&")
      // Add closing tag for the last list item if needed
      .replace(/<li>([^<]+)$/, "<li>$1</li>")
      // Split by double newlines to identify paragraphs
      .split(/\n\n+/)
      .map((para) => {
        // Check if this paragraph contains list items
        if (para.includes("<li>")) {
          return `<ul>${para}</ul>`
        }
        return para
      })
      .join("\n\n")

    return (
      <div className="space-y-4">
        {processedContent.split("\n\n").map((paragraph, i) => {
          // Check if this is a list
          if (paragraph.startsWith("<ul>")) {
            // Extract list items
            const listContent = paragraph
              .replace("<ul>", "")
              .replace("</ul>", "")
              .split("</li>\n<li>")
              .map((item) => item.replace("<li>", "").replace("</li>", ""))

            return (
              <ul key={i} className="list-disc pl-5 space-y-1">
                {listContent.map((item, j) => (
                  <li key={`${i}-${j}`}>{item}</li>
                ))}
              </ul>
            )
          }

          // Handle normal paragraphs
          // Split by single newlines within a paragraph to handle line breaks
          const lines = paragraph.split("\n")
          return (
            <p key={i} className="text-gray-800 dark:text-gray-200">
              {lines.map((line, j) => (
                <React.Fragment key={`${i}-${j}`}>
                  {j > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 py-4 px-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <PawPrint className="h-5 w-5" />
                Your Profile
              </h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center space-y-4 mb-8">
                <Avatar className="h-24 w-24 border-4 border-purple-200">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-2xl">
                    {userEmail ? userEmail.substring(0, 2).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium">{userEmail || "User"}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Premium Member</p>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Features
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-base">Unlimited Chat</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <BrainCircuit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-base">Advanced AI</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-base">Personalized Advice</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-base">Fast Response</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center justify-center gap-2 py-6 text-base"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 py-4 px-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <PawPrint className="h-5 w-5" />
                DogTor AI Assistant
              </h2>
            </div>

            <div
              ref={chatContainerRef}
              className="h-[calc(100vh-13rem)] overflow-y-auto p-6 space-y-8 bg-purple-50/50 dark:bg-gray-900/20"
            >
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div className="space-y-6 max-w-lg">
                    <div className="mx-auto h-28 w-28 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center animate-pulse-slow">
                        <PawPrint className="h-14 w-14 text-purple-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-medium">Welcome to DogTor!</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 px-4">
                      Ask me anything about your dog's health. For example: "My dog hasn't eaten in 2 days" or "What
                      vaccines does my puppy need?"
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-8">
                      <Button
                        variant="outline"
                        className="w-full h-auto py-5 px-6 text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50 text-base"
                        onClick={() => handleQuickPrompt("What vaccines does my puppy need?")}
                      >
                        What vaccines does my puppy need?
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-auto py-5 px-6 text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50 text-base"
                        onClick={() => handleQuickPrompt("My dog is scratching a lot, what could it be?")}
                      >
                        My dog is scratching a lot
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-auto py-5 px-6 text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50 text-base"
                        onClick={() => handleQuickPrompt("What human foods are toxic to dogs?")}
                      >
                        Toxic human foods for dogs
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-auto py-5 px-6 text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50 text-base"
                        onClick={() => handleQuickPrompt("How often should I bathe my dog?")}
                      >
                        How often to bathe my dog
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-4 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar
                          className={
                            message.role === "user"
                              ? "bg-primary/10 ring-2 ring-purple-300/50"
                              : "bg-primary/20 ring-2 ring-purple-300/50"
                          }
                        >
                          <AvatarFallback
                            className={
                              message.role === "user"
                                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                                : "bg-gradient-to-br from-purple-500 to-violet-600 text-white"
                            }
                          >
                            {message.role === "user" ? <User className="h-5 w-5" /> : <PawPrint className="h-5 w-5" />}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-5 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                              : "bg-white dark:bg-gray-800 shadow-md border border-purple-100 dark:border-purple-900/30"
                          }`}
                        >
                          {message.role === "assistant" ? formatMessageContent(message.content) : message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} className="h-0.5" />
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about your dog's health..."
                  className="flex-1 border-purple-200 dark:border-purple-800/50 focus-visible:ring-purple-500 py-6 text-base"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 shadow-md px-8 text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Thinking...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

