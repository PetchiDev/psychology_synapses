import type { Metadata, Viewport } from 'next'
import { Cinzel, Cormorant_Garamond, DM_Sans, IM_Fell_English } from 'next/font/google'
import { siteConfig } from '@/lib/site'
import { JsonLd } from '@/lib/seo/json-ld'
import { graph, organizationSchema, websiteSchema } from '@/lib/seo/schemas'
import { ButtonSparkles } from '@/components/animations/button-sparkles'
import { CursorSparkles } from '@/components/animations/cursor-sparkles'
import { CalmCorner } from '@/components/layout/calm-corner'
import { ReadingProgress } from '@/components/animations/reading-progress'
import { SmoothScroll } from '@/components/animations/smooth-scroll'
import { HashLinkHandler } from '@/components/layout/hash-link-handler'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { PaperShell } from '@/components/paper/paper-shell'
import { TooltipProvider } from '@/components/ui/tooltip'
import 'lenis/dist/lenis.css'
import './globals.css'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const fell = IM_Fell_English({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-fell',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const defaultTitle = `${siteConfig.name} | Psychology, Clinical Practice, Consulting, Talks and Research`

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
    'psychologist',
    'individual counselling online',
    'organisational psychology',
    'workplace wellbeing programmes',
    'school mental health programmes',
    'psychoeducation talks',
    'psychology workshops',
    'psychology research collaboration',
    'psychology library',
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
  formatDetection: { telephone: true, email: true, address: false },
}

export const viewport: Viewport = {
  themeColor: '#f3e6c8',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${fell.variable} ${cinzel.variable}`}
    >
      <body className="relative flex min-h-dvh flex-col">
        <PaperShell />
        <a
          href="#main"
          className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-shadow px-5 py-3 text-sm font-semibold text-paper transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <SmoothScroll />
        <ReadingProgress />
        <TooltipProvider delayDuration={200}>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="relative z-0 flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </TooltipProvider>
        <HashLinkHandler />
        <ButtonSparkles />
        <CursorSparkles />
        <CalmCorner />
        <JsonLd data={graph(organizationSchema(), websiteSchema())} />
      </body>
    </html>
  )
}
