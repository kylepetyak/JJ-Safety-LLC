import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, FileText, Target, Calendar, Grid, Edit, CheckCircle } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import CTASection from '@/components/marketing/CTASection'
import { getAllServices } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Comprehensive safety compliance and platform management services for contractors. ISNetworld, Avetta, Veriforce, and all major prequalification platforms.',
}

const iconMap: Record<string, any> = {
  shield: Shield,
  check: CheckCircle,
  award: Shield,
  'file-text': FileText,
  calendar: Calendar,
  grid: Grid,
  edit: Edit,
}

export default function ServicesPage() {
  const services = getAllServices()

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Section spacing="xl" background="gradient" className="pt-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Comprehensive Safety Compliance Services
            </h1>
            <p className="text-xl text-gray-300">
              From platform management to custom safety programs, we provide everything you need to maintain compliance and win contracts.
            </p>
          </div>
        </Section>

        {/* Services Grid */}
        <Section spacing="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Shield
              return (
                <Card key={service.slug} hover padding="lg">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-100 rounded-lg mb-4">
                      <Icon className="text-navy-950" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-navy-950 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start space-x-2 text-sm text-gray-700">
                        <span className="text-accent-400 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button href={`/services/${service.slug}`} variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </Card>
              )
            })}
          </div>
        </Section>

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
