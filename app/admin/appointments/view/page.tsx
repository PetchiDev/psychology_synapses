'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { BookingApiError } from '@/lib/booking/api'
import { cms } from '@/lib/cms/api'
import type { StaffAppointment } from '@/lib/cms/types'
import { StatusBadge } from '@/components/admin/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function AppointmentDetail() {
  const params = useSearchParams()
  const id = Number(params.get('id'))
  const validId = Number.isFinite(id) && id > 0
  const [item, setItem] = useState<StaffAppointment | null>(null)
  const [error, setError] = useState<string | null>(validId ? null : 'Missing appointment id.')
  const [message, setMessage] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [reschedule, setReschedule] = useState({ date: '', time: '' })
  const [now] = useState(Date.now)

  const load = useCallback(() => {
    if (!validId) return
    cms
      .appointment(id)
      .then(setItem)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load appointment.'))
  }, [id, validId])

  useEffect(() => {
    load()
  }, [load])

  async function act(action: Parameters<typeof cms.act>[1], body: Record<string, unknown> = {}) {
    if (!item) return
    setBusy(action)
    setError(null)
    try {
      const next = await cms.act(item.id, action, body)
      setItem(next)
      setMessage('')
      setNote('')
    } catch (e) {
      setError(e instanceof BookingApiError || e instanceof Error ? e.message : 'Action failed.')
      if (e instanceof BookingApiError && e.status === 409) load()
    } finally {
      setBusy(null)
    }
  }

  if (!item && !error) {
    return <p className="text-shadow/60">Loading appointment…</p>
  }

  if (!item) {
    return (
      <div className="grid gap-4">
        <p role="alert" className="text-burgundy">
          {error}
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/appointments/">Back to list</Link>
        </Button>
      </div>
    )
  }

  const pending = item.status === 'pending'
  const confirmed = item.status === 'confirmed'
  const afterStart = new Date(item.startsAt).getTime() <= now

  return (
    <div className="grid gap-7">
      <Button asChild variant="ghost" size="sm" className="w-fit px-0">
        <Link href="/admin/appointments/">
          <ArrowLeft aria-hidden="true" />
          Appointments
        </Link>
      </Button>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <p className="type-eyebrow text-burgundy">{item.reference}</p>
          <h1 className="font-serif text-[clamp(1.8rem,1.4rem+1.4vw,2.3rem)] font-semibold text-shadow">{item.client.name}</h1>
          <p className="text-shadow/70">
            {item.date} · {item.time} · {item.service?.name ?? '—'} · {item.mode ?? 'video'}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </header>

      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="surface-card rounded-[1rem] border border-coffee/12 p-6">
          <h2 className="font-serif text-xl text-shadow">Client</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="text-coffee">Email</dt>
              <dd>{item.client.email ?? 'Not given'}</dd>
            </div>
            <div>
              <dt className="text-coffee">Phone</dt>
              <dd>{item.client.phone ?? 'Not given'}</dd>
            </div>
            <div>
              <dt className="text-coffee">Organisation</dt>
              <dd>{item.organisation ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-coffee">Their message</dt>
              <dd className="whitespace-pre-wrap text-shadow/85">{item.concern ?? '—'}</dd>
            </div>
          </dl>
        </article>

        <article className="surface-card rounded-[1rem] border border-coffee/12 p-6">
          <h2 className="font-serif text-xl text-shadow">Actions</h2>
          <div className="mt-4 grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="patient-message">Message to patient (optional)</Label>
              <Textarea id="patient-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
            </div>
            <div className="flex flex-wrap gap-2">
              {pending ? (
                <>
                  <Button disabled={!!busy} onClick={() => act('confirm', { mode: item.mode ?? 'video', message: message || undefined })}>
                    {busy === 'confirm' ? '…' : 'Confirm'}
                  </Button>
                  <Button variant="outline" disabled={!!busy} onClick={() => act('decline', { message: message || undefined })}>
                    Decline
                  </Button>
                </>
              ) : null}
              {(pending || confirmed) && (
                <Button variant="outline" disabled={!!busy} onClick={() => act('cancel', { reason: message || undefined })}>
                  Cancel
                </Button>
              )}
              {confirmed && afterStart ? (
                <>
                  <Button variant="secondary" disabled={!!busy} onClick={() => act('complete')}>
                    Mark completed
                  </Button>
                  <Button variant="ghost" disabled={!!busy} onClick={() => act('no-show')}>
                    No-show
                  </Button>
                </>
              ) : null}
            </div>

            {(pending || confirmed) && (
              <div className="mt-2 grid gap-2 rounded-[0.75rem] border border-coffee/10 bg-paper-deep/30 p-4">
                <p className="font-ui text-[0.65rem] tracking-[0.16em] text-coffee uppercase">Reschedule</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input type="date" aria-label="New date" value={reschedule.date} onChange={(e) => setReschedule((r) => ({ ...r, date: e.target.value }))} />
                  <Input type="time" aria-label="New time" value={reschedule.time} onChange={(e) => setReschedule((r) => ({ ...r, time: e.target.value }))} />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!!busy || !reschedule.date || !reschedule.time}
                  onClick={() => act('reschedule', reschedule)}
                >
                  Save new time
                </Button>
              </div>
            )}

            <div className="grid gap-2 border-t border-coffee/10 pt-4">
              <Label htmlFor="staff-note">Staff note</Label>
              <Textarea id="staff-note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
              <Button size="sm" variant="secondary" disabled={!!busy || note.trim().length < 1} onClick={() => act('notes', { note })}>
                Add note
              </Button>
              {item.staffNotes ? <p className="whitespace-pre-wrap text-sm text-shadow/75">{item.staffNotes}</p> : null}
            </div>
          </div>
        </article>
      </div>

      {item.history?.length ? (
        <article className="surface-card rounded-[1rem] border border-coffee/12 p-6">
          <h2 className="font-serif text-xl text-shadow">History</h2>
          <ol className="mt-4 grid gap-3">
            {item.history.map((row, index) => (
              <li key={`${row.at}-${index}`} className="border-l-2 border-burgundy/30 pl-4">
                <p className="font-medium text-shadow">
                  {row.action} · <span className="text-coffee">{row.actor}</span>
                </p>
                <p className="text-sm text-shadow/60">{row.at}</p>
                {row.detail ? <p className="mt-1 text-sm text-shadow/80">{row.detail}</p> : null}
              </li>
            ))}
          </ol>
        </article>
      ) : null}
    </div>
  )
}

export default function AppointmentViewPage() {
  return (
    <Suspense fallback={<p className="text-shadow/60">Loading…</p>}>
      <AppointmentDetail />
    </Suspense>
  )
}
