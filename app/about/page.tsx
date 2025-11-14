import type { Metadata } from 'next'
import { Award, Users, Target, Shield } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'
import CTASection from '@/components/marketing/CTASection'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about JJ Safety LLC and our mission to help contractors achieve compliance excellence.',
}

const values = [
  {
    icon: Shield,
    title: 'Expertise',
    description: 'Specialized knowledge in contractor prequalification platforms and safety compliance.',
  },
  {
    icon: Users,
    title: 'Partnership',
    description: 'We work alongside you as a trusted partner, not just a vendor.',
  },
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'Focused on achieving A+ ratings and helping you win more contracts.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'Professional, compliant documentation that meets the highest standards.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <Section spacing="lg" background="gradient" className="pt-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Partner in Safety Compliance Excellence
            </h1>
            <p className="text-xl text-gray-300">
              Helping contractors achieve and maintain compliance since 2014
            </p>
          </div>
        </Section>

        {/* Mission */}
        <Section spacing="lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-navy-950 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At JJ Safety LLC, we're dedicated to making safety compliance simple and stress-free for contractors. We believe that managing prequalification platforms shouldn't be a barrier to winning contracts. Our team of experts handles the complexity of compliance so you can focus on what you do best - growing your business.
            </p>
          </div>
        </Section>

        {/* Values */}
        <Section spacing="lg" background="gray">
          <SectionHeading
            title="Our Values"
            description="The principles that guide everything we do"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <Card key={value.title} padding="lg" className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-100 rounded-lg mb-4">
                    <Icon className="text-navy-950" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-navy-950 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </Section>

        {/* Why Choose Us */}
        <Section spacing="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-navy-950 mb-8 text-center">
              Why Contractors Choose JJ Safety
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card padding="lg">
                <h3 className="text-xl font-bold text-navy-950 mb-3">Deep Platform Knowledge</h3>
                <p className="text-gray-700">
                  We're not generalists. We specialize exclusively in contractor prequalification platforms, giving us unmatched expertise in ISNetworld, Avetta, Veriforce, and more.
                </p>
              </Card>

              <Card padding="lg">
                <h3 className="text-xl font-bold text-navy-950 mb-3">Proven Track Record</h3>
                <p className="text-gray-700">
                  With over 500 clients served and countless success stories, we've helped companies of all sizes achieve A+ ratings and maintain compliance.
                </p>
              </Card>

              <Card padding="lg">
                <h3 className="text-xl font-bold text-navy-950 mb-3">Responsive Support</h3>
                <p className="text-gray-700">
                  When you contact us, you get real experts who understand your account. We provide 24-48 hour turnaround times on all requests.
                </p>
              </Card>

              <Card padding="lg">
                <h3 className="text-xl font-bold text-navy-950 mb-3">Peace of Mind</h3>
                <p className="text-gray-700">
                  Never miss a deadline, never lose a qualification, never wonder about your compliance status. We've got you covered.
                </p>
              </Card>
            </div>
          </div>
        </Section>

        {/* CTA */}
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
