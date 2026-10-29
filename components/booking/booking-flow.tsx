'use client'

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import { useForm, useWatch, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ArrowLeft, ArrowRight, CalendarHeart, Check, Clock, Compass, Info, Loader2, Monitor, PencilLine, Send } from 'lucide-react'
import { enquiryLabel, enquiryTypes, type EnquiryType } from '@/data/content'
import {
  bookingSchema,
  bookingSteps,
  bookingWindow,
  ENQUIRY_VALUES,
  isUnavailableDay,
  MESSAGE_MAX,
  type BookingFormInput,
  type BookingFormValues,
} from '@/lib/booking/schema'
import {
  BookingApiError,
  createBooking,
  fetchCalendar,
  fetchDay,
  formFieldFor,
  SERVICE_FOR_ENQUIRY,
  toIsoDate,
  type ApiDay,
  type ApiDaySummary,
} from '@/lib/booking/api'
import { formatAppointmentDate, formatSlot, isSlotAvailable, slotsFor } from '@/lib/booking/slots'
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
import { TimeSlotPicker } from './time-slot-picker'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const defaultValues: Partial<BookingFormInput> = {
  time: '',
  name: '',
  organisation: '',
  message: '',
  phone: '',
  email: '',
  consent: false,
  website: '',
}

const MESSAGE_HINTS: Record<EnquiryType, string> = {
  individual: 'For example, what you would like to talk through and anything you would like me to know before we speak.',
  organisation: 'For example, your organisation, the audience, your goals and any timelines you have in mind.',
  talk: 'For example, the event, intended audience, area of interest and proposed date.',
  research: 'For example, the research area, the current stage of the project and the kind of collaboration you have in mind.',
  other: 'A few lines about what you have in mind is enough. We can work out the details together.',
}

const ISO = 'yyyy-MM-dd'
const lastStep = bookingSteps.length - 1

const subscribeNoop = () => () => {}
const getTodayKey = () => format(new Date(), ISO)
const getServerTodayKey = () => null

const isEnquiry = (value: string | null): value is EnquiryType => ENQUIRY_VALUES.some((type) => type === value)

export function BookingFlow() {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<{ slot: string; type: string; reference: string | null } | null>(null)
  // Live availability from the booking API; null until loaded (or if it can't be reached).
  const [calendar, setCalendar] = useState<Map<string, ApiDaySummary> | null>(null)
  const [day, setDay] = useState<{ key: string; data: ApiDay | null } | null>(null)
  const [reloadSlots, setReloadSlots] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const hasNavigated = useRef(false)
  const advanceTimer = useRef<number | null>(null)
  const todayKey = useSyncExternalStore(subscribeNoop, getTodayKey, getServerTodayKey)
  const range = useMemo(() => (todayKey ? bookingWindow() : null), [todayKey])
  const now = useMemo(() => (todayKey ? new Date() : null), [todayKey])

  const form = useForm<BookingFormInput, unknown, BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched',
    defaultValues,
  })
  const { register, control, setValue, setError, trigger, handleSubmit, reset, formState } = form
  const { errors } = formState
  const values = useWatch({ control })
  const selectedType = values.enquiryType
  const selectedDate = values.date instanceof Date ? values.date : undefined
  const selectedTime = values.time || undefined
  const messageLength = values.message?.length ?? 0

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get('enquiry')
    if (isEnquiry(preset)) setValue('enquiryType', preset, { shouldDirty: true })
  }, [setValue])

  useEffect(
    () => () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    },
    [],
  )

  const service = selectedType ? SERVICE_FOR_ENQUIRY[selectedType] : undefined
  const selectedKey = selectedDate ? toIsoDate(selectedDate) : null

  // Which days still have free slots, for the whole booking window.
  useEffect(() => {
    if (!range) return
    let active = true
    fetchCalendar(range.from, range.to, service)
      .then((days) => active && setCalendar(days))
      .catch(() => active && setCalendar(null))
    return () => {
      active = false
    }
  }, [range, service, reloadSlots])

  // The chosen day's slots, with the ones already booked marked unavailable.
  useEffect(() => {
    if (!selectedDate || !selectedKey) return
    let active = true
    fetchDay(selectedDate, service)
      .then((data) => {
        if (!active) return
        setDay({ key: selectedKey, data })
        const time = form.getValues('time')
        if (time && !data.slots.some((slot) => slot.time === time && slot.available)) setValue('time', '', { shouldDirty: true })
      })
      .catch(() => active && setDay({ key: selectedKey, data: null }))
    return () => {
      active = false
    }
    // selectedDate is represented by selectedKey; form is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, service, reloadSlots, setValue])

  const isUnavailable = isUnavailableDay(calendar, toIsoDate)
  const daySlots = day && day.key === selectedKey ? day : null
  const slotsLoading = Boolean(selectedKey) && !daySlots

  useGSAP(
    () => {
      if (!hasNavigated.current || !panelRef.current) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, x: 28 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform' },
        )
      })
      headingRef.current?.focus({ preventScroll: true })
      return () => mm.revert()
    },
    { dependencies: [step], scope: panelRef },
  )

  const goTo = (index: number) => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    hasNavigated.current = true
    setStep(Math.max(0, Math.min(lastStep, index)))
    setErrorMessage(null)
  }

  const goNext = async () => {
    const fields = [...bookingSteps[step].fields]
    const ok = await trigger(fields, { shouldFocus: true })
    if (ok) goTo(step + 1)
  }

  const scheduleAdvance = (to: number) => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    advanceTimer.current = window.setTimeout(() => goTo(to), 450)
  }

  const selectType = (type: EnquiryType) => {
    setValue('enquiryType', type, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    scheduleAdvance(1)
  }

  const selectDate = (date: Date | undefined) => {
    setValue('date', date as Date, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    const time = values.time
    if (!time) return
    const stillValid = date && slotsFor(date).some((slot) => slot.value === time) && (!now || isSlotAvailable(date, time, now))
    if (!stillValid) setValue('time', '', { shouldDirty: true })
  }

  const selectTime = (time: string) => {
    setValue('time', time, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    if (selectedDate) scheduleAdvance(2)
  }

  const onValid = async (data: BookingFormValues) => {
    setErrorMessage(null)
    if (data.website) {
      setStatus('success')
      return
    }
    setStatus('submitting')
    try {
      const { booking } = await createBooking(data)
      setConfirmed({
        slot: `${formatAppointmentDate(data.date)} at ${formatSlot(data.time)}`,
        type: enquiryLabel(data.enquiryType),
        reference: booking.reference ?? null,
      })
      setStatus('success')
      reset(defaultValues)
      setReloadSlots((n) => n + 1)
      requestAnimationFrame(() => successRef.current?.focus())
    } catch (error) {
      setStatus('error')
      if (!(error instanceof BookingApiError)) {
        setErrorMessage(`Your enquiry couldn’t be sent just now. Please try again, or email ${siteConfig.email}.`)
        return
      }
      if (error.code === 'SLOT_UNAVAILABLE') {
        // Someone took the slot meanwhile: refresh the times and send them back to pick another.
        setValue('time', '', { shouldDirty: true })
        setReloadSlots((n) => n + 1)
        goTo(1)
        setError('time', { message: error.message })
        return
      }
      const fields = Object.entries(error.fields)
      if (error.status === 422 && fields.length) {
        for (const [field, message] of fields) {
          const name = formFieldFor(field)
          if (name in defaultValues || name === 'date' || name === 'enquiryType') setError(name as keyof BookingFormInput, { message })
        }
        const firstStep = bookingSteps.findIndex((s) => s.fields.some((f) => fields.some(([field]) => formFieldFor(field) === f)))
        if (firstStep >= 0 && firstStep !== step) goTo(firstStep)
        setErrorMessage(error.message)
        return
      }
      setErrorMessage(
        error.code === 'NETWORK' || error.status >= 500
          ? `${error.message} You can also email ${siteConfig.email} or call ${siteConfig.phone}.`
          : error.message,
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
    setConfirmed(null)
    hasNavigated.current = true
    setStep(0)
  }

  if (status === 'success') {
    return (
      <div className="surface-card relative overflow-hidden rounded-[1rem] border border-coffee/12 p-8 sm:p-12" role="status" aria-live="polite">
        <span aria-hidden="true" className="absolute -top-16 -right-16 size-56 rounded-full bg-latte/40" />
        <div className="relative grid gap-6">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-burgundy text-paper">
            <Check className="size-7" aria-hidden="true" />
          </span>
          <h3 ref={successRef} tabIndex={-1} className="type-h2 max-w-xl outline-none">
            Thank you. Your enquiry has been sent.
          </h3>
          <p className="type-lead max-w-xl text-shadow/85">
            {confirmed ? (
              <>
                I’ve received your <strong className="font-semibold text-burgundy">{confirmed.type.toLowerCase()}</strong> enquiry for{' '}
                <strong className="font-semibold text-burgundy">{confirmed.slot}</strong>.{' '}
              </>
            ) : null}
            I’ll reply by email to confirm the slot and share the details for our online conversation.
          </p>
          {confirmed?.reference ? (
            <p className="text-[0.95rem] leading-relaxed text-shadow/85">
              Your reference is <strong className="font-semibold tracking-wide text-burgundy tabular-nums">{confirmed.reference}</strong>. I’ve also
              emailed you a link to view, change or cancel this request.
            </p>
          ) : null}
          <p className="text-sm text-coffee">
            Need to add something? Write to{' '}
            <a href={`mailto:${siteConfig.email}`} className="font-semibold text-burgundy underline underline-offset-4">
              {siteConfig.email}
            </a>
            . This form is not monitored for emergencies. If you need urgent support, see the helplines below.
          </p>
          <div>
            <Button type="button" variant="outline" onClick={startOver}>
              Send another enquiry
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
      className="grid gap-6 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] xl:gap-8"
    >
      <h3 id="booking-form-title" className="sr-only">
        Enquiry and booking form
      </h3>

      <aside className="relative overflow-hidden rounded-[1rem] bg-mahogany p-6 text-paper sm:p-7 xl:sticky xl:top-28 xl:self-start">
        <p className="type-eyebrow text-gold">Your enquiry</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1" aria-live="polite">
          <p className="flex items-start gap-3 font-serif text-xl leading-tight">
            <Compass className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
            {selectedType ? enquiryLabel(selectedType) : 'No enquiry type yet'}
          </p>
          <p className="flex items-start gap-3 font-serif text-xl leading-tight">
            <CalendarHeart className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
            {selectedDate ? formatAppointmentDate(selectedDate) : 'No date chosen yet'}
          </p>
          <p className="flex items-center gap-3 font-serif text-xl leading-tight">
            <Clock className="size-5 shrink-0 text-gold" aria-hidden="true" />
            {selectedTime ? `${formatSlot(selectedTime)} (IST)` : 'No time chosen yet'}
          </p>
        </div>

        <Separator className="my-6 bg-paper/15" />

        <p className="mb-3 text-sm font-semibold xl:hidden">
          Step {step + 1} of {bookingSteps.length}: {current.short}
        </p>
        <div className="h-1 overflow-hidden rounded-full bg-paper/15 xl:hidden" aria-hidden="true">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-500 ease-(--ease-paper)"
            style={{ width: `${((step + 1) / bookingSteps.length) * 100}%` }}
          />
        </div>

        <ol className="hidden gap-1 xl:grid" aria-label="Booking steps">
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
                    'flex w-full items-center gap-3 rounded-full px-2 py-2 text-left text-[0.92rem] transition-colors',
                    active && 'font-semibold text-paper',
                    done && 'cursor-pointer text-paper/80 hover:bg-paper/5',
                    index > step && 'text-paper/55',
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex size-7 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums transition-colors',
                      active && 'border-gold bg-gold text-shadow',
                      done && 'border-paper/40 bg-paper/10',
                      index > step && 'border-paper/25',
                    )}
                  >
                    {done ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
                  </span>
                  {s.short}
                  {done ? <span className="sr-only">(completed)</span> : null}
                </button>
              </li>
            )
          })}
        </ol>

        <p className="mt-6 hidden items-center gap-2 text-sm text-paper/70 xl:flex">
          <Monitor className="size-4 text-gold" aria-hidden="true" />
          All conversations take place online.
        </p>
      </aside>

      <div className="surface-card relative min-w-0 rounded-[1rem] border border-coffee/12 p-5 sm:p-8 lg:p-10">
        <div ref={panelRef} className="grid gap-7">
          <header className="grid gap-2">
            <p className="type-eyebrow text-coffee">
              Step {step + 1} of {bookingSteps.length}
            </p>
            <h4 ref={headingRef} tabIndex={-1} className="type-h3 outline-none">
              {current.title}
            </h4>
          </header>

          {current.id === 'type' ? (
            <fieldset className="grid gap-4" aria-describedby={errors.enquiryType ? 'enquiry-type-error' : undefined}>
              <legend className="mb-1 text-[0.95rem] leading-relaxed text-shadow/80">
                Choose the option closest to what you have in mind. You can explain the details later.
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {enquiryTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <label key={type.value} className={cn('relative', type.value === 'other' && 'sm:col-span-2')}>
                      <input
                        type="radio"
                        name="enquiry-type"
                        value={type.value}
                        checked={selectedType === type.value}
                        onChange={() => selectType(type.value)}
                        className="peer sr-only"
                      />
                      <span
                        className={cn(
                          'flex h-full cursor-pointer items-start gap-4 rounded-[0.8rem] border border-coffee/20 bg-paper/40 p-4 transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-(--ease-paper)',
                          'hover:-translate-y-0.5 hover:border-burgundy/60',
                          'peer-checked:border-burgundy peer-checked:bg-burgundy peer-checked:text-paper peer-checked:shadow-[0_14px_26px_-16px_rgb(106_31_38/0.9)]',
                          'peer-focus-visible:ring-[3px] peer-focus-visible:ring-burgundy/35',
                          '[&_.hint]:text-coffee peer-checked:[&_.hint]:text-paper/75 [&_.icon]:bg-burgundy/10 [&_.icon]:text-burgundy peer-checked:[&_.icon]:bg-paper/15 peer-checked:[&_.icon]:text-paper',
                        )}
                      >
                        <span className="icon inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors">
                          <Icon className="size-4.5" aria-hidden="true" />
                        </span>
                        <span className="grid gap-1">
                          <span className="text-[0.98rem] leading-snug font-semibold">{type.label}</span>
                          <span className="hint text-sm leading-snug">{type.hint}</span>
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
              {errors.enquiryType ? (
                <p id="enquiry-type-error" className="text-sm font-medium text-destructive">
                  {errors.enquiryType.message}
                </p>
              ) : null}
            </fieldset>
          ) : null}

          {current.id === 'date' ? (
            <div className="grid gap-5">
              <p className="text-[0.95rem] leading-relaxed text-shadow/80">
                Pick a day, then a time that works for you. Days without free slots are greyed out, and all times are in IST. Once you
                choose a slot, you’ll move to the next step.
              </p>
              <div className="grid items-stretch gap-5 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                <div
                  className={cn(
                    'w-full min-w-0 rounded-[1.25rem] border bg-[#fffaf1]/70 p-3 sm:p-5',
                    errors.date ? 'border-destructive/50' : 'border-coffee/15',
                  )}
                >
                  {range ? (
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={selectDate}
                      defaultMonth={selectedDate ?? range.from}
                      startMonth={range.from}
                      endMonth={range.to}
                      disabled={[{ before: range.from }, { after: range.to }, isUnavailable]}
                      aria-label="Choose your preferred date"
                      className="[--cell-size:2.6rem] sm:[--cell-size:2.9rem]"
                    />
                  ) : (
                    <div
                      aria-busy="true"
                      aria-label="Loading calendar"
                      className="grid aspect-square w-full animate-pulse place-items-center rounded-2xl bg-latte/30"
                    >
                      <CalendarHeart className="size-8 text-coffee/50" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <TimeSlotPicker
                  date={selectedDate}
                  value={selectedTime}
                  now={now}
                  error={errors.time?.message}
                  apiSlots={daySlots?.data?.slots}
                  loading={slotsLoading}
                  onChange={selectTime}
                />
              </div>
              {errors.date || errors.time ? (
                <div className="grid gap-1">
                  {errors.date ? (
                    <p id="appointment-date-error" className="text-sm font-medium text-destructive">
                      {errors.date.message}
                    </p>
                  ) : null}
                  {errors.time ? (
                    <p id="appointment-time-error" className="text-sm font-medium text-destructive">
                      {errors.time.message}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {current.id === 'details' ? (
            <div className="grid gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <BookingField id="name" label="Full name" error={errors.name?.message}>
                  {(aria) => <Input {...aria} {...register('name')} type="text" autoComplete="name" placeholder="e.g. Priya Sharma" />}
                </BookingField>
                <BookingField id="organization" label="Organisation or institution" optional error={errors.organisation?.message}>
                  {(aria) => (
                    <Input {...aria} {...register('organisation')} type="text" autoComplete="organization" placeholder="School, company, university" />
                  )}
                </BookingField>
              </div>
              <BookingField
                id="description"
                label="What would you like to discuss?"
                hint={
                  <>
                    {MESSAGE_HINTS[selectedType ?? 'other']}{' '}
                    <span className="tabular-nums">
                      ({messageLength}/{MESSAGE_MAX})
                    </span>
                  </>
                }
                error={errors.message?.message}
              >
                {(aria) => (
                  <Textarea {...aria} {...register('message')} maxLength={MESSAGE_MAX} placeholder="Share as much or as little as you’re comfortable with." />
                )}
              </BookingField>
              <PrivacyDialog />
            </div>
          ) : null}

          {current.id === 'contact' ? (
            <div className="grid gap-6">
              <BookingField
                id="email"
                label="Email"
                hint="I’ll reply to this address to confirm your slot and next steps."
                error={errors.email?.message}
              >
                {(aria) => <Input {...aria} {...register('email')} type="email" autoComplete="email" placeholder="you@example.com" />}
              </BookingField>
              <BookingField
                id="tel"
                label="Phone number"
                optional
                error={errors.phone?.message}
                labelAddon={
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Why I ask for a phone number"
                        className="inline-flex size-7 items-center justify-center rounded-full text-coffee hover:bg-shadow/5 hover:text-burgundy"
                      >
                        <Info className="size-4" aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Only used if I need to reach you quickly about your slot.</TooltipContent>
                  </Tooltip>
                }
              >
                {(aria) => <Input {...aria} {...register('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" />}
              </BookingField>
            </div>
          ) : null}

          {current.id === 'review' ? (
            <div className="grid gap-6">
              <p className="text-[0.95rem] leading-relaxed text-shadow/80">
                Please check your details. Selecting <strong>Send enquiry</strong> sends this to me and holds your slot until I confirm it by
                email.
              </p>
              <dl className="divide-y divide-coffee/15 rounded-2xl border border-coffee/15 bg-[#fffaf1]/60">
                {[
                  { label: 'Enquiry type', value: enquiryLabel(selectedType), step: 0 },
                  { label: 'Preferred date', value: selectedDate ? formatAppointmentDate(selectedDate) : '', step: 1 },
                  { label: 'Preferred time', value: selectedTime ? `${formatSlot(selectedTime)} (IST)` : '', step: 1 },
                  { label: 'Name', value: values.name, step: 2 },
                  { label: 'Organisation', value: values.organisation || 'Not provided', step: 2 },
                  { label: 'Your enquiry', value: values.message, step: 2 },
                  { label: 'Email', value: values.email, step: 3 },
                  { label: 'Phone', value: values.phone || 'Not provided', step: 3 },
                ].map((row) => (
                  <div key={row.label} className="grid gap-1 px-4 py-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-start sm:gap-4 sm:px-5">
                    <dt className="text-sm font-semibold text-coffee">{row.label}</dt>
                    <dd className="min-w-0 text-[0.95rem] break-words whitespace-pre-line text-shadow">{row.value || 'Not provided'}</dd>
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
                  <span>
                    I agree that my details and message will be stored and used to arrange and manage this booking, and that{' '}
                    {siteConfig.psychologist.name} may contact me by email or phone about it, as described in the{' '}
                    <a
                      href="/legal/privacy/"
                      target="_blank"
                      rel="noopener"
                      className="font-semibold text-burgundy underline underline-offset-4 hover:decoration-2"
                    >
                      privacy policy
                    </a>
                    . I understand this form is not for emergencies.
                  </span>
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
                  <AlertTitle>Your enquiry wasn’t sent</AlertTitle>
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
                Continue
                <ArrowRight aria-hidden="true" />
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={status === 'submitting'}>
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send enquiry
                    <Send aria-hidden="true" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
