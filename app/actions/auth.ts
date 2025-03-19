"use server"

import { query, initializeDatabase } from "@/lib/db"
import { createHash } from "crypto"
import { z } from "zod"
import { cookies } from "next/headers"

// Initialize the database on first import
initializeDatabase().catch(console.error)

// Define validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

// Define validation schema for login
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export type RegisterFormState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
}

export type LoginFormState = {
  errors?: {
    email?: string[]
    password?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
}

// Simple password hashing function using SHA-256
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

export async function registerUser(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  // Extract form data
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate form data
  const validationResult = registerSchema.safeParse({ name, email, password })

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      success: false,
      message: "Please fix the errors in the form",
    }
  }

  try {
    // Check if user already exists
    const result = await query("SELECT * FROM users WHERE email = ?", [email])
    const existingUsers = result.rows as any[]

    if (existingUsers.length > 0) {
      return {
        errors: {
          email: ["This email is already registered"],
        },
        success: false,
        message: "This email is already registered",
      }
    }

    // Hash the password using SHA-256 (not as secure as bcrypt but doesn't require native modules)
    const passwordHash = hashPassword(password)

    // Insert the new user
    await query("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [name, email, passwordHash])

    // Set a session cookie - make it awaitable
    await cookies().set({
      name: "session",
      value: email,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    // Return success
    return {
      success: true,
      message: "Registration successful! Redirecting to chat...",
    }
  } catch (error) {
    console.error("Registration error:", error)

    return {
      errors: {
        _form: ["An error occurred during registration. Please try again."],
      },
      success: false,
      message: "An error occurred during registration",
    }
  }
}

export async function loginUser(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  // Extract form data
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate form data
  const validationResult = loginSchema.safeParse({ email, password })

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      success: false,
      message: "Please fix the errors in the form",
    }
  }

  try {
    // Hash the password for comparison
    const passwordHash = hashPassword(password)

    // Check if user exists and password matches
    const result = await query("SELECT * FROM users WHERE email = ? AND password_hash = ?", [email, passwordHash])
    const users = result.rows as any[]

    if (users.length === 0) {
      return {
        errors: {
          _form: ["Invalid email or password"],
        },
        success: false,
        message: "Invalid email or password",
      }
    }

    // Set a session cookie - make it awaitable
    await cookies().set({
      name: "session",
      value: email,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    // Return success
    return {
      success: true,
      message: "Login successful! Redirecting to chat...",
    }
  } catch (error) {
    console.error("Login error:", error)

    return {
      errors: {
        _form: ["An error occurred during login. Please try again."],
      },
      success: false,
      message: "An error occurred during login",
    }
  }
}

