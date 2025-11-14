import { Star } from 'lucide-react'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'

const testimonials = [
  {
    name: 'Mike Johnson',
    company: 'ABC Construction',
    role: 'Safety Director',
    content: 'JJ Safety took our ISNetworld grade from a C to an A+ in just 60 days. Their expertise and responsiveness are unmatched.',
    rating: 5,
  },
  {
    name: 'Sarah Williams',
    company: 'XYZ Industrial Services',
    role: 'Operations Manager',
    content: 'Managing multiple platforms was overwhelming. JJ Safety handles everything seamlessly, allowing us to focus on our core business.',
    rating: 5,
  },
  {
    name: 'David Martinez',
    company: 'Premier Contractors LLC',
    role: 'CEO',
    content: 'The custom safety manual they created was exactly what we needed. Professional, compliant, and tailored to our operations.',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <Section spacing="xl">
      <SectionHeading
        subtitle="Client Success Stories"
        title="What Our Clients Say"
        description="Real results from companies just like yours"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} padding="lg">
            {/* Stars */}
            <div className="flex space-x-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="text-accent-400 fill-current" size={18} />
              ))}
            </div>

            {/* Content */}
            <p className="text-gray-700 mb-6 italic">
              "{testimonial.content}"
            </p>

            {/* Author */}
            <div className="border-t border-gray-200 pt-4">
              <div className="font-bold text-navy-950">{testimonial.name}</div>
              <div className="text-sm text-gray-600">{testimonial.role}</div>
              <div className="text-sm font-semibold text-accent-500">{testimonial.company}</div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
