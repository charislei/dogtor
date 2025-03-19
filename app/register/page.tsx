"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PawPrint, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { registerUser, type RegisterFormState } from "../actions/auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        "Create Account"
      )}
    </Button>
  )
}

const initialState: RegisterFormState = {
  success: false,
  errors: {},
}

export default function RegisterPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(registerUser, initialState)

  // Redirect after successful registration
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push("/chat")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [state?.success, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      {/* Subtle AI dots pattern */}
      <div className="absolute inset-0 ai-dots"></div>

      <div className="container max-w-md px-4 relative z-10">
        <Link href="/" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
            <PawPrint className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter gradient-text">Join DogTor</h1>
          <p className="text-gray-500 mt-2">Create an account to access our AI-powered veterinary assistant</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Enter your details to create an account</CardDescription>
          </CardHeader>

          <form action={formAction}>
            <CardContent className="space-y-4">
              {/* Form-level error message */}
              {state?.errors?._form && (
                <Alert variant="destructive" className="bg-red-50 text-red-800 border border-red-200">
                  <AlertDescription>{state.errors._form}</AlertDescription>
                </Alert>
              )}

              {/* Success message */}
              {state?.success && (
                <Alert className="bg-green-50 text-green-800 border border-green-200">
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className={state?.errors?.name ? "border-red-500" : ""}
                />
                {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className={state?.errors?.email ? "border-red-500" : ""}
                />
                {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className={state?.errors?.password ? "border-red-500" : ""}
                />
                {state?.errors?.password && <p className="text-red-500 text-xs mt-1">{state.errors.password[0]}</p>}
                <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <SubmitButton />
              <div className="text-center text-sm">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 hover:text-purple-800">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

