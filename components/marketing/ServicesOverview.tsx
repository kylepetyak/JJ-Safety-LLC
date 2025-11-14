import { Shield, FileText, Target } from 'lucide-react'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const services = [
  {
    icon: Shield,
    title: 'Platform Management',
    description: 'Weekly maintenance, questionnaires, and documentation for ISNetworld, Avetta, Veriforce, and all major platforms.',
    features: [
      'Weekly account monitoring',
      'Questionnaire completion',
      'Document uploads',
      'A+ rating maintenance',
    ],
  },
  {
    icon: FileText,
    title: 'Custom Safety Policies',
    description: 'OSHA-compliant safety manuals and policies tailored specifically to your operations and industry.',
    features: [
      'Industry-specific manuals',
      'OSHA compliance',
      'Custom policy creation',
      'Regular updates',
    ],
  },
  {
    icon: Target,
    title: 'Compliance Strategy',
    description: 'Expert guidance and strategic planning to maintain top ratings and win more contracts.',
    features: [
      'Compliance audits',
      'Strategic planning',
      '24-48 hour support',
      'Best practices guidance',
    ],
  },
]

export default function ServicesOverview() {
  return (
    <Section spacing="xl">
      <SectionHeading
        subtitle="Our Services"
        title="Comprehensive Safety Compliance Solutions"
        description="Everything you need to maintain perfect compliance and win more contracts"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Card key={service.title} hover padding="lg">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-100 rounded-lg mb-4">
                  <Icon className="text-navy-950" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-navy-950 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-2 text-sm text-gray-700">
                    <span className="text-accent-400 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button href="/services" variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </Card>
          )
        })}
      </div>

      <div className="text-center mt-12">
        <Button href="/services" variant="primary" size="lg">
          View All Services
        </Button>
      </div>
    </Section>
  )
}
