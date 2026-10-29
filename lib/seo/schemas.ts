import type { Faq } from '@/data/content'
import { psychologist, workAreas } from '@/data/content'
import { absoluteUrl, siteConfig } from '@/lib/site'

type JsonLdNode = Record<string, unknown>

export const organizationId = absoluteUrl('/#organization')
export const websiteId = absoluteUrl('/#website')
export const personId = absoluteUrl('/about/#person')

export const personSchema = (): JsonLdNode => ({
  '@type': 'Person',
  '@id': personId,
  name: siteConfig.psychologist.name,
  jobTitle: siteConfig.psychologist.role,
  url: absoluteUrl('/about/'),
  image: absoluteUrl(psychologist.portrait.src),
  email: siteConfig.email,
  worksFor: { '@id': organizationId },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Leeds' },
  hasCredential: [
    ...psychologist.degrees.map((degree) => ({ '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: degree.award })),
    ...psychologist.registrations.map((item) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: `${item.credential} (${item.region})`,
    })),
  ],
  knowsAbout: ['Counselling psychology', 'Clinical psychology', 'Organisational psychology', 'Psychoeducation', ...psychologist.training],
})

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
  founder: { '@id': personId },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
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
