import type { Metadata } from 'next'
import { faqs } from '@/data/content'
import { JsonLd } from '@/lib/seo/json-ld'
import { pageMetadata } from '@/lib/seo/metadata'
import { faqSchema, graph } from '@/lib/seo/schemas'
import { MotionController } from '@/components/animations/motion-controller'
import { AboutTrust } from '@/components/sections/about-trust'
import { BookingSection } from '@/components/sections/booking-section'
import { Concerns } from '@/components/sections/concerns'
import { Faq } from '@/components/sections/faq'
import { FinalCta } from '@/components/sections/final-cta'
import { Hero } from '@/components/sections/hero'
import { Process } from '@/components/sections/process'
import { SafeSpace } from '@/components/sections/safe-space'
import { Services } from '@/components/sections/services'
import { Specialists } from '@/components/sections/specialists'

export const metadata: Metadata = pageMetadata({ path: '/' })

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutTrust />
      <Concerns />
      <Services />
      <Specialists />
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
