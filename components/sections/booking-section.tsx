import { LifeBuoy, Mail, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { BookingFlow } from '@/components/booking/booking-flow'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WaveDivider } from '@/components/animations/wave-divider'
import { SectionHeading } from './section-heading'

export function BookingSection() {
  return (
    <section id="book" aria-labelledby="book-title" className="relative py-14 lg:py-20">
      <div aria-hidden="true" className="absolute inset-x-0 top-16 bottom-0 -z-10 flex flex-col text-[#ecdbb8]">
        <WaveDivider variant="cloud" drift={0.08} />
        <div className="-mt-px flex-1 bg-[#ecdbb8] bg-(image:--fibres)" />
      </div>
      <div className="container-editorial">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="book-title"
            index="06"
            eyebrow="Appointments"
            title="Book a *Consultation*"
            description="Choose a date that suits you, tell us a little about yourself, and we’ll call within one working day to confirm a time."
            className="lg:col-span-7"
          />
          <div data-reveal className="grid gap-3 text-[0.95rem] lg:col-span-5 lg:col-start-8 lg:justify-items-end lg:text-right">
            <p className="font-semibold text-shadow">Prefer to talk first?</p>
            <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 text-burgundy hover:underline hover:underline-offset-4">
              <Phone className="size-4" aria-hidden="true" />
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 text-burgundy hover:underline hover:underline-offset-4">
              <Mail className="size-4" aria-hidden="true" />
              {siteConfig.email}
            </a>
          </div>
        </div>

        <div data-reveal className="mt-10">
          <BookingFlow />
        </div>

        <Alert data-reveal className="mt-8" role="note">
          <LifeBuoy aria-hidden="true" />
          <AlertTitle>Need help right now?</AlertTitle>
          <AlertDescription>
            <p>
              This form is for planned consultations. If you or someone else is in immediate danger, call{' '}
              <a href={`tel:${siteConfig.crisis.emergency}`} className="font-semibold text-burgundy underline underline-offset-4">
                {siteConfig.crisis.emergency}
              </a>
              . For free, confidential support at any hour, call {siteConfig.crisis.label} on{' '}
              <a href={siteConfig.crisis.href} className="font-semibold text-burgundy underline underline-offset-4">
                {siteConfig.crisis.number}
              </a>
              .
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </section>
  )
}
