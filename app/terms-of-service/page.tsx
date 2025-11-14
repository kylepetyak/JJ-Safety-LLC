import type { Metadata } from 'next'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'JJ Safety LLC Terms of Service',
}

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main>
        <Section spacing="lg" className="pt-32">
          <Container size="md">
            <h1 className="text-4xl font-bold text-navy-950 mb-8">Terms of Service</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

              <h2>Agreement to Terms</h2>
              <p>
                By accessing or using JJ Safety LLC's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>

              <h2>Use of Services</h2>
              <p>
                Our services are provided for business purposes to help contractors manage safety compliance and prequalification platforms. You agree to:
              </p>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account</li>
                <li>Use our services in compliance with all applicable laws</li>
              </ul>

              <h2>Intellectual Property</h2>
              <p>
                All content, features, and functionality of our services are owned by JJ Safety LLC and are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, JJ Safety LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
              </p>

              <h2>Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.
              </p>

              <h2>Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
                <br />
                Email: info@jjsafety.com
                <br />
                Phone: +1 (XXX) XXX-XXXX
              </p>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
