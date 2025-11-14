import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with JJ Safety LLC. We are here to help with all your safety compliance needs.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <Section spacing="lg" className="pt-32">
          <Container size="lg">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-navy-950 mb-6">
                Get In Touch
              </h1>
              <p className="text-xl text-gray-600">
                Have questions about our services? Ready to get started? We're here to help.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <Card padding="lg" className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-400 rounded-lg mb-4 mx-auto">
                  <Mail className="text-navy-950" size={24} />
                </div>
                <h3 className="font-bold text-navy-950 mb-2">Email Us</h3>
                <a href="mailto:info@jjsafety.com" className="text-navy-600 hover:underline">
                  info@jjsafety.com
                </a>
              </Card>

              <Card padding="lg" className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-400 rounded-lg mb-4 mx-auto">
                  <Phone className="text-navy-950" size={24} />
                </div>
                <h3 className="font-bold text-navy-950 mb-2">Call Us</h3>
                <a href="tel:+1-XXX-XXX-XXXX" className="text-navy-600 hover:underline">
                  +1 (XXX) XXX-XXXX
                </a>
              </Card>

              <Card padding="lg" className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-400 rounded-lg mb-4 mx-auto">
                  <MapPin className="text-navy-950" size={24} />
                </div>
                <h3 className="font-bold text-navy-950 mb-2">Location</h3>
                <p className="text-gray-600">Serving clients nationwide</p>
              </Card>
            </div>

            <Card padding="lg" className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-navy-950 mb-6 text-center">
                Send Us a Message
              </h2>
              <p className="text-center text-gray-600 mb-8">
                For the fastest response, we recommend using our{' '}
                <a href="/free-assessment" className="text-navy-600 font-semibold hover:underline">
                  Free Assessment Form
                </a>
                . You can also reach us at{' '}
                <a href="mailto:info@jjsafety.com" className="text-navy-600 font-semibold hover:underline">
                  info@jjsafety.com
                </a>{' '}
                or call us directly.
              </p>
              <div className="text-center">
                <a
                  href="/free-assessment"
                  className="inline-flex items-center justify-center px-8 py-4 bg-navy-950 text-white font-semibold rounded-lg hover:bg-navy-800 transition-colors"
                >
                  Get Free Assessment
                </a>
              </div>
            </Card>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
