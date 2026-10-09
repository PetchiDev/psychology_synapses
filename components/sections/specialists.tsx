import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { doctors } from '@/data/doctors'
import { HorizontalShelf } from '@/components/animations/horizontal-shelf'
import { DoctorCard } from '@/components/doctors/doctor-card'
import { Candle } from '@/components/library/candle'
import { Button } from '@/components/ui/button'
import { SectionHeading } from './section-heading'

export function Specialists() {
  return (
    <section id="specialists" aria-labelledby="specialists-title" className="relative isolate bg-mahogany py-14 text-paper lg:py-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/4 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(248_217_143/0.14),transparent_65%)]" />
        <div className="absolute right-0 bottom-0 size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(122_35_38/0.3),transparent_65%)]" />
      </div>

      <HorizontalShelf
        label="Specialists"
        intro={
          <div className="grid gap-8">
            <SectionHeading
              id="specialists-title"
              index="03"
              eyebrow="Our team"
              title="Meet Our *Specialists*"
              tone="light"
              description="Licensed psychologists with deep experience across adult, child, couples and trauma care. Browse the shelf: choose someone specific, or let us match you."
            />
            <div data-reveal className="flex items-end gap-6">
              <Button asChild variant="outline" size="lg" className="w-full border-gold/50 text-paper hover:border-paper hover:bg-paper hover:text-shadow sm:w-auto">
                <Link href="/specialists">
                  View all specialists
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Candle className="hidden w-7 lg:block" height={0.7} />
            </div>
          </div>
        }
      >
        {doctors.map((doctor) => (
          <li key={doctor.slug} className="w-[80vw] max-w-[20rem] shrink-0 snap-center sm:snap-start lg:w-[19rem]">
            <DoctorCard doctor={doctor} className="rail-card" />
          </li>
        ))}
        <li className="w-[80vw] max-w-[20rem] shrink-0 snap-center self-stretch sm:snap-start lg:w-[19rem]">
          <div className="rail-card leather-surface flex h-full min-h-[22rem] flex-col justify-end gap-4 rounded-[0.5rem] p-8">
            <p className="type-hand text-2xl text-gold">not sure who to choose?</p>
            <p className="font-serif text-[1.6rem] leading-tight text-paper">We’ll gently match you with the right person.</p>
            <Link href="#book" className="inline-flex w-fit items-center gap-2 font-ui text-[0.72rem] tracking-[0.16em] text-gold uppercase hover:text-paper">
              Ask our team
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </li>
      </HorizontalShelf>
    </section>
  )
}
