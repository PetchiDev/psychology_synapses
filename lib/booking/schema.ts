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
export const MESSAGE_MAX = 1000

export const ENQUIRY_VALUES = ['individual', 'organisation', 'talk', 'research', 'other'] as const

export const isClosedDay = (date: Date) => date.getDay() === 0 || date.getDay() === 6

const PHONE_MESSAGE = 'Please enter a valid phone number, e.g. +91 98765 43210, or leave this blank.'

export const bookingSchema = z.object({
  enquiryType: z.enum(ENQUIRY_VALUES, { error: 'Please choose what you would like to discuss.' }),
  date: z
    .date({ error: 'Please choose a preferred date.' })
    .refine((date) => date >= startOfToday(), 'Please choose today or a future date.')
    .refine((date) => !isClosedDay(date), 'Slots are available Monday to Friday. Please choose a weekday.'),
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
  organisation: z
    .string()
    .transform(sanitizeLine)
    .pipe(z.string().max(120, 'Please keep this under 120 characters.')),
  message: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(15, 'A sentence or two is enough. Please share a little more (at least 15 characters).')
        .max(MESSAGE_MAX, `Please keep this under ${MESSAGE_MAX} characters. We can talk through the rest on the call.`),
    ),
  email: z.string().transform(sanitizeLine).pipe(z.email('Please enter a valid email address so I can reply.')),
  phone: z
    .string()
    .transform(sanitizeLine)
    .pipe(
      z.union([
        z.literal(''),
        z
          .string()
          .regex(/^\+?[\d\s()-]{7,20}$/, PHONE_MESSAGE)
          .refine((value) => {
            const digits = value.replace(/\D/g, '').length
            return digits >= 7 && digits <= 15
          }, PHONE_MESSAGE),
      ]),
    ),
  consent: z.boolean().refine((value) => value, 'Please confirm so I can contact you about your enquiry.'),
  website: z.string().optional(),
})

export type BookingFormInput = z.input<typeof bookingSchema>
export type BookingFormValues = z.output<typeof bookingSchema>

export const bookingSteps = [
  { id: 'type', title: 'What would you like to discuss?', short: 'Enquiry type', fields: ['enquiryType'] },
  { id: 'date', title: 'Choose a date & time', short: 'Date & time', fields: ['date', 'time'] },
  { id: 'details', title: 'Tell me what you have in mind', short: 'Your enquiry', fields: ['name', 'organisation', 'message'] },
  { id: 'contact', title: 'How to reach you', short: 'Contact details', fields: ['email', 'phone'] },
  { id: 'review', title: 'Review & send', short: 'Review & send', fields: ['consent'] },
] as const satisfies ReadonlyArray<{ id: string; title: string; short: string; fields: ReadonlyArray<keyof BookingFormInput> }>

export const bookingWindow = () => {
  const from = startOfToday()
  const to = new Date(from)
  to.setDate(to.getDate() + BOOKING_WINDOW_DAYS)
  return { from, to }
}
