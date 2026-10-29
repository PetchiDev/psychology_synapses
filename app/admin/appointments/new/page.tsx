'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { addDays, format, parseISO } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { BookingApiError, fetchDay, type ApiDay } from '@/lib/booking/api'
import { cms } from '@/lib/cms/api'
import type { AdminService, Mode, PhoneBookingInput } from '@/lib/cms/types'
import { TimeSlotPicker } from '@/components/booking/time-slot-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const EMPTY = { name: '', phone: '', email: '', organisation: '', message: '' }

export default function NewPhoneBookingPage() {
  const router = useRouter()
  const [today] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [services, setServices] = useState<AdminService[]>([])
  const [chosenService, setChosenService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [mode, setMode] = useState<Mode>('video')
  const [contact, setContact] = useState(EMPTY)
  const [confirmNow, setConfirmNow] = useState(true)
  const [day, setDay] = useState<{ key: string; data: ApiDay | null; error: string | null } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const active = useMemo(() => services.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [services])
  const service = chosenService || active[0]?.slug || ''
  const [refresh, setRefresh] = useState(0)
  const dayKey = date && service ? `${date}|${service}|${refresh}` : null
  const loadingDay = dayKey !== null && day?.key !== dayKey
  const currentDay = dayKey !== null && day?.key === dayKey ? day : null

  useEffect(() => {
    cms
      .services()
      .then(setServices)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load services.'))
  }, [])

  useEffect(() => {
    if (!dayKey) return
    let alive = true
    fetchDay(parseISO(date), service)
      .then((data) => alive && setDay({ key: dayKey, data, error: null }))
      .catch((e) => alive && setDay({ key: dayKey, data: null, error: e instanceof Error ? e.message : 'Could not load times.' }))
    return () => {
      alive = false
    }
  }, [dayKey, date, service])

  async function submit() {
    setBusy(true)
    setError(null)
    setFieldErrors({})
    try {
      const body: PhoneBookingInput = { service, date, time, mode, name: contact.name.trim() }
      for (const key of ['phone', 'email', 'organisation', 'message'] as const) {
        const value = contact[key].trim()
        if (value) body[key] = value
      }
      const { booking } = await cms.createAppointment(body)
      // The booking now exists, so a failure below must not look like a failed booking.
      let matchId: number | undefined
      let confirmed = false
      try {
        // The create call returns the patient-facing booking; look it up by reference for the staff id.
        const match = (await cms.appointments({ q: booking.reference, perPage: 5 })).data.find((a) => a.reference === booking.reference)
        matchId = match?.id
        if (match && confirmNow) {
          await cms.act(match.id, 'confirm', { mode })
          confirmed = true
        }
      } catch {
        // Go to the booking (or the waiting list) anyway, where it can be confirmed by hand.
      }
      router.push(matchId ? `/admin/appointments/view/?id=${matchId}` : `/admin/appointments/?tab=${confirmed ? 'upcoming' : 'waiting'}`)
    } catch (e) {
      if (e instanceof BookingApiError && e.status === 422) setFieldErrors(e.fields)
      if (e instanceof BookingApiError && e.code === 'SLOT_UNAVAILABLE') {
        setTime('')
        setRefresh((n) => n + 1)
      }
      setError(e instanceof Error ? e.message : 'Could not save the booking.')
      setBusy(false)
    }
  }

  const field = (key: keyof typeof EMPTY) => ({
    id: key,
    value: contact[key],
    onChange: (e: { target: { value: string } }) => setContact((c) => ({ ...c, [key]: e.target.value })),
  })
  const fieldError = (key: string) => (fieldErrors[key] ? <p className="text-sm text-burgundy">{fieldErrors[key]}</p> : null)
  const hasContact = Boolean(contact.phone.trim() || contact.email.trim())

  return (
    <div className="grid gap-7">
      <Link href="/admin/appointments/" className="inline-flex items-center gap-2 text-sm text-burgundy hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Appointments
      </Link>
      <header className="grid gap-2">
        <p className="type-eyebrow text-burgundy">Bookings</p>
        <h1 className="font-serif text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-semibold text-shadow">New phone booking</h1>
        <p className="max-w-2xl text-shadow/70">
          For a booking taken by phone or in person. The same free times as the website are offered, and the patient gets the usual emails if you
          enter their email address.
        </p>
      </header>

      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}

      <form
        className="grid gap-6 xl:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          void submit()
        }}
      >
        <section className="surface-card grid content-start gap-4 rounded-[1rem] border border-coffee/12 p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-shadow">When</h2>
          <div className="grid gap-2">
            <Label htmlFor="service">Service</Label>
            <select
              id="service"
              value={service}
              onChange={(e) => {
                setChosenService(e.target.value)
                setTime('')
              }}
              className="h-11 w-full min-w-0 rounded-[0.5rem] border border-coffee/20 bg-paper px-3"
            >
              {active.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name} ({s.durationMinutes} min)
                </option>
              ))}
            </select>
            {fieldError('service')}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                required
                min={today}
                max={format(addDays(parseISO(today), 365), 'yyyy-MM-dd')}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setTime('')
                }}
              />
              {fieldError('date')}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mode">Session</Label>
              <select id="mode" value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="h-11 rounded-[0.5rem] border border-coffee/20 bg-paper px-3">
                <option value="video">Video call</option>
                <option value="in_person">In person</option>
              </select>
              {fieldError('mode')}
            </div>
          </div>
          {currentDay?.error ? (
            <p className="text-sm text-burgundy">{currentDay.error}</p>
          ) : currentDay?.data && !currentDay.data.open ? (
            <p className="rounded-2xl border border-dashed border-coffee/30 px-4 py-6 text-center text-coffee">
              {currentDay.data.reason ?? 'No appointments on this day.'} Pick another date.
            </p>
          ) : (
            <TimeSlotPicker
              date={date ? parseISO(date) : undefined}
              value={time}
              now={null}
              apiSlots={currentDay?.data?.slots ?? []}
              loading={loadingDay}
              error={fieldErrors.time}
              onChange={setTime}
            />
          )}
          {fieldError('time')}
        </section>

        <section className="surface-card grid content-start gap-4 rounded-[1rem] border border-coffee/12 p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-shadow">Who</h2>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input {...field('name')} required minLength={2} maxLength={80} autoComplete="off" />
            {fieldError('name')}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input {...field('phone')} type="tel" autoComplete="off" placeholder="+91 98765 43210" />
              {fieldError('phone')}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input {...field('email')} type="email" autoComplete="off" />
              {fieldError('email')}
            </div>
          </div>
          <p className="-mt-2 text-xs text-coffee">Phone or email is needed. Without an email the patient gets no booking emails.</p>
          <div className="grid gap-2">
            <Label htmlFor="organisation">Organisation (optional)</Label>
            <Input {...field('organisation')} maxLength={160} />
            {fieldError('organisation')}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">What it’s about (optional)</Label>
            <Textarea {...field('message')} rows={4} maxLength={1000} />
            {fieldError('concern')}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={confirmNow} onChange={(e) => setConfirmNow(e.target.checked)} />
            Confirm it straight away (sends the confirmation email)
          </label>
          <Button type="submit" disabled={busy || !service || !date || !time || !hasContact}>
            {busy ? 'Saving…' : confirmNow ? 'Book and confirm' : 'Book as pending'}
          </Button>
        </section>
      </form>
    </div>
  )
}
