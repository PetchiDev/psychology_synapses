import type { Doctor } from '@/data/doctors'
import type { Faq, Service } from '@/data/content'
import { absoluteUrl, siteConfig } from '@/lib/site'

type JsonLdNode = Record<string, unknown>

export const organizationId = absoluteUrl('/#organization')
export const websiteId = absoluteUrl('/#website')

const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: siteConfig.address.street,
  addressLocality: siteConfig.address.locality,
  addressRegion: siteConfig.address.region,
  postalCode: siteConfig.address.postalCode,
  addressCountry: siteConfig.address.country,
})

export const organizationSchema = (services: Service[], doctorSlugs: string[]): JsonLdNode => ({
  '@type': ['MedicalClinic', 'MedicalOrganization'],
  '@id': organizationId,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: absoluteUrl('/icon.svg'),
  image: absoluteUrl('/opengraph-image'),
  email: siteConfig.email,
  telephone: siteConfig.phone,
  foundingDate: String(siteConfig.foundingYear),
  medicalSpecialty: 'Psychiatric',
  isAcceptingNewPatients: true,
  availableLanguage: siteConfig.languages,
  address: postalAddress(),
  geo: { '@type': 'GeoCoordinates', latitude: siteConfig.geo.latitude, longitude: siteConfig.geo.longitude },
  openingHoursSpecification: siteConfig.hours.map((slot) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: slot.schema,
    opens: slot.opens,
    closes: slot.closes,
  })),
  areaServed: { '@type': 'City', name: siteConfig.address.locality },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Psychological services',
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'MedicalTherapy',
        name: service.title,
        description: service.summary,
      },
    })),
  },
  employee: doctorSlugs.map((slug) => ({ '@id': absoluteUrl(`/specialists/${slug}#person`) })),
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

export const personSchema = (doctor: Doctor): JsonLdNode => ({
  '@type': 'Person',
  '@id': absoluteUrl(`/specialists/${doctor.slug}#person`),
  name: doctor.name,
  jobTitle: doctor.title,
  description: doctor.intro,
  image: absoluteUrl(doctor.image.src),
  url: absoluteUrl(`/specialists/${doctor.slug}`),
  worksFor: { '@id': organizationId },
  knowsLanguage: doctor.languages,
  knowsAbout: [...doctor.specializations, ...doctor.expertise],
  alumniOf: doctor.education.map((entry) => ({ '@type': 'EducationalOrganization', name: entry.institution })),
  hasCredential: doctor.qualifications.map((name) => ({ '@type': 'EducationalOccupationalCredential', name })),
})

export const faqSchema = (items: Faq[]): JsonLdNode => ({
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
})

export const breadcrumbSchema = (items: { name: string; path: string }[]): JsonLdNode => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

export const graph = (...nodes: JsonLdNode[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
})
