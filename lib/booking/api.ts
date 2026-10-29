import { addDays, format, isAfter } from 'date-fns'
import type { EnquiryType } from '@/data/content'
import type { BookingFormValues } from '@/lib/booking/schema'

// Booking API (PHP on the Hostinger api subdomain). Reference: docs/API.md in the booking-api repo.
export const BOOKING_API = (process.env.NEXT_PUBLIC_BOOKING_API ?? 'https://api.paperskinandsynapses.com/api/v1').replace(/\/$/, '')

/** Each enquiry type on the form is a service in the booking API (managed in its CMS). */
export const SERVICE_FOR_ENQUIRY: Record<EnquiryType, string> = {
  individual: 'individual-counselling',
  organisation: 'organisations-schools-colleges',
  talk: 'talks-workshops',
  research: 'research-collaborations',
  other: 'other-enquiry',
}

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed' | 'no_show'

export interface ApiSlot {
  time: string
  available: boolean
  durationMinutes: number
}

export interface ApiDay {
  date: string
  open: boolean
  reason: string | null
  slots: ApiSlot[]
}

export interface ApiDaySummary {
  date: string
  open: boolean
  reason: string | null
  availableSlots: number
}

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

async function request<T>(path: string, init: { method?: string; body?: unknown; bookingToken?: string } = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BOOKING_API}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(init.bookingToken ? { 'X-Booking-Token': init.bookingToken } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    })
  } catch {
    throw new BookingApiError(0, 'NETWORK', 'We couldn’t reach the booking service. Please check your connection and try again.')
  }
  const json = await response.json().catch(() => null)
  if (!response.ok) {
    const error = json?.error
    throw new BookingApiError(
      response.status,
      error?.code ?? 'HTTP_ERROR',
      error?.message ?? 'Something went wrong. Please try again.',
      error?.details?.fields ?? {},
    )
  }
  return json as T
}

export const toIsoDate = (date: Date) => format(date, 'yyyy-MM-dd')

/** Per-day availability for the calendar. The API answers at most 62 days a call, so longer windows are split. */
export async function fetchCalendar(from: Date, to: Date, service?: string): Promise<Map<string, ApiDaySummary>> {
  const days = new Map<string, ApiDaySummary>()
  const chunks: Array<[Date, Date]> = []
  for (let start = from; !isAfter(start, to); start = addDays(start, 60)) {
    const end = addDays(start, 59)
    chunks.push([start, isAfter(end, to) ? to : end])
  }
  const query = service ? `&service=${encodeURIComponent(service)}` : ''
  const results = await Promise.all(
    chunks.map(([a, b]) => request<{ data: ApiDaySummary[] }>(`/availability?from=${toIsoDate(a)}&to=${toIsoDate(b)}${query}`)),
  )
  for (const result of results) for (const day of result.data) days.set(day.date, day)
  return days
}

export async function fetchDay(date: Date, service?: string): Promise<ApiDay> {
  const query = service ? `&service=${encodeURIComponent(service)}` : ''
  return (await request<{ data: ApiDay }>(`/availability?date=${toIsoDate(date)}${query}`)).data
}

export async function createBooking(values: BookingFormValues): Promise<{ booking: ApiBooking; manageToken: string | null }> {
  const { data } = await request<{ data: { booking: ApiBooking; manageToken: string | null } }>('/bookings', {
    method: 'POST',
    body: {
      service: SERVICE_FOR_ENQUIRY[values.enquiryType],
      date: toIsoDate(values.date),
      time: values.time,
      name: values.name,
      organisation: values.organisation,
      message: values.message,
      email: values.email,
      phone: values.phone,
      mode: 'video',
      consent: values.consent,
      website: values.website ?? '',
    },
  })
  return data
}

/** API field names → booking form field names (the API calls the message "concern"). */
export const formFieldFor = (apiField: string) => (apiField === 'concern' ? 'message' : apiField)

export async function getBooking(reference: string, token: string) {
  return (await request<{ data: ApiBooking }>(`/bookings/${encodeURIComponent(reference)}`, { bookingToken: token })).data
}

export async function rescheduleBooking(reference: string, token: string, date: Date, time: string) {
  return (
    await request<{ data: ApiBooking }>(`/bookings/${encodeURIComponent(reference)}`, {
      method: 'PATCH',
      bookingToken: token,
      body: { date: toIsoDate(date), time },
    })
  ).data
}

export async function cancelBooking(reference: string, token: string, reason: string) {
  return (
    await request<{ data: ApiBooking }>(`/bookings/${encodeURIComponent(reference)}/cancel`, {
      method: 'POST',
      bookingToken: token,
      body: reason ? { reason } : {},
    })
  ).data
}
