import Link from 'next/link'
import { Mail, Phone, Linkedin } from 'lucide-react'
import Container from '@/components/ui/Container'

const footerLinks = {
  services: [
    { name: 'ISNetworld Management', href: '/services/isnetworld-management' },
    { name: 'Avetta Management', href: '/services/avetta-management' },
    { name: 'Veriforce Management', href: '/services/veriforce-management' },
    { name: 'Safety Manuals', href: '/services/safety-manuals' },
    { name: 'Weekly Management', href: '/services/weekly-management' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
    { name: 'Free Assessment', href: '/free-assessment' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Resources Hub', href: '/resources' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Prequalification 101', href: '/guides/prequalification-101' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 text-white">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <div className="text-2xl font-bold">
                  JJ Safety <span className="text-accent-400">LLC</span>
                </div>
              </Link>
              <p className="text-gray-400 mb-6">
                Your trusted partner for safety compliance and contractor prequalification platform management.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-accent-400" />
                  <a href="mailto:info@jjsafety.com" className="text-gray-400 hover:text-white transition-colors">
                    info@jjsafety.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-accent-400" />
                  <a href="tel:+1-XXX-XXX-XXXX" className="text-gray-400 hover:text-white transition-colors">
                    +1 (XXX) XXX-XXXX
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin size={18} className="text-accent-400" />
                  <a
                    href="https://www.linkedin.com/company/jj-safety"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Follow us on LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © {currentYear} JJ Safety LLC. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
