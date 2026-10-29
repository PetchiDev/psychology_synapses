/** Shared booking/CMS API helpers. Full public booking client may live alongside this. */

export const BOOKING_API = (process.env.NEXT_PUBLIC_BOOKING_API ?? 'https://api.paperskinandsynapses.com/api/v1').replace(
  /\/$/,
  '',
)

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed' | 'no_show'

export interface ApiBooking {
  reference: string
  status: BookingStatus
  date: string
  time: string
  startsAt: string
  endsAt: string
  practitioner: { slug: string; name: string } | null
  service: { slug: string; name: string } | null
  mode: 'in_person' | 'video' | null
  message: string | null
}

export class BookingApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'BookingApiError'
  }
}
