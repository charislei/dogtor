import { Brain, Clock, Shield, MessageSquare, Database, Zap } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnosis",
      description: "Advanced algorithms trained on veterinary data to provide accurate health insights.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Get answers to your pet health questions anytime, day or night.",
    },
    {
      icon: Shield,
      title: "Trusted Information",
      description: "All responses backed by veterinary science and reviewed by professionals.",
    },
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description: "Chat naturally about your pet's symptoms and receive clear guidance.",
    },
    {
      icon: Database,
      title: "Comprehensive Knowledge",
      description: "Extensive database covering thousands of pet health conditions and treatments.",
    },
    {
      icon: Zap,
      title: "Instant Responses",
      description: "No waiting for appointments - get immediate answers to your concerns.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle AI dots pattern */}
      <div className="absolute inset-0 ai-dots"></div>

      <div className="container mx-auto relative px-4 md:px-6 z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
            <Zap className="h-4 w-4" />
            Features
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
              Why Choose DogTor?
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our AI-powered platform offers comprehensive pet health guidance with these key features
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="group relative">
                {/* Animated gradient border */}
                <div className="gradient-border absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="glass-card relative h-full flex flex-col items-center space-y-4 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                  {/* Animated background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Icon container with explicit hover styles */}
                  <div className="relative z-10 rounded-full p-3 bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-600 transition-all duration-300">
                    <Icon className="h-10 w-10 text-purple-500 group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="relative z-10 text-xl font-bold">{feature.title}</h3>
                  <p className="relative z-10 text-center text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

