import type { Organization, WithContext, Article, Service, FAQPage, Review, AggregateRating } from 'schema-dts'

export function getOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'JJ Safety LLC',
    description: 'Expert safety compliance management for ISNetworld, Avetta, Veriforce and other contractor prequalification platforms',
    url: 'https://www.jjsafety.com',
    logo: 'https://www.jjsafety.com/logo.png',
    image: 'https://www.jjsafety.com/og-image.png',
    telephone: '+1-XXX-XXX-XXXX',
    email: 'info@jjsafety.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'XXXX Street',
      addressLocality: 'City',
      addressRegion: 'State',
      postalCode: 'XXXXX',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX',
      contactType: 'customer service',
      email: 'info@jjsafety.com',
      availableLanguage: ['en'],
    },
    sameAs: [
      'https://www.linkedin.com/company/jj-safety',
      // Add other social media profiles
    ],
  }
}

export function getServiceSchema(service: {
  name: string
  description: string
  url: string
  price?: string
  areaServed?: string
}): WithContext<Service> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'JJ Safety LLC',
      url: 'https://www.jjsafety.com',
    },
    areaServed: service.areaServed || 'United States',
    url: service.url,
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
  }
}

export function getArticleSchema(article: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image?: string
  url: string
}): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'JJ Safety LLC',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.jjsafety.com/logo.png',
      },
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    image: article.image || 'https://www.jjsafety.com/og-image.png',
    url: article.url,
  }
}

export function getFAQSchema(faqs: Array<{ question: string; answer: string }>): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function getAggregateRatingSchema(
  rating: number,
  reviewCount: number
): WithContext<AggregateRating> {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: rating.toString(),
    reviewCount: reviewCount,
    bestRating: '5',
    worstRating: '1',
  }
}
