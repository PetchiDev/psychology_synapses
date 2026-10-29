'use client'

import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ArrowLeft, CalendarHeart, CalendarX2, Clock, Compass, Info, Loader2, Monitor, RefreshCw } from 'lucide-react'
import {
  BookingApiError,
  cancelBooking,
  fetchCalendar,
  fetchDay,
  getBooking,
  rescheduleBooking,
  toIsoDate,
  type ApiBooking,
  type ApiDay,
  type ApiDaySummary,
  type BookingStatus,
} from '@/lib/booking/api'
import { bookingWindow, isUnavailableDay } from '@/lib/booking/schema'
import { formatAppointmentDate, formatSlot } from '@/lib/booking/slots'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { TimeSlotPicker } from './time-slot-picker'

const STATUS: Record<BookingStatus, { label: string; note: string; tone: 'waiting' | 'good' | 'closed' }> = {
  pending: { label: 'Waiting for confirmation', note: 'Your slot is held. I’ll confirm it by email, usually within one working day.', tone: 'waiting' },
  confirmed: { label: 'Confirmed', note: 'See you then. The details for our online conversation are in your confirmation email.', tone: 'good' },
  declined: { label: 'Not available', note: 'I couldn’t offer this time. Please book another slot, or write to me.', tone: 'closed' },
  cancelled: { label: 'Cancelled', note: 'This booking has been cancelled. You’re welcome to book again whenever you’re ready.', tone: 'closed' },
  completed: { label: 'Completed', note: 'Thank you for our conversation.', tone: 'closed' },
  no_show: { label: 'Missed', note: 'We didn’t manage to meet at this time. You’re welcome to book again.', tone: 'closed' },
}

type Load = { state: 'loading' } | { state: 'missing' } | { state: 'error'; message: string } | { state: 'ready'; booking: ApiBooking }

// The link's query string and the page's "now", read once in the browser (both are absent while prerendering).
// Cached because the token is removed from the address bar straight after it is read.
let firstSearch: string | null = null
let firstNow: number | null = null
const subscribeNoop = () => () => {}
const getSearch = () => (firstSearch ??= window.location.search)
const getNow = () => (firstNow ??= Date.now())
const getServerNull = () => null

/** The patient's page behind the link in their email: /booking/manage/?ref=PSS-…&token=… */
export function ManageBooking() {
  const search = useSyncExternalStore(subscribeNoop, getSearch, getServerNull)
  const now = useSyncExternalStore(subscribeNoop, getNow, getServerNull)
  const creds = useMemo(() => {
    if (search === null) return null
    const params = new URLSearchParams(search)
    const ref = params.get('ref')?.trim() ?? ''
    const token = params.get('token')?.trim() ?? ''
    return ref && token ? { ref, token } : null
  }, [search])
  const [fetched, setFetched] = useState<Load | null>(null)
  const [mode, setMode] = useState<'view' | 'reschedule'>('view')
  const [notice, setNotice] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    if (!creds) return
    // Keep the token out of the address bar, history and any shared screenshots.
    window.history.replaceState(null, '', window.location.pathname)
    getBooking(creds.ref, creds.token)
      .then((booking) => setFetched({ state: 'ready', booking }))
      .catch((error) =>
        setFetched(error instanceof BookingApiError && error.status === 404 ? { state: 'missing' } : { state: 'error', message: errorText(error) }),
      )
  }, [creds])

  const load: Load = search === null ? { state: 'loading' } : !creds ? { state: 'missing' } : (fetched ?? { state: 'loading' })
  const setLoad = setFetched

  if (load.state === 'loading') {
    return (
      <Card>
        <p className="flex items-center gap-3 text-[0.95rem] text-coffee" role="status">
          <Loader2 className="size-5 animate-spin text-burgundy" aria-hidden="true" />
          Finding your booking…
        </p>
      </Card>
    )
  }

  if (load.state === 'missing' || load.state === 'error') {
    return (
      <Card>
        <div className="grid gap-4">
          <h2 className="type-h3">{load.state === 'missing' ? 'We couldn’t find this booking' : 'Something went wrong'}</h2>
          <p className="text-[0.95rem] leading-relaxed text-shadow/85">
            {load.state === 'missing'
              ? 'Please open the link from your email again. If it still doesn’t work, write to me and I’ll help.'
              : load.message}
          </p>
          <p className="text-sm text-coffee">
            <a href={`mailto:${siteConfig.email}`} className="font-semibold text-burgundy underline underline-offset-4">
              {siteConfig.email}
            </a>{' '}
            · {siteConfig.phone}
          </p>
        </div>
      </Card>
    )
  }

  const booking = load.booking
  const status = STATUS[booking.status]
  const start = new Date(booking.startsAt)
  const canChange = booking.status === 'pending' || booking.status === 'confirmed'
  const started = now !== null && start.getTime() <= now

  const update = (next: ApiBooking, message: string) => {
    setLoad({ state: 'ready', booking: next })
    setNotice(message)
    setActionError(null)
    setMode('view')
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] xl:gap-8">
      <aside className="relative overflow-hidden rounded-[1rem] bg-mahogany p-6 text-paper sm:p-7 xl:self-start">
        <p className="type-eyebrow text-gold">Your booking</p>
        <p className="mt-3 font-serif text-2xl tracking-wide tabular-nums">{booking.reference}</p>
        <div className="mt-5 grid gap-3">
          <p className="flex items-start gap-3 font-serif text-xl leading-tight">
            <Compass className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
            {booking.service?.name ?? 'Conversation'}
          </p>
          <p className="flex items-start gap-3 font-serif text-xl leading-tight">
            <CalendarHeart className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
            {formatAppointmentDate(start)}
          </p>
          <p className="flex items-center gap-3 font-serif text-xl leading-tight">
            <Clock className="size-5 shrink-0 text-gold" aria-hidden="true" />
            {formatSlot(booking.time)} (IST)
          </p>
        </div>
        <Separator className="my-6 bg-paper/15" />
        <p className="flex items-center gap-2 text-sm text-paper/70">
          <Monitor className="size-4 text-gold" aria-hidden="true" />
          All conversations take place online.
        </p>
      </aside>

      <Card>
        {mode === 'view' ? (
          <div className="grid gap-6">
            <div className="grid gap-3">
              <p className="type-eyebrow text-coffee">Status</p>
              <p
                className={cn(
                  'inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold',
                  status.tone === 'good' && 'bg-burgundy text-paper',
                  status.tone === 'waiting' && 'bg-gold/25 text-shadow',
                  status.tone === 'closed' && 'bg-coffee/12 text-coffee',
                )}
              >
                {status.label}
              </p>
              <p className="type-lead max-w-xl text-shadow/85">{status.note}</p>
            </div>

            {booking.message ? (
              <blockquote className="rounded-2xl border border-coffee/15 bg-[#fffaf1]/70 p-5 text-[0.95rem] leading-relaxed text-shadow">
                <span className="type-eyebrow mb-2 block text-[0.62rem] text-coffee">A note from me</span>
                {booking.message}
              </blockquote>
            ) : null}

            {notice ? (
              <Alert>
                <Info aria-hidden="true" />
                <AlertTitle>Done</AlertTitle>
                <AlertDescription>{notice}</AlertDescription>
              </Alert>
            ) : null}
            {actionError ? (
              <Alert variant="destructive">
                <Info aria-hidden="true" />
                <AlertTitle>That didn’t work</AlertTitle>
                <AlertDescription>{actionError}</AlertDescription>
              </Alert>
            ) : null}

            {canChange && !started && creds ? (
              <>
                <Separator className="bg-coffee/15" />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="button" size="lg" onClick={() => setMode('reschedule')}>
                    <RefreshCw aria-hidden="true" />
                    Choose another time
                  </Button>
                  <CancelDialog
                    onConfirm={async (reason) => {
                      try {
                        update(await cancelBooking(creds.ref, creds.token, reason), 'Your booking is cancelled, and the slot is free again.')
                      } catch (error) {
                        setActionError(errorText(error))
                      }
                    }}
                  />
                </div>
              </>
            ) : null}

            <p className="text-sm text-coffee">
              Questions about your booking? Write to{' '}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold text-burgundy underline underline-offset-4">
                {siteConfig.email}
              </a>
              . This page is not monitored for emergencies.
            </p>
          </div>
        ) : creds ? (
          <Reschedule
            booking={booking}
            onBack={() => setMode('view')}
            onSave={async (date, time) => {
              const next = await rescheduleBooking(creds.ref, creds.token, date, time)
              update(next, 'Your new time is held. I’ll confirm it by email.')
            }}
          />
        ) : null}
      </Card>
    </div>
  )
}

function Reschedule({ booking, onBack, onSave }: { booking: ApiBooking; onBack: () => void; onSave: (date: Date, time: string) => Promise<void> }) {
  const range = useMemo(() => bookingWindow(), [])
  const service = booking.service?.slug
  const [calendar, setCalendar] = useState<Map<string, ApiDaySummary> | null>(null)
  const [date, setDate] = useState<Date | undefined>()
  const [day, setDay] = useState<{ key: string; data: ApiDay | null } | null>(null)
  const [time, setTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const key = date ? toIsoDate(date) : null

  useEffect(() => {
    let active = true
    fetchCalendar(range.from, range.to, service)
      .then((days) => active && setCalendar(days))
      .catch(() => active && setCalendar(null))
    return () => {
      active = false
    }
  }, [range, service])

  useEffect(() => {
    if (!date || !key) return
    let active = true
    fetchDay(date, service)
      .then((data) => active && setDay({ key, data }))
      .catch(() => active && setDay({ key, data: null }))
    return () => {
      active = false
    }
    // date is represented by key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, service])

  const unavailable = isUnavailableDay(calendar, toIsoDate)

  const save = async () => {
    if (!date || !time) {
      setError('Please choose a new date and time.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave(date, time)
    } catch (e) {
      setError(errorText(e))
      setTime('')
      // The slot may have been taken meanwhile: show that day's current slots again.
      const dayKey = toIsoDate(date)
      fetchDay(date, service)
        .then((data) => setDay({ key: dayKey, data }))
        .catch(() => undefined)
    } finally {
      setSaving(false)
    }
  }

  const current = day && day.key === key ? day : null

  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <p className="type-eyebrow text-coffee">Change your time</p>
        <h2 className="type-h3">Choose a new date & time</h2>
        <p className="text-[0.95rem] leading-relaxed text-shadow/80">
          Days without free slots are greyed out, and all times are in IST. Your current time stays booked until you save a new one, and the
          new time will need my confirmation again.
        </p>
      </header>
      <div className="grid items-stretch gap-5 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="w-full min-w-0 rounded-[1.25rem] border border-coffee/15 bg-[#fffaf1]/70 p-3 sm:p-5">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d)
              setTime('')
            }}
            defaultMonth={range.from}
            startMonth={range.from}
            endMonth={range.to}
            disabled={[{ before: range.from }, { after: range.to }, unavailable]}
            aria-label="Choose a new date"
            className="[--cell-size:2.6rem] sm:[--cell-size:2.9rem]"
          />
        </div>
        <TimeSlotPicker date={date} value={time} now={null} apiSlots={current?.data?.slots} loading={Boolean(key) && !current} onChange={setTime} />
      </div>
      {error ? (
        <Alert variant="destructive">
          <Info aria-hidden="true" />
          <AlertTitle>Your time wasn’t changed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <Separator className="bg-coffee/15" />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
        <Button type="button" size="lg" disabled={saving || !date || !time} onClick={save}>
          {saving ? <Loader2 className="animate-spin" aria-hidden="true" /> : <RefreshCw aria-hidden="true" />}
          {date && time ? `Move to ${formatSlot(time)}, ${formatAppointmentDate(date)}` : 'Save new time'}
        </Button>
      </div>
    </div>
  )
}

function CancelDialog({ onConfirm }: { onConfirm: (reason: string) => Promise<void> }) {
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="lg" variant="outline">
          <CalendarX2 aria-hidden="true" />
          Cancel booking
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogDescription>The slot will be freed for someone else. You can always book again later.</DialogDescription>
        </DialogHeader>
        <label htmlFor="cancel-reason" className="grid gap-2 text-sm font-semibold text-coffee">
          Anything you’d like me to know? (optional)
          <Textarea id="cancel-reason" value={reason} maxLength={500} onChange={(e) => setReason(e.target.value)} />
        </label>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Keep my booking
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true)
                await onConfirm(reason.trim())
                setBusy(false)
              }}
            >
              Yes, cancel it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Card({ children }: { children: ReactNode }) {
  return <div className="surface-card relative min-w-0 rounded-[1rem] border border-coffee/12 p-6 sm:p-8 lg:p-10">{children}</div>
}

const errorText = (error: unknown) =>
  error instanceof BookingApiError ? error.message : `Something went wrong. Please try again, or email ${siteConfig.email}.`
