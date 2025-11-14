import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { CheckCircle2 } from 'lucide-react'

const benefits = [
  'Free compliance assessment',
  'No obligation consultation',
  'Expert recommendations',
  'Custom action plan',
]

export default function CTASection() {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
      <Container size="md">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Master Your Compliance?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get a free assessment of your current compliance status and discover how we can help you achieve and maintain an A+ rating.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center space-x-2 text-left">
                <CheckCircle2 className="text-accent-400 flex-shrink-0" size={20} />
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/free-assessment" variant="secondary" size="lg">
              Get Free Assessment
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white hover:text-navy-950"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
