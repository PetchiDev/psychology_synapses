import { enquiryLabel } from '@/data/content'
import type { BookingFormValues } from '@/lib/booking/schema'
import { formatSlot } from '@/lib/booking/slots'
import { siteConfig } from '@/lib/site'

export class BookingConfigError extends Error {
  constructor() {
    super('Booking email is not configured.')
    this.name = 'BookingConfigError'
  }
}

export class BookingSendError extends Error {
  constructor(public status?: number) {
    super('Booking email could not be sent.')
    this.name = 'BookingSendError'
  }
}

const RECIPIENT = process.env.NEXT_PUBLIC_BOOKING_RECIPIENT || siteConfig.email

export const formatAppointmentDate = (date: Date) =>
  date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export async function sendBookingEmail(values: BookingFormValues) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const autoReplyId = process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) throw new BookingConfigError()

  const { default: emailjs } = await import('@emailjs/browser')

  const templateParams = {
    to_email: RECIPIENT,
    enquiry_type: enquiryLabel(values.enquiryType),
    appointment_date: formatAppointmentDate(values.date),
    appointment_time: formatSlot(values.time),
    name: values.name,
    organisation: values.organisation || 'Not provided',
    message: values.message,
    concern: values.message,
    phone: values.phone || 'Not provided',
    email: values.email,
    reply_to: values.email,
    practice_name: siteConfig.name,
    practice_email: siteConfig.email,
    submitted_at: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
  }

  try {
    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      limitRate: { id: 'booking', throttle: 15000 },
    })
  } catch (error) {
    const status = typeof error === 'object' && error && 'status' in error ? Number(error.status) : undefined
    throw new BookingSendError(status)
  }

  if (!autoReplyId) return
  try {
    await emailjs.send(serviceId, autoReplyId, { ...templateParams, to_email: values.email, reply_to: siteConfig.email }, { publicKey })
  } catch {
    // The enquiry has already been delivered, so a failed acknowledgement should not fail the request.
  }
}
