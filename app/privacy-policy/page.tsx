import type { Metadata } from 'next'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'JJ Safety LLC Privacy Policy',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <Section spacing="lg" className="pt-32">
          <Container size="md">
            <h1 className="text-4xl font-bold text-navy-950 mb-8">Privacy Policy</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

              <h2>Introduction</h2>
              <p>
                JJ Safety LLC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>

              <h2>Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul>
                <li>Name and contact information</li>
                <li>Company information</li>
                <li>Email address and phone number</li>
                <li>Information about your compliance needs</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Respond to your inquiries and requests</li>
                <li>Send you updates about our services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul>
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
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
