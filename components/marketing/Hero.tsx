import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { Shield, CheckCircle2 } from 'lucide-react'

const trustIndicators = [
  { label: 'Years in Business', value: '10+' },
  { label: 'Clients Served', value: '5000+' },
  { label: 'Platforms Managed', value: '6+' },
]

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

      <Container>
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-accent-400/10 border border-accent-400/20 rounded-full px-4 py-2 mb-6">
              <Shield className="text-accent-400" size={18} />
              <span className="text-accent-400 font-semibold text-sm">
                Trusted Safety Compliance Partner
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Safety Compliance Partner for{' '}
              <span className="text-accent-400">ISNetworld®, Avetta®,</span> and All Major Prequalification Platforms
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Stop losing contracts over compliance issues. We manage your prequalification platforms so you can focus on growing your business.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button href="/free-assessment" variant="secondary" size="lg">
                Get Free Assessment
              </Button>
              <Button href="/services" variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-navy-950">
                View Services
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {trustIndicators.map((indicator) => (
                <div key={indicator.label} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-accent-400 mb-1">
                    {indicator.value}
                  </div>
                  <div className="text-sm text-gray-400">{indicator.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80H1440V0C1440 0 1080 80 720 80C360 80 0 0 0 0V80Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
