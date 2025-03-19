import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 purple-gradient-bg">
      {/* AI-themed grid overlay */}
      <div className="absolute inset-0 ai-grid"></div>

      {/* Noise texture for depth */}
      <div className="noise"></div>

      <div className="container mx-auto relative px-4 md:px-6 z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-sm font-medium text-white mb-4 border border-white/10 shadow-sm">
                <Sparkles className="h-4 w-4 text-purple-300" />
                <span>AI-Powered Pet Care</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                Meet <span className="font-extrabold text-white">DogTor</span>, Your AI Vet Assistant
              </h1>
              <p className="max-w-[600px] text-white md:text-xl">
                Get instant answers to your pet health questions. 24/7 AI-powered veterinary guidance for your furry
                friends.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 px-6 bg-white text-purple-700 hover:bg-purple-50 transition-all duration-300 shadow-lg shadow-purple-500/20 group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                size="lg"
                className="h-12 px-6 bg-purple-800 text-white hover:bg-purple-900 border-2 border-white/50 transition-all duration-300 shadow-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square">
              {/* Animated blob background */}
              <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-3xl animate-pulse-slow"></div>

              {/* Animated morphing shape */}
              <div className="absolute inset-4 bg-gradient-to-br from-purple-400/40 to-violet-500/40 animate-morph"></div>

              {/* Glowing circle */}
              <div className="absolute inset-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 glow"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                {/* Create a transparent background for the dog image */}
                <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                  {/* Apply a mask to remove the black background */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-violet-500/10"></div>

                  {/* Apply a mix-blend-mode to help with transparency */}
                  <Image
                    src="/3492eb33-4d6c-4bb6-bdee-40aa09f1c015.png?"
                    alt="DogTor AI Vet Assistant"
                    width={400}
                    height={400}
                    className="object-contain drop-shadow-xl animate-float z-10 mix-blend-multiply"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(124, 58, 237, 0.5))",
                      maskImage: "radial-gradient(circle, white 70%, transparent 75%)",
                      WebkitMaskImage: "radial-gradient(circle, white 70%, transparent 75%)",
                    }}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-purple-300/50 animate-pulse-slow"></div>
        <div className="absolute top-3/4 left-1/3 h-3 w-3 rounded-full bg-indigo-300/50 animate-float"></div>
        <div
          className="absolute top-1/2 right-1/4 h-2 w-2 rounded-full bg-violet-300/50 animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 h-3 w-3 rounded-full bg-purple-300/50 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}

