'use client'

import { useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import { useForm, useWatch, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isValid, parse } from 'date-fns'
import { ArrowLeft, ArrowRight, CalendarHeart, Check, Info, Loader2, PencilLine, Send } from 'lucide-react'
import {
  bookingSchema,
  bookingSteps,
  bookingWindow,
  CONCERN_MAX,
  isClosedDay,
  type BookingFormInput,
  type BookingFormValues,
} from '@/lib/booking/schema'
import { BookingConfigError, formatAppointmentDate, sendBookingEmail } from '@/lib/email/send-booking'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/components/animations/gsap'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { BookingField } from './booking-field'
import { PrivacyDialog } from './privacy-dialog'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const defaultValues: Partial<BookingFormInput> = {
  name: '',
  address: '',
  concern: '',
  phone: '',
  email: '',
  consent: false,
  website: '',
}

const ISO = 'yyyy-MM-dd'
const lastStep = bookingSteps.length - 1

const subscribeNoop = () => () => {}
const getTodayKey = () => format(new Date(), ISO)
const getServerTodayKey = () => null

export function BookingFlow() {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmedDate, setConfirmedDate] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const hasNavigated = useRef(false)
  const todayKey = useSyncExternalStore(subscribeNoop, getTodayKey, getServerTodayKey)
  const range = useMemo(() => (todayKey ? bookingWindow() : null), [todayKey])

  const form = useForm<BookingFormInput, unknown, BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched',
    defaultValues,
  })
  const { register, control, setValue, trigger, handleSubmit, reset, formState } = form
  const { errors } = formState
  const values = useWatch({ control })
  const selectedDate = values.date instanceof Date ? values.date : undefined
  const concernLength = values.concern?.length ?? 0

  useGSAP(
    () => {
      if (!hasNavigated.current || !panelRef.current) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          panelRef.current,
          { autoAlpha: 0, x: 28 },
          { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform' },
        )
      })
      headingRef.current?.focus({ preventScroll: true })
      return () => mm.revert()
    },
    { dependencies: [step], scope: panelRef },
  )

  const goTo = (index: number) => {
    hasNavigated.current = true
    setStep(Math.max(0, Math.min(lastStep, index)))
    setErrorMessage(null)
  }

  const goNext = async () => {
    const fields = [...bookingSteps[step].fields]
    const ok = await trigger(fields, { shouldFocus: true })
    if (ok) goTo(step + 1)
    else if (bookingSteps[step].id === 'date') document.getElementById('appointment-date')?.focus()
  }

  const selectDate = (date: Date | undefined) => {
    setValue('date', date as Date, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
  }

  const onNativeDate = (raw: string) => {
    const parsed = parse(raw, ISO, new Date())
    selectDate(isValid(parsed) ? parsed : undefined)
  }

  const onValid = async (data: BookingFormValues) => {
    setErrorMessage(null)
    if (data.website) {
      setStatus('success')
      return
    }
    setStatus('submitting')
    try {
      await sendBookingEmail(data)
      setConfirmedDate(formatAppointmentDate(data.date))
      setStatus('success')
      reset(defaultValues)
      requestAnimationFrame(() => successRef.current?.focus())
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof BookingConfigError
          ? `Online booking is temporarily unavailable. Please call us on ${siteConfig.phone} and we will gladly help.`
          : `We couldn’t send your request just now. Please check your connection and try again, or call us on ${siteConfig.phone}.`,
      )
    }
  }

  const onInvalid = (fieldErrors: FieldErrors<BookingFormInput>) => {
    const index = bookingSteps.findIndex((s) => s.fields.some((field) => field in fieldErrors))
    if (index >= 0 && index !== step) goTo(index)
  }

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step < lastStep) {
      event.preventDefault()
      void goNext()
      return
    }
    void handleSubmit(onValid, onInvalid)(event)
  }

  const startOver = () => {
    setStatus('idle')
    setConfirmedDate(null)
    hasNavigated.current = true
    setStep(0)
  }

  if (status === 'success') {
    return (
      <div className="paper-surface organic-edge relative overflow-hidden p-8 sm:p-12" role="status" aria-live="polite">
        <span aria-hidden="true" className="absolute -top-16 -right-16 size-56 rounded-full bg-latte/60" />
        <div className="relative grid gap-6">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-burgundy text-paper">
            <Check className="size-7" aria-hidden="true" />
          </span>
          <h3 ref={successRef} tabIndex={-1} className="type-h2 max-w-xl outline-none">
            Thank you. Your request is with us.
          </h3>
          <p className="type-lead max-w-xl text-shadow/85">
            {confirmedDate ? (
              <>
                We’ve noted <strong className="font-semibold text-burgundy">{confirmedDate}</strong> as your preferred date.{' '}
              </>
            ) : null}
            A member of our care team will call you within one working day to confirm a time that suits you.
          </p>
          <p className="type-hand text-2xl text-burgundy">Reaching out takes courage — well done.</p>
          <p className="text-sm text-coffee">
            If you need to talk to someone sooner, call {siteConfig.phone}. In an emergency, call {siteConfig.crisis.emergency} or
            Tele-MANAS on {siteConfig.crisis.number}.
          </p>
          <div>
            <Button type="button" variant="outline" onClick={startOver}>
              Make another request
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const current = bookingSteps[step]

  return (
    <form
      noValidate
      onSubmit={onFormSubmit}
      aria-labelledby="booking-form-title"
      className="grid gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-10"
    >
      <h3 id="booking-form-title" className="sr-only">
        Consultation request form
      </h3>

      <aside className="latte-surface organic-edge-alt relative overflow-hidden p-6 sm:p-7 lg:sticky lg:top-28 lg:self-start">
        <p className="type-eyebrow text-coffee-deep">Your consultation</p>
        <div className="mt-4 flex items-start gap-3" aria-live="polite">
          <CalendarHeart className="mt-1 size-6 shrink-0 text-burgundy" aria-hidden="true" />
          <p className="font-serif text-2xl leading-tight text-shadow">
            {selectedDate ? formatAppointmentDate(selectedDate) : 'No date chosen yet'}
          </p>
        </div>

        <Separator className="my-6 bg-shadow/15" />

        <p className="mb-3 text-sm font-semibold text-shadow lg:hidden">
          Step {step + 1} of {bookingSteps.length}: {current.title}
        </p>
        <div className="h-1 overflow-hidden rounded-full bg-shadow/10 lg:hidden" aria-hidden="true">
          <div
            className="h-full rounded-full bg-burgundy transition-[width] duration-500 ease-(--ease-paper)"
            style={{ width: `${((step + 1) / bookingSteps.length) * 100}%` }}
          />
        </div>

        <ol className="hidden gap-1 lg:grid" aria-label="Booking steps">
          {bookingSteps.map((s, index) => {
            const done = index < step
            const active = index === step
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => (index < step ? goTo(index) : undefined)}
                  disabled={index > step}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-full px-2 py-2 text-left text-[0.95rem] transition-colors',
                    active && 'font-semibold text-shadow',
                    done && 'cursor-pointer text-shadow/80 hover:bg-shadow/5',
                    index > step && 'text-shadow/70',
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex size-7 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums transition-colors',
                      active && 'border-burgundy bg-burgundy text-paper',
                      done && 'border-shadow/40 bg-shadow/5',
                      index > step && 'border-shadow/25',
                    )}
                  >
                    {done ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
                  </span>
                  {s.title}
                  {done ? <span className="sr-only">(completed)</span> : null}
                </button>
              </li>
            )
          })}
        </ol>

        <p className="type-hand mt-6 hidden text-xl text-burgundy lg:block">no pressure — take your time</p>
      </aside>

      <div className="paper-surface organic-edge relative min-w-0 p-5 sm:p-8 lg:p-10">
        <div ref={panelRef} className="grid gap-7">
          <header className="grid gap-2">
            <p className="type-eyebrow text-coffee">
              Step {step + 1} of {bookingSteps.length}
            </p>
            <h4 ref={headingRef} tabIndex={-1} className="type-h3 outline-none">
              {current.title}
            </h4>
          </header>

          {current.id === 'date' ? (
            <div className="grid gap-6">
              <p className="text-[0.95rem] leading-relaxed text-shadow/80">
                Pick a day that feels manageable. We’re open Monday to Saturday, and we’ll confirm the exact time with you.
              </p>
              <div
                className={cn(
                  'mx-auto w-full max-w-md rounded-[1.5rem] border bg-[#fffaf1]/70 p-3 sm:p-5',
                  errors.date ? 'border-destructive/50' : 'border-coffee/15',
                )}
                aria-describedby={errors.date ? 'appointment-date-error' : undefined}
              >
                {range ? (
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={selectDate}
                    defaultMonth={selectedDate ?? range.from}
                    startMonth={range.from}
                    endMonth={range.to}
                    disabled={[{ before: range.from }, { after: range.to }, isClosedDay]}
                    aria-label="Choose your preferred consultation date"
                  />
                ) : (
                  <div aria-busy="true" aria-label="Loading calendar" className="grid aspect-square w-full animate-pulse place-items-center rounded-2xl bg-latte/30">
                    <CalendarHeart className="size-8 text-coffee/50" aria-hidden="true" />
                  </div>
                )}
              </div>
              <BookingField
                id="appointment-date"
                label="Prefer to type? Enter a date"
                hint="Format: day, month, year. Sundays are unavailable."
                error={errors.date?.message}
              >
                {(aria) => (
                  <Input
                    {...aria}
                    type="date"
                    name="appointment-date"
                    min={range ? format(range.from, ISO) : undefined}
                    max={range ? format(range.to, ISO) : undefined}
                    value={selectedDate ? format(selectedDate, ISO) : ''}
                    onChange={(event) => onNativeDate(event.target.value)}
                    className="max-w-xs"
                  />
                )}
              </BookingField>
            </div>
          ) : null}

          {current.id === 'about' ? (
            <div className="grid gap-6">
              <BookingField id="name" label="Full name" error={errors.name?.message}>
                {(aria) => <Input {...aria} {...register('name')} type="text" autoComplete="name" placeholder="e.g. Priya Sharma" />}
              </BookingField>
              <BookingField
                id="street-address"
                label="Address"
                hint="Your area and city help us suggest the most convenient option."
                error={errors.address?.message}
              >
                {(aria) => (
                  <Input {...aria} {...register('address')} type="text" autoComplete="street-address" placeholder="House, street, area, city" />
                )}
              </BookingField>
            </div>
          ) : null}

          {current.id === 'concern' ? (
            <div className="grid gap-4">
              <BookingField
                id="description"
                label="What would you like support with?"
                hint={
                  <>
                    A few words are enough — for example, “I’ve been feeling anxious at work and can’t sleep.”{' '}
                    <span className="tabular-nums">
                      ({concernLength}/{CONCERN_MAX})
                    </span>
                  </>
                }
                error={errors.concern?.message}
              >
                {(aria) => (
                  <Textarea
                    {...aria}
                    {...register('concern')}
                    maxLength={CONCERN_MAX}
                    placeholder="Share as much or as little as you’re comfortable with."
                  />
                )}
              </BookingField>
              <PrivacyDialog />
            </div>
          ) : null}

          {current.id === 'contact' ? (
            <div className="grid gap-6">
              <BookingField id="tel" label="Phone number" hint="We’ll call to confirm your appointment time." error={errors.phone?.message}>
                {(aria) => (
                  <Input {...aria} {...register('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" />
                )}
              </BookingField>
              <BookingField
                id="email"
                label="Email"
                optional
                error={errors.email?.message}
                labelAddon={
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Why we ask for email"
                        className="inline-flex size-7 items-center justify-center rounded-full text-coffee hover:bg-shadow/5 hover:text-burgundy"
                      >
                        <Info className="size-4" aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Only used to send your appointment confirmation.</TooltipContent>
                  </Tooltip>
                }
              >
                {(aria) => <Input {...aria} {...register('email')} type="email" autoComplete="email" placeholder="you@example.com" />}
              </BookingField>
            </div>
          ) : null}

          {current.id === 'review' ? (
            <div className="grid gap-6">
              <p className="text-[0.95rem] leading-relaxed text-shadow/80">
                Please check your details. Selecting <strong>Contact Us</strong> sends this request to our care team.
              </p>
              <dl className="divide-y divide-coffee/15 rounded-2xl border border-coffee/15 bg-[#fffaf1]/60">
                {[
                  { label: 'Preferred date', value: selectedDate ? formatAppointmentDate(selectedDate) : '—', step: 0 },
                  { label: 'Name', value: values.name, step: 1 },
                  { label: 'Address', value: values.address, step: 1 },
                  { label: 'Concern', value: values.concern, step: 2 },
                  { label: 'Phone', value: values.phone, step: 3 },
                  { label: 'Email', value: values.email || 'Not provided', step: 3 },
                ].map((row) => (
                  <div key={row.label} className="grid gap-1 px-4 py-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-start sm:gap-4 sm:px-5">
                    <dt className="text-sm font-semibold text-coffee">{row.label}</dt>
                    <dd className="min-w-0 text-[0.95rem] break-words whitespace-pre-line text-shadow">{row.value || '—'}</dd>
                    <dd className="sm:text-right">
                      <Button type="button" variant="ghost" size="xs" onClick={() => goTo(row.step)} className="-ml-2.5 sm:ml-0">
                        <PencilLine aria-hidden="true" />
                        Edit <span className="sr-only">{row.label.toLowerCase()}</span>
                      </Button>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="grid gap-2">
                <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-[0.95rem] leading-relaxed text-shadow">
                  <input
                    id="consent"
                    type="checkbox"
                    {...register('consent')}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? 'consent-error' : undefined}
                    className="mt-1 size-5 shrink-0 cursor-pointer accent-burgundy"
                  />
                  I agree that  Paper ,Skin & Synapses may contact me by phone or email about this request.
                </label>
                {errors.consent ? (
                  <p id="consent-error" className="pl-8 text-sm font-medium text-destructive">
                    {errors.consent.message}
                  </p>
                ) : null}
              </div>

              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Leave this field empty</label>
                <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>

              {errorMessage ? (
                <Alert variant="destructive">
                  <Info aria-hidden="true" />
                  <AlertTitle>Your request wasn’t sent</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              ) : null}
            </div>
          ) : null}

          <Separator className="bg-coffee/15" />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={() => goTo(step - 1)}>
                <ArrowLeft aria-hidden="true" />
                Back
              </Button>
            ) : (
              <span className="hidden sm:block" />
            )}
            {step < lastStep ? (
              <Button type="submit" size="lg">
                Continue to {bookingSteps[step + 1].title.toLowerCase()}
                <ArrowRight aria-hidden="true" />
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={status === 'submitting'} aria-describedby="contact-us-hint">
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Contact Us
                    <Send aria-hidden="true" />
                  </>
                )}
              </Button>
            )}
          </div>
          {step === lastStep ? (
            <p id="contact-us-hint" className="-mt-4 text-right text-xs text-coffee">
              Sends your consultation request to our care team.
            </p>
          ) : null}
        </div>
      </div>
    </form>
  )
}
