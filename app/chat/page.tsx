import type { Metadata } from "next"
import FullChatbot from "@/components/full-chatbot"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "DogTor - Chat with our AI Vet Assistant",
  description: "Get instant answers to your dog health questions with our AI-powered veterinary assistant.",
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle AI dots pattern */}
      <div className="absolute inset-0 ai-dots"></div>

      <div className="relative z-10 w-full">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl gradient-text">Chat with DogTor</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
              Ask any questions about your dog's health, behavior, or care
            </p>
          </div>
        </div>

        <div className="w-full">
          <FullChatbot />
        </div>
      </div>
    </div>
  )
}

