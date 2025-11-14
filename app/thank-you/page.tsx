import type { Metadata } from 'next'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Thank you for contacting JJ Safety LLC.',
}

export default function ThankYouPage() {
  return (
    <>
      <Navbar />
      <main>
        <Section spacing="xl" className="pt-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="text-green-600" size={48} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-navy-950 mb-6">
              Thank You!
            </h1>

            <p className="text-xl text-gray-700 mb-8">
              We've received your request and our team will be in touch within 24 hours.
            </p>

            <Card padding="lg" className="text-left mb-8">
              <h2 className="text-2xl font-bold text-navy-950 mb-4">What Happens Next?</h2>
              <ol className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 bg-accent-400 rounded-full text-navy-950 font-bold">
                    1
                  </span>
                  <div>
                    <h3 className="font-bold text-navy-950">We Review Your Information</h3>
                    <p className="text-gray-600">
                      Our team will carefully review your submission to understand your specific needs.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 bg-accent-400 rounded-full text-navy-950 font-bold">
                    2
                  </span>
                  <div>
                    <h3 className="font-bold text-navy-950">We'll Contact You</h3>
                    <p className="text-gray-600">
                      A compliance expert will reach out within 24 hours to schedule your consultation.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 bg-accent-400 rounded-full text-navy-950 font-bold">
                    3
                  </span>
                  <div>
                    <h3 className="font-bold text-navy-950">Get Your Custom Plan</h3>
                    <p className="text-gray-600">
                      During our call, we'll provide personalized recommendations and answer all your questions.
                    </p>
                  </div>
                </li>
              </ol>
            </Card>

            <div className="space-y-4">
              <p className="text-gray-600">While you wait, explore our resources:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/blog" variant="outline" size="md">
                  Read Our Blog
                  <ArrowRight className="ml-2" size={18} />
                </Button>
                <Button href="/services" variant="outline" size="md">
                  View All Services
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
