export const siteConfig = {
  name: ' Paper ,Skin & Synapses',
  shortName: 'Paper Skin',
  legalName: ' Paper ,Skin & Synapses Hospital',
  tagline: 'A calm, human place for psychological care',
  description:
    ' Paper ,Skin & Synapses is a psychology and mental health hospital offering confidential counselling, psychological assessment, child and adolescent psychology, couples counselling, trauma support and wellness programmes with experienced specialists.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://paperskinpsychology.com').replace(/\/$/, ''),
  locale: 'en_IN',
  email: 'care@paperskinpsychology.com',
  phone: '+91 44 4000 1234',
  phoneHref: 'tel:+914440001234',
  address: {
    street: '14 Banyan Grove Road, Alwarpet',
    locality: 'Chennai',
    region: 'Tamil Nadu',
    postalCode: '600018',
    country: 'IN',
    countryName: 'India',
  },
  geo: { latitude: 13.0339, longitude: 80.2537 },
  hours: [
    { days: 'Monday – Friday', opens: '09:00', closes: '19:00', schema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { days: 'Saturday', opens: '09:00', closes: '14:00', schema: ['Saturday'] },
  ],
  hoursLabel: 'Mon–Fri 9:00–19:00 · Sat 9:00–14:00',
  foundingYear: 2012,
  languages: ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam'],
  crisis: {
    label: 'Tele-MANAS (24×7 national mental health helpline)',
    number: '14416',
    href: 'tel:14416',
    emergency: '112',
  },
} as const

export type SiteConfig = typeof siteConfig

export const absoluteUrl = (path = '/') => `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`

export const fullAddress = () => {
  const { street, locality, region, postalCode, countryName } = siteConfig.address
  return `${street}, ${locality}, ${region} ${postalCode}, ${countryName}`
}

export interface NavItem {
  label: string
  href: string
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Psychological Concerns', href: '/#concerns' },
  { label: 'Our Specialists', href: '/specialists' },
  { label: 'FAQs', href: '/#faq' },
  { label: 'Contact', href: '/#book' },
]
