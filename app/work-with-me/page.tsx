import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMetadata } from '@/lib/seo/metadata'
import { MotionController } from '@/components/animations/motion-controller'
import { FinalCta } from '@/components/sections/final-cta'
import { PageHero } from '@/components/sections/page-hero'
import { Process } from '@/components/sections/process'
import { LibraryGateway } from '@/components/sections/ways-to-work'
import { WorkWaysAside } from '@/components/sections/work-ways-aside'
import { WorkJourney } from '@/components/work/work-journey'

export const metadata: Metadata = pageMetadata({
  title: 'Work With Me',
  description:
    'Individual counselling, programmes for organisations, schools and colleges, psychoeducation talks and workshops, and research collaborations.',
  path: '/work-with-me',
})

export default function WorkWithMePage() {
  return (
    <>
      <PageHero
        id="work-page-title"
        eyebrow="Work with me"
        crumb="Work With Me"
        title={
          <>
            Ways to work <em className="text-burgundy italic">with me</em>
          </>
        }
        aside={<WorkWaysAside />}
      >
        <p>
          Psychology can be useful in many different settings. You might be looking for individual support, planning something for a school or
          workplace, organising a talk, or exploring a research project together.
        </p>
        <p>
          Choose the area that fits what you have in mind. If you are unsure where your enquiry belongs, you can{' '}
          <Link href="/contact?enquiry=other#book" className="font-semibold text-burgundy underline underline-offset-4">
            get in touch
          </Link>{' '}
          and explain what you need.
        </p>
      </PageHero>

      <WorkJourney>
        <LibraryGateway />
      </WorkJourney>

      <Process />
      <FinalCta />
      <MotionController />
    </>
  )
}
