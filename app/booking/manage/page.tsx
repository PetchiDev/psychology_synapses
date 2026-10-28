import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo/metadata'
import { ManageBooking } from '@/components/booking/manage-booking'
import { CrisisSupport } from '@/components/booking/crisis-support'
import { PageHero } from '@/components/sections/page-hero'

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Your Booking',
    description: 'View, change or cancel your booking with Paper Skin & Synapses.',
    path: '/booking/manage/',
  }),
  // Private links: keep them out of search results.
  robots: { index: false, follow: false },
}

export default function ManageBookingPage() {
  return (
    <>
      <PageHero
        id="manage-booking-title"
        eyebrow="Your booking"
        crumb="Your Booking"
        title={
          <>
            Your <em className="text-burgundy italic">booking</em>
          </>
        }
      >
        <p>See where your request stands, choose another time, or cancel if your plans have changed.</p>
      </PageHero>
      <section aria-label="Booking details" className="relative bg-paper-deep/50 py-16 lg:py-24">
        <div className="container-editorial">
          <ManageBooking />
          <CrisisSupport className="mt-8" />
        </div>
      </section>
    </>
  )
}
