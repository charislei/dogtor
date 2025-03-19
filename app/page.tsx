import Hero from "@/components/hero"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import Cta from "@/components/cta"
import ChatbotSection from "@/components/chatbot-section"
import DebugPanel from "@/components/debug-panel"

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <Hero />
      <Features />
      <HowItWorks />
      <ChatbotSection />
      <Testimonials />
      <Cta />
      <DebugPanel />
    </main>
  )
}

