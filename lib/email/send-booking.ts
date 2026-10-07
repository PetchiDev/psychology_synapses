import type { BookingFormValues } from '@/lib/booking/schema'

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

const RECIPIENT = 'petchidev22@gmail.com'

export const formatAppointmentDate = (date: Date) =>
  date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export async function sendBookingEmail(values: BookingFormValues) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) throw new BookingConfigError()

  const { default: emailjs } = await import('@emailjs/browser')

  const templateParams = {
    to_email: RECIPIENT,
    appointment_date: formatAppointmentDate(values.date),
    name: values.name,
    address: values.address,
    concern: values.concern,
    phone: values.phone,
    email: values.email || 'Not provided',
    reply_to: values.email || RECIPIENT,
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
}
