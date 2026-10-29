import type { ApiBooking, BookingStatus } from '@/lib/booking/api'

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type Mode = 'in_person' | 'video'
export type Paged<T> = { data: T[]; meta: { page: number; perPage: number; total: number } }

export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'practitioner'
  practitionerId: number | null
  isActive: boolean
  lastLoginAt: string | null
}

export interface Summary {
  pending: number
  unassignedPending: number
  today: number
  upcomingConfirmed: number
}

export interface StaffAppointment extends ApiBooking {
  id: number
  client: { id: number; name: string; phone: string | null; email: string | null; address: string | null }
  concern: string | null
  organisation: string | null
  source: 'web' | 'staff'
  staffNotes: string | null
  cancelReason: string | null
  createdAt: string
  confirmedAt: string | null
  history?: { actor: string; action: string; detail: string | null; at: string }[]
}

export type AppointmentAction = 'confirm' | 'decline' | 'reschedule' | 'cancel' | 'complete' | 'no-show' | 'notes'

/** A booking taken over the phone. Phone or email is required; consent is recorded by staff. */
export interface PhoneBookingInput {
  service: string
  date: string
  time: string
  name: string
  phone?: string
  email?: string
  organisation?: string
  message?: string
  mode: Mode
}

export interface AdminService {
  id: number
  slug: string
  name: string
  description: string
  suitableFor: string
  durationMinutes: number
  bookingType: 'individual' | 'enquiry'
  price: { amount: number; currency: 'INR' } | null
  sortOrder: number
  isActive: boolean
  practitionerIds: number[]
}

export type ServiceInput = Partial<Omit<AdminService, 'id' | 'price'>> & { price?: number | null }

export interface WorkingHours {
  weekday: Weekday
  start: string
  end: string
}

export interface AdminPractitioner {
  id: number
  slug: string
  name: string
  title: string
  focus: string
  summary: string
  yearsExperience: number
  languages: string[]
  modes: Mode[]
  sessionMinutes: number
  services: string[]
  workingHours: (WorkingHours & { day: string })[]
  email: string | null
  isActive: boolean
  sortOrder: number
}

export type PractitionerInput = Partial<Omit<AdminPractitioner, 'id' | 'services' | 'workingHours'>> & {
  serviceIds?: number[]
}

export interface TimeOff {
  id: number
  practitionerId: number | null
  startsAt: string
  endsAt: string
  reason: string | null
}

export interface ClientListItem {
  id: number
  name: string
  phone: string | null
  email: string | null
  address: string | null
  createdAt: string
  appointments: number
}

export interface ClientDetail extends Omit<ClientListItem, 'appointments'> {
  updatedAt: string
  appointments: {
    id: number
    reference: string
    status: BookingStatus
    startsAt: string
    practitioner: string | null
    service: string | null
  }[]
}

export interface Settings {
  clinicName: string
  phone: string
  email: string
  address: string
  openingHoursText: string
  languages: string[]
  emergency: { police: string; teleManas: string }
  slotGrid: Record<number, string[]>
  breaks: Record<number, [string, string][]>
  minLeadMinutes: number
  maxDaysAhead: number
  maxPendingPerPhone: number
  copyOwnerOnPractitionerBookings: boolean
  siteUrl: string
}
