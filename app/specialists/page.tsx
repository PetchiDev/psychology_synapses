import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { doctors } from '@/data/doctors'
import { pageMetadata } from '@/lib/seo/metadata'
import { MotionController } from '@/components/animations/motion-controller'
import { DoctorCard } from '@/components/doctors/doctor-card'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = pageMetadata({
  title: 'Our Specialists — Psychologists in Chennai',
  description:
    'Meet the clinical and counselling psychologists at Paper, Skin & Synapses: specialists in anxiety, depression, child and adolescent psychology, couples counselling, trauma, assessment and workplace stress.',
  path: '/specialists',
})

export default function SpecialistsPage() {
  return (
    <>
      <section aria-labelledby="specialists-page-title" className="pt-32 pb-12 sm:pt-40 lg:pb-16">
        <div className="container-editorial">
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Our Specialists', path: '/specialists' },
            ]}
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-12">
            <div>
              <p data-hero-item className="type-eyebrow text-coffee">
                {doctors.length} psychologists · {doctors.reduce((sum, d) => sum + d.yearsOfExperience, 0)}+ years of combined experience
              </p>
              <h1 id="specialists-page-title" data-hero-item className="type-display mt-5">
                Meet the people who will <em className="text-burgundy">listen</em>.
              </h1>
            </div>
            <div data-hero-item className="grid max-w-xl gap-5 lg:pb-3">
              <p className="type-lead text-shadow/80">
                Each of our specialists brings a different background and a shared commitment to warm, evidence-based care. Select a
                profile to learn about their training, approach and availability.
              </p>
              <Button asChild size="lg" className="w-fit">
                <Link href="/#book">
                  Book an Appointment
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="All specialists" className="pb-12">
        <ul data-reveal-group className="container-editorial grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {doctors.map((doctor) => (
            <li key={doctor.slug} data-reveal-item>
              <DoctorCard doctor={doctor} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </section>
      <MotionController />
    </>
  )
}
