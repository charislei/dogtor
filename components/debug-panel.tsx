"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DebugPanel() {
  const [envStatus, setEnvStatus] = useState<{
    hasCohere: boolean
    hasModelId: boolean
    cohereKeyLength: number
    modelIdLength: number
  } | null>(null)

  const checkEnv = async () => {
    try {
      const response = await fetch("/api/env-check")
      const data = await response.json()
      setEnvStatus(data)
    } catch (error) {
      console.error("Error checking env:", error)
    }
  }

  useEffect(() => {
    checkEnv()
  }, [])

  return (
    <div className="border rounded-md p-4 mb-8">
      <h2 className="text-lg font-semibold mb-2">Debug Panel</h2>

      <div className="text-xs text-gray-500 mb-4">
        <p>Environment Variables:</p>
        {envStatus ? (
          <>
            <p>COHERE_API_KEY: {envStatus.hasCohere ? `✓ Set (${envStatus.cohereKeyLength} chars)` : "✗ Not Set"}</p>
            <p>MODEL_ID: {envStatus.hasModelId ? `✓ Set (${envStatus.modelIdLength} chars)` : "✗ Not Set"}</p>
          </>
        ) : (
          <p>Checking...</p>
        )}
        <Button variant="link" size="sm" className="p-0 h-auto" onClick={checkEnv}>
          Refresh
        </Button>
      </div>
    </div>
  )
}

