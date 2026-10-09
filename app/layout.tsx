import type { Metadata, Viewport } from 'next'
import { Cinzel, EB_Garamond, IM_Fell_English } from 'next/font/google'
import { doctors } from '@/data/doctors'
import { services } from '@/data/content'
import { siteConfig } from '@/lib/site'
import { JsonLd } from '@/lib/seo/json-ld'
import { graph, organizationSchema, websiteSchema } from '@/lib/seo/schemas'
import { ButtonSparkles } from '@/components/animations/button-sparkles'
import { CursorSparkles } from '@/components/animations/cursor-sparkles'
import { CalmCorner } from '@/components/layout/calm-corner'
import { FairyParticles } from '@/components/animations/fairy-particles'
import { ReadingProgress } from '@/components/animations/reading-progress'
import { SmoothScroll } from '@/components/animations/smooth-scroll'
import { HashLinkHandler } from '@/components/layout/hash-link-handler'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { TooltipProvider } from '@/components/ui/tooltip'
import 'lenis/dist/lenis.css'
import './globals.css'

const display = IM_Fell_English({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const body = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
})

const caps = Cinzel({
  subsets: ['latin'],
  variable: '--font-caps',
  display: 'swap',
})

const defaultTitle = `${siteConfig.name} — Psychology & Mental Health Hospital in ${siteConfig.address.locality}`

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: defaultTitle, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: 'health',
  keywords: [
    'psychologist in Chennai',
    'psychology hospital',
    'mental health hospital',
    'counselling',
    'clinical psychologist',
    'child psychologist',
    'couples counselling',
    'anxiety therapy',
    'depression counselling',
    'trauma therapy',
  ],
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { telephone: true, email: true, address: true },
}

export const viewport: Viewport = {
  themeColor: '#f7eedc',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} ${caps.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-shadow px-5 py-3 text-sm font-semibold text-paper transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <div aria-hidden="true" className="scroll-tint pointer-events-none fixed inset-0 -z-10" />
        <SmoothScroll />
        <ReadingProgress />
        <FairyParticles />
        <TooltipProvider delayDuration={200}>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="relative flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </TooltipProvider>
        <HashLinkHandler />
        <ButtonSparkles />
        <CursorSparkles />
        <CalmCorner />
        <JsonLd
          data={graph(
            organizationSchema(
              services,
              doctors.map((doctor) => doctor.slug),
            ),
            websiteSchema(),
          )}
        />
      </body>
    </html>
  )
}
