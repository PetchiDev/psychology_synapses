import { z } from 'zod'

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const ANGLE_BRACKETS = /[<>]/g

export const sanitizeLine = (value: string) =>
  value.replace(CONTROL_CHARS, '').replace(ANGLE_BRACKETS, '').replace(/\s+/g, ' ').trim()

export const sanitizeText = (value: string) =>
  value
    .replace(CONTROL_CHARS, '')
    .replace(ANGLE_BRACKETS, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const startOfToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export const BOOKING_WINDOW_DAYS = 90
export const CONCERN_MAX = 1000

export const isClosedDay = (date: Date) => date.getDay() === 0

export const bookingSchema = z.object({
  date: z
    .date({ error: 'Please choose a preferred date.' })
    .refine((date) => date >= startOfToday(), 'Please choose today or a future date.')
    .refine((date) => !isClosedDay(date), 'We are closed on Sundays. Please choose another day.'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Please choose a time slot.'),
  name: z
    .string()
    .transform(sanitizeLine)
    .pipe(
      z
        .string()
        .min(2, 'Please enter your full name.')
        .max(80, 'Please keep your name under 80 characters.')
        .regex(/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u, 'Please use letters, spaces, apostrophes or hyphens only.'),
    ),
  address: z
    .string()
    .transform(sanitizeLine)
    .pipe(z.string().min(6, 'Please enter your address so we know where you are based.').max(200, 'Please keep your address under 200 characters.')),
  concern: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(15, 'A sentence or two is enough — please share a little more (at least 15 characters).')
        .max(CONCERN_MAX, `Please keep this under ${CONCERN_MAX} characters. You can share more during your consultation.`),
    ),
  phone: z
    .string()
    .transform(sanitizeLine)
    .pipe(
      z
        .string()
        .regex(/^\+?[\d\s()-]{7,20}$/, 'Please enter a valid phone number, e.g. +91 98765 43210.')
        .refine((value) => {
          const digits = value.replace(/\D/g, '').length
          return digits >= 7 && digits <= 15
        }, 'Please enter a valid phone number, e.g. +91 98765 43210.'),
    ),
  email: z
    .string()
    .transform(sanitizeLine)
    .pipe(z.union([z.literal(''), z.email('Please enter a valid email address, or leave this blank.')])),
  consent: z.boolean().refine((value) => value, 'Please confirm so we can contact you about your request.'),
  website: z.string().optional(),
})

export type BookingFormInput = z.input<typeof bookingSchema>
export type BookingFormValues = z.output<typeof bookingSchema>

export const bookingSteps = [
  { id: 'date', title: 'Choose a date & time', fields: ['date', 'time'] },
  { id: 'about', title: 'About you', fields: ['name', 'address'] },
  { id: 'concern', title: 'Your concern', fields: ['concern'] },
  { id: 'contact', title: 'How to reach you', fields: ['phone', 'email'] },
  { id: 'review', title: 'Review & send', fields: ['consent'] },
] as const satisfies ReadonlyArray<{ id: string; title: string; fields: ReadonlyArray<keyof BookingFormInput> }>

export const bookingWindow = () => {
  const from = startOfToday()
  const to = new Date(from)
  to.setDate(to.getDate() + BOOKING_WINDOW_DAYS)
  return { from, to }
}
