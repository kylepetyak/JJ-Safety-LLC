import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for safety compliance and platform management services.',
}

const packages = [
  {
    name: 'Platform Management',
    description: 'Perfect for companies needing ongoing platform maintenance',
    features: [
      'Weekly account monitoring',
      'Questionnaire completion',
      'Document management',
      'Expiration tracking',
      'Email support',
      'Monthly reporting',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Full Service',
    description: 'Comprehensive management for multiple platforms',
    popular: true,
    features: [
      'Everything in Platform Management',
      'Multiple platform support',
      'Priority support (24-48 hour response)',
      'Dedicated account manager',
      'Custom safety policy creation',
      'Quarterly strategy reviews',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    features: [
      'Everything in Full Service',
      'Unlimited platforms',
      'On-site support available',
      'Custom reporting',
      'Training programs',
      'API integrations',
    ],
    cta: 'Contact Us',
  },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <Section spacing="lg" background="gradient" className="pt-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-300">
              Choose the package that fits your needs. All plans include expert support and proven results.
            </p>
          </div>
        </Section>

        {/* Pricing Cards */}
        <Section spacing="xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Card
                key={pkg.name}
                padding="lg"
                className={pkg.popular ? 'border-2 border-accent-400 relative' : ''}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-accent-400 text-navy-950 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-navy-950 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                <div className="mb-6">
                  <p className="text-lg font-semibold text-gray-700">Custom pricing based on:</p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Number of platforms</li>
                    <li>• Company size</li>
                    <li>• Service level needed</li>
                  </ul>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-2">
                      <Check className="text-accent-400 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href="/free-assessment"
                  variant={pkg.popular ? 'primary' : 'outline'}
                  size="md"
                  className="w-full"
                >
                  {pkg.cta}
                </Button>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-16 text-center">
            <Card padding="lg" className="bg-navy-50">
              <h3 className="text-xl font-bold text-navy-950 mb-3">
                Not sure which package is right for you?
              </h3>
              <p className="text-gray-700 mb-6">
                Schedule a free consultation and we'll recommend the best solution for your specific needs and budget.
              </p>
              <Button href="/free-assessment" variant="primary" size="lg">
                Get Free Assessment
              </Button>
            </Card>
          </div>
        </Section>

        {/* FAQ */}
        <Section spacing="lg" background="gray">
          <SectionHeading title="Pricing FAQs" />
          <div className="max-w-3xl mx-auto space-y-6">
            <Card padding="lg">
              <h3 className="text-lg font-bold text-navy-950 mb-2">
                How is pricing determined?
              </h3>
              <p className="text-gray-700">
                Pricing is customized based on the number of platforms you need managed, your company size, and the level of service required. We provide transparent quotes with no hidden fees.
              </p>
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-bold text-navy-950 mb-2">
                Are there any setup fees?
              </h3>
              <p className="text-gray-700">
                Setup fees vary depending on the current state of your accounts. We'll provide a complete quote during your free assessment.
              </p>
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-bold text-navy-950 mb-2">
                What's included in the monthly fee?
              </h3>
              <p className="text-gray-700">
                All packages include regular account monitoring, questionnaire completion, document management, and support. Higher tiers include additional platforms and premium support.
              </p>
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-bold text-navy-950 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-700">
                Yes, we offer flexible month-to-month contracts with no long-term commitments required (though annual plans receive discounts).
              </p>
            </Card>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
