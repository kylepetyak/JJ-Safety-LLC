'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'Resources', href: '/resources' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const isHomepage = pathname === '/'
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Use transparent navbar only on homepage, otherwise use solid background
  const useTransparent = isHomepage && !isScrolled

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        useTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-md'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className={cn(
              "text-2xl font-bold transition-colors",
              useTransparent ? "text-white" : "text-navy-950"
            )}>
              JJ Safety <span className="text-accent-400">LLC</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "font-medium transition-colors",
                  useTransparent
                    ? "text-white hover:text-accent-400"
                    : "text-gray-700 hover:text-navy-950"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              href="/free-assessment"
              variant={useTransparent ? "secondary" : "primary"}
              size="md"
            >
              Free Assessment
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "lg:hidden p-2 transition-colors",
              useTransparent
                ? "text-white hover:text-accent-400"
                : "text-gray-700 hover:text-navy-950"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={cn(
            "lg:hidden py-4 border-t",
            useTransparent ? "border-white/20 bg-navy-900/95 backdrop-blur-md" : "border-gray-200 bg-white"
          )}>
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "font-medium transition-colors py-2",
                    useTransparent
                      ? "text-white hover:text-accent-400"
                      : "text-gray-700 hover:text-navy-950"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4">
                <Button
                  href="/free-assessment"
                  variant={useTransparent ? "secondary" : "primary"}
                  size="md"
                  className="w-full"
                >
                  Free Assessment
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
