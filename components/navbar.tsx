"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PawPrint, Menu, X, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isOnChatPage = pathname === "/chat"

  // Check if user is logged in by looking for a session cookie
  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("session="))
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <PawPrint className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold">DogTor</span>
        </Link>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-purple-600 transition-colors">
            Home
          </Link>
          {isLoggedIn && !isOnChatPage && (
            <Link href="/chat" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Chat
            </Link>
          )}
          {!isLoggedIn && !isOnChatPage ? (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-purple-600 transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            isLoggedIn &&
            !isOnChatPage && (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:text-purple-600 transition-colors">
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center gap-1"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )
          )}
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg md:hidden">
            <nav className="flex flex-col p-4 space-y-4">
              <Link
                href="/"
                className="text-sm font-medium hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {isLoggedIn && !isOnChatPage && (
                <Link
                  href="/chat"
                  className="text-sm font-medium hover:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Chat
                </Link>
              )}
              {!isLoggedIn && !isOnChatPage ? (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium hover:text-purple-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                isLoggedIn &&
                !isOnChatPage && (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium hover:text-purple-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center justify-center gap-1"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

