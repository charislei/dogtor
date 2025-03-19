import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { QuoteIcon, Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      avatar: "SJ",
      role: "Dog Owner",
      content:
        "DogTor helped me identify my puppy's skin condition at 2 AM when I was really worried. The advice was spot-on and saved us an emergency vet visit!",
    },
    {
      name: "Michael Chen",
      avatar: "MC",
      role: "Pet Parent",
      content:
        "I was skeptical about AI vet advice, but DogTor accurately suggested my dog might have an ear infection. The vet confirmed it the next day. Impressive!",
    },
    {
      name: "Emma Rodriguez",
      avatar: "ER",
      role: "Dog Trainer",
      content:
        "As a professional dog trainer, I recommend DogTor to all my clients. It's an invaluable resource for quick health checks and peace of mind.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle AI dots pattern */}
      <div className="absolute inset-0 ai-dots"></div>

      <div className="container mx-auto relative px-4 md:px-6 z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
            <Star className="h-4 w-4" />
            Testimonials
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
              What Pet Parents Say
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Don't just take our word for it - hear from dog owners who use DogTor
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="glass-card border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute -right-4 -top-4 text-purple-200 dark:text-purple-900 opacity-50 transform scale-150">
                <QuoteIcon size={64} />
              </div>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="border-2 border-purple-500 h-12 w-12 ring-2 ring-purple-300/50 ring-offset-2 ring-offset-background">
                    <AvatarImage src="" alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400 relative z-10">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

