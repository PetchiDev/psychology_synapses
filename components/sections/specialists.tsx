import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { doctors } from '@/data/doctors'
import { DoctorCard } from '@/components/doctors/doctor-card'
import { Button } from '@/components/ui/button'
import { SectionHeading } from './section-heading'

export function Specialists() {
  return (
    <section id="specialists" aria-labelledby="specialists-title" className="relative py-14 lg:py-20">
      <div className="container-editorial">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="specialists-title"
            index="04"
            eyebrow="Our team"
            title="Meet Our Specialists"
            description="Licensed psychologists with deep experience across adult, child, couples and trauma care. Choose someone specific, or let us match you."
            className="lg:col-span-8"
          />
          <div data-reveal className="lg:col-span-4 lg:justify-self-end">
            <Button asChild variant="outline" size="lg">
              <Link href="/specialists">
                View all specialists
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <ul data-reveal-group className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8" aria-label="Specialists">
          {doctors.slice(0, 3).map((doctor) => (
            <li key={doctor.slug} data-reveal-item>
              <DoctorCard doctor={doctor} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
