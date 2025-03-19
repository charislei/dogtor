import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define paths that require authentication
  const isProtectedPath = path === "/chat" || path.startsWith("/dashboard")

  // Check if the user is authenticated by looking for a session cookie
  // This is a simple check - in a real app, you'd validate the session
  const isAuthenticated = request.cookies.has("session")

  // If the path requires authentication and the user is not authenticated
  if (isProtectedPath && !isAuthenticated) {
    // Redirect to the login page
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/chat", "/dashboard/:path*"],
}

