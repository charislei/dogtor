"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PawPrint, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    try {
      // In a real app, you would call an API endpoint here
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      {/* Subtle AI dots pattern */}
      <div className="absolute inset-0 ai-dots"></div>

      <div className="container max-w-md px-4 relative z-10">
        <Link href="/login" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
            <PawPrint className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter gradient-text">Forgot Password</h1>
          <p className="text-gray-500 mt-2">We'll send you a link to reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your email address to receive a reset link</CardDescription>
          </CardHeader>

          {isSubmitted ? (
            <CardContent className="space-y-4">
              <Alert className="bg-green-50 text-green-800 border border-green-200">
                <AlertDescription>
                  If an account exists with this email, you will receive password reset instructions shortly.
                </AlertDescription>
              </Alert>
              <div className="text-center mt-4">
                <Link href="/login" className="text-purple-600 hover:text-purple-800">
                  Return to login
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-50 text-red-800 border border-red-200">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

