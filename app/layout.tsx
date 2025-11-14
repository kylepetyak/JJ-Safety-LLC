import type { Metadata } from 'next'
import './globals.css'
import { getOrganizationSchema } from '@/lib/schema'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jjsafety.com'),
  title: {
    default: 'JJ Safety LLC | Expert Safety Compliance & Platform Management',
    template: '%s | JJ Safety LLC',
  },
  description:
    'Expert safety compliance management for ISNetworld®, Avetta®, Veriforce®, and all major contractor prequalification platforms. We manage your compliance so you can focus on your business.',
  keywords: [
    'ISNetworld management',
    'Avetta compliance',
    'Veriforce services',
    'safety compliance consulting',
    'contractor prequalification',
    'OSHA manual creation',
    'safety platform management',
    'ComplyWorks',
    'PEC Safety',
  ],
  authors: [{ name: 'JJ Safety LLC' }],
  creator: 'JJ Safety LLC',
  publisher: 'JJ Safety LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.jjsafety.com',
    siteName: 'JJ Safety LLC',
    title: 'JJ Safety LLC | Expert Safety Compliance & Platform Management',
    description:
      'Your safety compliance partner for ISNetworld®, Avetta®, Veriforce®, and all major prequalification platforms.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JJ Safety LLC - Safety Compliance Experts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JJ Safety LLC | Expert Safety Compliance & Platform Management',
    description:
      'Your safety compliance partner for ISNetworld®, Avetta®, Veriforce®, and all major prequalification platforms.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = getOrganizationSchema()

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
