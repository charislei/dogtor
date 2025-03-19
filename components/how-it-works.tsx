import { MessageCircle, BrainCircuit, FileText } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <MessageCircle className="h-12 w-12 text-white" />,
      title: "Describe Your Pet's Symptoms",
      description: "Tell our AI chatbot what's happening with your dog in simple, everyday language.",
    },
    {
      icon: <BrainCircuit className="h-12 w-12 text-white" />,
      title: "AI Analysis",
      description: "Our advanced AI processes your information and compares it with thousands of veterinary cases.",
    },
    {
      icon: <FileText className="h-12 w-12 text-white" />,
      title: "Get Personalized Guidance",
      description: "Receive clear advice on what might be happening and what steps you should take next.",
    },
  ]

  return (
    <section className="py-12 md:py-16 relative overflow-hidden purple-gradient-bg">
      {/* AI circuit pattern overlay */}
      <div className="ai-circuit"></div>

      {/* Noise texture for depth */}
      <div className="noise"></div>

      <div className="container mx-auto relative px-4 md:px-6 z-10">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-sm font-medium text-white mb-2 border border-white/10 shadow-sm">
            <BrainCircuit className="h-4 w-4 text-purple-300" />
            <span>Simple Process</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-white">How DogTor Works</h2>
            <p className="max-w-[900px] text-white md:text-lg/relaxed lg:text-base/relaxed">
              Getting help for your pet is simple and straightforward
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:grid-cols-3 relative">
          {/* Connection lines for desktop with animation */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-300/70 to-violet-300/70 backdrop-blur-sm">
            <div
              className="absolute inset-0 bg-white/50 animate-shimmer"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
                backgroundSize: "200% 100%",
              }}
            ></div>
          </div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center space-y-3 relative">
              {/* Animated glowing circle */}
              <div className="relative h-20 w-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 glow animate-pulse-slow"></div>
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 animate-spin-slow opacity-70"></div>
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg">
                  {step.icon}
                </div>
              </div>

              <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl p-4 text-center shadow-lg border border-white/20">
                <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300">{step.title}</h3>
                <p className="text-center text-sm text-gray-700 dark:text-gray-300">{step.description}</p>
              </div>

              {/* Step number badge with glow */}
              <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-purple-700 font-bold shadow-md z-20 glow">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

