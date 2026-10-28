import type { Faq } from '@/data/content'
import { workAreas } from '@/data/content'
import { absoluteUrl, siteConfig } from '@/lib/site'

type JsonLdNode = Record<string, unknown>

export const organizationId = absoluteUrl('/#organization')
export const websiteId = absoluteUrl('/#website')

export const organizationSchema = (): JsonLdNode => ({
  '@type': ['Organization', 'ProfessionalService'],
  '@id': organizationId,
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: absoluteUrl('/images/logo/logo.png'),
  image: absoluteUrl('/opengraph-image'),
  email: siteConfig.email,
  telephone: siteConfig.phoneHref.replace('tel:', ''),
  foundingDate: String(siteConfig.foundingYear),
  openingHoursSpecification: siteConfig.hours.map((slot) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: slot.schema,
    opens: slot.opens,
    closes: slot.closes,
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Ways to work with me',
    itemListElement: workAreas.map((area) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: area.title, description: area.summary },
    })),
  },
})

export const websiteSchema = (): JsonLdNode => ({
  '@type': 'WebSite',
  '@id': websiteId,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  inLanguage: 'en-IN',
  publisher: { '@id': organizationId },
})

export const faqSchema = (items: Faq[]): JsonLdNode => ({
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer.join(' ') },
  })),
})

export const graph = (...nodes: JsonLdNode[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
})
