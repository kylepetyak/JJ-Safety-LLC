import { Award, Users, Clock, HeadphonesIcon } from 'lucide-react'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'

const advantages = [
  {
    icon: Award,
    title: 'Platform Specialists',
    description: 'We focus exclusively on contractor prequalification platforms. Not generalists - true experts in ISNetworld, Avetta, Veriforce, and more.',
  },
  {
    icon: Users,
    title: 'Proven Track Record',
    description: 'Over 500 companies trust us with their compliance. We\'ve helped businesses go from C ratings to A+ in as little as 60 days.',
  },
  {
    icon: Clock,
    title: 'Deep Platform Knowledge',
    description: 'Years of experience navigating platform changes, understanding requirements, and staying ahead of compliance updates.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Responsive Support',
    description: '24-48 hour turnaround on requests. You get a dedicated team that knows your account and responds when you need them.',
  },
]

export default function WhyJJSafety() {
  return (
    <Section spacing="xl" background="gray">
      <SectionHeading
        subtitle="Why Choose Us"
        title="Why Partner with JJ Safety?"
        description="We're not just a vendor - we're your compliance partner committed to your success"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {advantages.map((advantage) => {
          const Icon = advantage.icon
          return (
            <div key={advantage.title} className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-400 rounded-lg">
                  <Icon className="text-navy-950" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-950 mb-2">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
