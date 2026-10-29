import type { Metadata } from 'next'
import { Clock, Mail, Monitor, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { pageMetadata } from '@/lib/seo/metadata'
import { MotionController } from '@/components/animations/motion-controller'
import { OpeningHours } from '@/components/layout/opening-hours'
import { BookingSection } from '@/components/sections/booking-section'
import { PageHero } from '@/components/sections/page-hero'
import { SafeSpace } from '@/components/sections/safe-space'

export const metadata: Metadata = pageMetadata({
  title: 'Contact Me',
  description: 'Book an online conversation, or contact Paper Skin & Synapses by email or phone.',
  path: '/contact',
})

const details = [
  { icon: Mail, label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Phone, label: 'Phone', value: siteConfig.phone, href: siteConfig.phoneHref },
  { icon: Clock, label: 'Availability', value: <OpeningHours /> },
  { icon: Monitor, label: 'Practice', value: siteConfig.modeNote },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        id="contact-page-title"
        eyebrow="Contact me"
        crumb="Contact Me"
        title={
          <>
            Talk to <em className="text-burgundy italic">me</em>
          </>
        }
        aside={
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {details.map((item) => {
              const Icon = item.icon
              const body = (
                <>
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-burgundy/8 text-burgundy transition-colors duration-500 group-hover:bg-burgundy group-hover:text-paper">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="grid min-w-0 gap-0.5">
                    <span className="type-eyebrow text-[0.62rem] text-coffee">{item.label}</span>
                    <span className="text-[1rem] font-medium break-words text-shadow">{item.value}</span>
                  </span>
                </>
              )
              return (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="surface-card group flex items-center gap-4 rounded-[0.8rem] border border-coffee/12 p-4 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-burgundy/40"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="surface-card group flex items-center gap-4 rounded-[0.8rem] border border-coffee/12 p-4">{body}</div>
                  )}
                </li>
              )
            })}
          </ul>
        }
      >
        <p>
          Whether you have a clear plan or just a question, you’re welcome to get in touch. Book a slot through the calendar below, or write to
          me directly by email.
        </p>
      </PageHero>

      <BookingSection eyebrow="Shared booking calendar" />
      <SafeSpace />
      <MotionController />
    </>
  )
}
