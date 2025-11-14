import type { Metadata } from 'next'
import { CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import AssessmentForm from '@/components/forms/AssessmentForm'

export const metadata: Metadata = {
  title: 'Free Compliance Assessment',
  description: 'Get a free assessment of your safety compliance status. No obligation consultation with expert recommendations.',
}

const benefits = [
  'Comprehensive compliance review',
  'Platform-specific recommendations',
  'Grade improvement strategy',
  'Custom action plan',
  'Expert consultation',
  'No obligation',
]

export default function FreeAssessmentPage() {
  return (
    <>
      <Navbar />
      <main>
        <Section spacing="lg" className="pt-32">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Benefits */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-navy-950 mb-6">
                  Get Your Free Compliance Assessment
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Discover how to improve your platform ratings, streamline compliance, and win more contracts. Our experts will provide personalized recommendations at no cost.
                </p>

                <Card padding="lg" className="mb-8">
                  <h2 className="text-2xl font-bold text-navy-950 mb-4">What You'll Get:</h2>
                  <ul className="space-y-3">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start space-x-3">
                        <CheckCircle2 className="text-accent-400 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <div className="bg-navy-50 rounded-xl p-6 border border-navy-100">
                  <h3 className="font-bold text-navy-950 mb-2">What Happens Next?</h3>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li>1. Submit the form (takes 2 minutes)</li>
                    <li>2. We'll review your current compliance status</li>
                    <li>3. Schedule a 30-minute consultation</li>
                    <li>4. Receive your custom action plan</li>
                  </ol>
                </div>
              </div>

              {/* Right Column - Form */}
              <div>
                <Card padding="lg">
                  <AssessmentForm />
                </Card>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
