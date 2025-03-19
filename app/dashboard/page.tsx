import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PawPrint, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12">
      {/* Subtle AI dots pattern */}
      <div className="absolute inset-0 ai-dots"></div>

      <div className="container max-w-4xl px-4 relative z-10">
        <Link href="/" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center mb-8">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <PawPrint className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter gradient-text">DogTor Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to DogTor!</CardTitle>
              <CardDescription>Your account has been successfully created</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Thank you for registering with DogTor. You now have unlimited access to our AI-powered veterinary
                assistant.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                Start Chatting
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Pet Profile</CardTitle>
              <CardDescription>Add information about your pets</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Adding details about your pets helps our AI provide more personalized advice.
              </p>
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                Add a Pet
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>Your chat history with DogTor</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              You haven't had any conversations yet. Start chatting with DogTor to get help with your pet's health
              concerns.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

