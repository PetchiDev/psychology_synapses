import type { Metadata } from 'next'
import { faqs } from '@/data/content'
import { JsonLd } from '@/lib/seo/json-ld'
import { pageMetadata } from '@/lib/seo/metadata'
import { faqSchema, graph } from '@/lib/seo/schemas'
import { MotionController } from '@/components/animations/motion-controller'
import { AboutPractice } from '@/components/sections/about-practice'
import { BookingSection } from '@/components/sections/booking-section'
import { Faq } from '@/components/sections/faq'
import { FinalCta } from '@/components/sections/final-cta'
import { Hero } from '@/components/sections/hero'
import { PracticeBand } from '@/components/sections/practice-band'
import { Process } from '@/components/sections/process'
import { Psychologist } from '@/components/sections/psychologist'
import { SafeSpace } from '@/components/sections/safe-space'
import { WaysToWork } from '@/components/sections/ways-to-work'

export const metadata: Metadata = pageMetadata({ path: '/' })

export default function HomePage() {
  return (
    <>
      <Hero />
      <PracticeBand />
      <AboutPractice />
      <WaysToWork />
      <Psychologist />
      <SafeSpace />
      <Process />
      <BookingSection />
      <Faq />
      <FinalCta />
      <JsonLd data={graph(faqSchema(faqs))} />
      <MotionController />
    </>
  )
}
