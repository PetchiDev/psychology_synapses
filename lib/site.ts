export const siteConfig = {
  name: 'Paper Skin & Synapses',
  shortName: 'Paper Skin',
  legalName: 'Paper Skin & Synapses',
  tagline: 'Every mind has more than one story',
  disciplines: ['Psychology', 'Clinical Practice', 'Consulting', 'Talks and Education', 'Research and Resources'],
  description:
    'Paper Skin & Synapses brings together individual counselling, clinical practice, organisational consulting, psychoeducation, talks, research collaborations and a library of psychology resources.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://paperskinandsynapses.com').replace(/\/$/, ''),
  locale: 'en_IN',
  email: 'megha@paperskinandsynapses.com',
  phone: '98400 52230',
  phoneHref: 'tel:+919840052230',
  mode: 'Online',
  modeNote: 'The practice is currently online.',
  hours: [{ days: 'Monday to Friday', opens: '09:00', closes: '17:00', schema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }],
  hoursLabel: 'Monday to Friday, 9:00 AM to 5:00 PM',
  foundingYear: 2018,
} as const

export type SiteConfig = typeof siteConfig

export const absoluteUrl = (path = '/') => `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`

export interface NavItem {
  label: string
  href: string
  shortLabel?: string
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Me', href: '/about' },
  { label: 'Work With Me', href: '/work-with-me' },
  { label: 'Library', href: '/library' },
  { label: 'FAQs', href: '/#faq' },
  { label: 'Contact Me', shortLabel: 'Contact', href: '/contact' },
]

export const legalNav: NavItem[] = [
  { label: 'Privacy policy', href: '/legal/privacy' },
  { label: 'Terms of use', href: '/legal/terms' },
  { label: 'Website disclaimer', href: '/legal/disclaimer' },
  { label: 'Professional disclosures', href: '/legal/disclosures' },
]

export const bookHref = '/contact#book'
