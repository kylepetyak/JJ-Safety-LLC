import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Shield, CheckCircle } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import CTASection from '@/components/marketing/CTASection'
import { getServiceBySlug, getAllServices } from '@/lib/services'
import { getServiceSchema, getFAQSchema } from '@/lib/schema'

export async function generateStaticParams() {
  const services = getAllServices()
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const service = getServiceBySlug(params.slug)

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: service.title,
    description: service.description,
  }
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

  const serviceSchema = getServiceSchema({
    name: service.title,
    description: service.description,
    url: `https://www.jjsafety.com/services/${service.slug}`,
  })

  const faqSchema = getFAQSchema(service.faqs)

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </head>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Section spacing="lg" background="gradient" className="pt-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8">{service.description}</p>
            <Button href="/free-assessment" variant="secondary" size="lg">
              Get Free Assessment
            </Button>
          </div>
        </Section>

        {/* Overview */}
        <Section spacing="lg">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">{service.longDescription}</p>
          </div>
        </Section>

        {/* Features & Benefits */}
        <Section spacing="lg" background="gray">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-navy-950 mb-6">What's Included</h2>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-3">
                    <CheckCircle className="text-accent-400 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-navy-950 mb-6">Benefits</h2>
              <ul className="space-y-3">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start space-x-3">
                    <CheckCircle className="text-accent-400 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Process */}
        <Section spacing="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-navy-950 mb-12 text-center">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.process.map((step) => (
                <div key={step.step} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent-400 rounded-full text-navy-950 font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy-950 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* FAQs */}
        <Section spacing="lg" background="gray">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-navy-950 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {service.faqs.map((faq) => (
                <Card key={faq.question} padding="lg">
                  <h3 className="text-xl font-bold text-navy-950 mb-3">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* Related Services */}
        {service.relatedServices.length > 0 && (
          <Section spacing="lg">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-navy-950 mb-8 text-center">
                Related Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.relatedServices.map((slug) => {
                  const relatedService = getServiceBySlug(slug)
                  if (!relatedService) return null

                  return (
                    <Card key={slug} hover padding="md">
                      <h3 className="text-lg font-bold text-navy-950 mb-2">
                        {relatedService.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {relatedService.description}
                      </p>
                      <Button href={`/services/${slug}`} variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </Card>
                  )
                })}
              </div>
            </div>
          </Section>
        )}

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
