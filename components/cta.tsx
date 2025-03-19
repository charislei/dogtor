import { Button } from "@/components/ui/button"
import { PawPrint, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Cta() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden purple-gradient-bg">
      {/* AI circuit pattern overlay */}
      <div className="ai-circuit"></div>

      {/* Noise texture for depth */}
      <div className="noise"></div>

      <div className="container mx-auto relative px-4 md:px-6 z-10">
        <div className="mx-auto max-w-4xl bg-white/90 dark:bg-gray-900/90 rounded-2xl p-8 md:p-12 shadow-xl border border-white/20">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/70 p-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center animate-pulse-slow">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800 dark:text-purple-300">
                Ready to Try DogTor?
              </h2>
              <p className="max-w-[900px] text-gray-700 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get instant answers to your pet health questions and join thousands of happy pet parents
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 px-8 bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 transition-all duration-300 shadow-lg shadow-purple-500/20 group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                size="lg"
                className="h-12 px-8 bg-white text-purple-700 hover:bg-purple-50 border border-purple-300 transition-all duration-300 shadow-md"
              >
                Learn More
              </Button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 pt-4">
              No credit card required. Start with our free plan today.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

