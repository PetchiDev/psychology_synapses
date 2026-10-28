import { Clock, Mail, Monitor, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { BookingFlow } from '@/components/booking/booking-flow'
import { CrisisSupport } from '@/components/booking/crisis-support'
import { SectionHeading } from './section-heading'

export function BookingSection({ eyebrow = 'Enquiries & booking' }: { eyebrow?: string }) {
  return (
    <section id="book" aria-labelledby="book-title" className="relative bg-paper-deep/50 py-20 lg:py-28">
      <div className="container-editorial">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="book-title"
            eyebrow={eyebrow}
            title="Book *Me*"
            description={<p>Choose what you’d like to discuss, then select a time that works for you.</p>}
            className="lg:col-span-7"
          />
          <ul data-reveal className="grid gap-3 text-[0.95rem] lg:col-span-5 lg:col-start-8 lg:justify-items-end lg:text-right">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 text-burgundy hover:underline hover:underline-offset-4">
                <Mail className="size-4" aria-hidden="true" />
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 text-burgundy hover:underline hover:underline-offset-4">
                <Phone className="size-4" aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-shadow/75">
              <Clock className="size-4" aria-hidden="true" />
              {siteConfig.hoursLabel}
            </li>
            <li className="inline-flex items-center gap-2 text-shadow/75">
              <Monitor className="size-4" aria-hidden="true" />
              {siteConfig.modeNote}
            </li>
          </ul>
        </div>

        <div data-reveal className="mt-12">
          <BookingFlow />
        </div>

        <CrisisSupport className="mt-8" />
      </div>
    </section>
  )
}
