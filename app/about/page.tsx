import type { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp, Shield, Award, CheckCircle2, Users, Heart, ArrowRight, Facebook, Twitter, Youtube, Linkedin, Instagram } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import AnimatedStat from '@/components/ui/AnimatedStat'

export const metadata: Metadata = {
  title: 'About JJ Safety | Your Trusted Safety Compliance Partner Since 2015',
  description: 'Founded in 2015, JJ Safety provides reliable, consistent, and trustworthy safety compliance management for ISNetworld, Avetta, Veriforce, and more.',
  openGraph: {
    title: 'About JJ Safety | Your Trusted Safety Compliance Partner',
    description: 'Founded in 2015 by industry veterans who recognized an unmet need in contractor compliance management.',
    type: 'website',
  },
}

const stats = [
  { number: 5000, label: 'Clients', suffix: '+' },
  { number: 25, label: 'Employees', suffix: '+' },
  { number: 10, label: 'Years In Business', suffix: '+' },
  { number: 1000, label: 'Safety Programs', suffix: '+' },
]

const values = [
  {
    icon: TrendingUp,
    title: 'Proactive',
    description: 'We believe in taking a proactive approach to everything. No client should have to ever call us to tell us something is wrong. We take initiative to be proactive.',
  },
  {
    icon: Shield,
    title: 'Transparency',
    description: 'We exist to help contractors and suppliers. To do that we remain transparent about how we work and we communicate with our clients obsessively.',
  },
  {
    icon: Award,
    title: 'Top Rated',
    description: 'If we ever were to meet a client in person we want to be able to shake their hand and look in their eyes. We work to build lasting relationships with our employees and clients.',
  },
  {
    icon: CheckCircle2,
    title: 'Integrity',
    description: 'At our core we believe in doing what is right by treating our employees and clients with integrity.',
  },
  {
    icon: Users,
    title: 'Quality',
    description: 'We strive to put out the best content and to provide quality service that is miles ahead of our competition to each one of our clients.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Safety isn\'t the most \'exciting\' industry, but our team is passionate about what we do to help companies establish, train, and implement safety into their businesses.',
  },
]

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/Jjsafetyllc/' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/jjsafetyllc' },
  { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@jjsafetyllc1' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/jj-safety/' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/jjsafetyllc/' },
]

export default function AboutPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'JJ Safety LLC',
      foundingDate: '2015',
      founders: [{
        '@type': 'Person',
        name: 'John Shelman',
        jobTitle: 'Co-Owner',
      }],
      description: 'JJ Safety provides expert safety compliance management services for contractors using ISNetworld, Avetta, Veriforce, and other prequalification platforms.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '2918 S Alma School Rd',
        addressLocality: 'Mesa',
        addressRegion: 'AZ',
        postalCode: '85210',
        addressCountry: 'US',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-833-277-7022',
        email: 'sales@jjsafetyllc.com',
      },
      sameAs: [
        'https://www.facebook.com/Jjsafetyllc/',
        'https://twitter.com/jjsafetyllc',
        'https://www.youtube.com/@jjsafetyllc1',
        'https://www.linkedin.com/company/jj-safety/',
        'https://www.instagram.com/jjsafetyllc/',
        'https://www.tiktok.com/@jjsafetyllc',
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Navbar />
      <main className="bg-white">
        {/* Hero Section with Founder Quote */}
        <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Founder Initials Badge */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-600 rounded-full text-white text-2xl font-bold mb-8">
                JS
              </div>

              {/* Quote */}
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light italic mb-8 leading-relaxed">
                "It's important for us to build strong relationships with both our clients and employees to provide the best service we can."
              </blockquote>

              {/* Attribution */}
              <div className="text-lg">
                <div className="font-bold text-accent-400">John Shelman</div>
                <div className="text-gray-300">Co-Owner, JJ Safety</div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Is JJ Safety Story */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Story */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
                  Who Is JJ Safety?
                </h1>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                  <p>
                    JJ Safety was started back in 2015. Our founders, who we refer to as the "J's", had both previously worked with a company that provided them with experience in the industry that we now service. In their time before JJ Safety began, they recognized a need that wasn't being met.
                  </p>
                  <p>
                    They envisioned building a company that was <strong>Reliable, Consistent, and Trustworthy</strong> in their business practices of managing compliance accounts for contractors. Thus, JJ Safety was created with a primary goal of providing high level customer service and care for businesses with requirements for ISNetworld®, Avetta®, Veriforce®, Compliance Pro®, and many others.
                  </p>
                  <p>
                    We have positioned ourselves to be above the rest with our steadfast commitment to our clients and a result driven approach to achieve complete compliance for your business. We also assist in helping our customers understand what is being asked of them and how to implement any new and required processes.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link
                    href="/free-assessment"
                    className="inline-flex items-center justify-center px-8 py-4 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-navy-900 font-semibold rounded-lg border-2 border-navy-900 hover:bg-navy-900 hover:text-white transition-colors"
                  >
                    Our Services
                  </Link>
                </div>
              </div>

              {/* Right Column - Image Placeholder */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-navy-100 to-navy-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="text-center p-8">
                    <Users className="text-navy-400 mx-auto mb-4" size={80} />
                    <p className="text-navy-700 text-lg font-semibold">Team Photo</p>
                    <p className="text-navy-600 text-sm">Coming Soon</p>
                  </div>
                  {/* Gold Badge */}
                  <div className="absolute top-4 right-4 bg-accent-600 text-white p-3 rounded-full shadow-lg">
                    <Award size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Counter */}
        <section className="py-20 bg-navy-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">
              Trusted by Contractors Nationwide
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <AnimatedStat
                  key={index}
                  end={stat.number}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-navy-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These principles guide everything we do and define who we are as a company
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-accent-400 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-100 rounded-lg mb-6">
                      <Icon className="text-accent-600" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Client Testimonials Callout */}
        <section className="py-20 bg-gradient-to-br from-accent-50 to-accent-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-navy-900 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Don't just take our word for it. Hear from the contractors and suppliers we've helped achieve compliance excellence.
            </p>
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
            >
              Read Client Reviews
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </section>

        {/* Team Link Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-navy-900 mb-6">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Behind every successful compliance account is a dedicated team of safety professionals who care about your success.
            </p>
            <Link
              href="/meet-the-team"
              className="inline-flex items-center justify-center px-8 py-4 bg-navy-900 text-white font-semibold rounded-lg hover:bg-navy-800 transition-colors"
            >
              Meet the Team
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </section>

        {/* Final CTA with Social Media */}
        <section className="py-20 bg-navy-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience the JJ Safety Difference?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join 500+ contractors who trust us with their safety compliance. Get started with a free assessment today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/free-assessment"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
              >
                Get Free Assessment
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-navy-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
            </div>

            {/* Social Media Links */}
            <div className="border-t border-gray-700 pt-10">
              <p className="text-lg font-semibold mb-6">Find us on social media!</p>
              <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-12 h-12 bg-navy-800 rounded-full hover:bg-accent-600 transition-colors group"
                      aria-label={social.name}
                    >
                      <Icon className="text-white group-hover:scale-110 transition-transform" size={20} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
