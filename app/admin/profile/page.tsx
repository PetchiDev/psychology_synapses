'use client'

import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms/api'
import type { AdminPractitioner, TimeOff, User, WorkingHours } from '@/lib/cms/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const DAYS = [
  { weekday: 1 as const, label: 'Monday' },
  { weekday: 2 as const, label: 'Tuesday' },
  { weekday: 3 as const, label: 'Wednesday' },
  { weekday: 4 as const, label: 'Thursday' },
  { weekday: 5 as const, label: 'Friday' },
  { weekday: 6 as const, label: 'Saturday' },
  { weekday: 0 as const, label: 'Sunday' },
]

export default function ProfilePage() {
  const [me, setMe] = useState<User | null>(null)
  const [practitioner, setPractitioner] = useState<AdminPractitioner | null>(null)
  const [hours, setHours] = useState<Record<number, { on: boolean; start: string; end: string }>>({})
  const [timeOff, setTimeOff] = useState<TimeOff[]>([])
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [offForm, setOffForm] = useState({ startsAt: '', endsAt: '', reason: '' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const user = await cms.me()
        if (!user.practitionerId) throw new Error('No practitioner linked to this login.')
        const [p, off] = await Promise.all([cms.practitioner(user.practitionerId), cms.timeOff()])
        if (!alive) return
        setMe(user)
        setPractitioner(p)
        const map: Record<number, { on: boolean; start: string; end: string }> = {}
        for (const d of DAYS) {
          const row = p.workingHours.find((h) => h.weekday === d.weekday)
          map[d.weekday] = { on: !!row, start: row?.start ?? '09:00', end: row?.end ?? '17:00' }
        }
        setHours(map)
        setTimeOff(off)
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Could not load profile.')
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  async function saveProfile(form: FormData) {
    if (!practitioner) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const languages = String(form.get('languages'))
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
      const next = await cms.updatePractitioner(practitioner.id, {
        name: String(form.get('name')),
        title: String(form.get('title')),
        focus: String(form.get('focus')),
        summary: String(form.get('summary')),
        yearsExperience: Number(form.get('yearsExperience')),
        languages,
        sessionMinutes: Number(form.get('sessionMinutes')),
        email: String(form.get('email')) || null,
        modes: practitioner.modes,
      })
      setPractitioner(next)
      setNotice('Profile saved.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  async function saveHours() {
    if (!practitioner) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const payload: WorkingHours[] = DAYS.filter((d) => hours[d.weekday]?.on).map((d) => ({
        weekday: d.weekday,
        start: hours[d.weekday]!.start,
        end: hours[d.weekday]!.end,
      }))
      await cms.putHours(practitioner.id, payload)
      setNotice('Working hours updated. Slots will follow these times.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hours save failed.')
    } finally {
      setBusy(false)
    }
  }

  async function addOff() {
    if (!practitioner || !offForm.startsAt || !offForm.endsAt) return
    if (offForm.endsAt <= offForm.startsAt) {
      setError('The end day must be after the start day. It is the first day back, so one day off ends on the next day.')
      return
    }
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const created = await cms.addTimeOff({
        startsAt: `${offForm.startsAt} 00:00`,
        endsAt: `${offForm.endsAt} 00:00`,
        reason: offForm.reason || undefined,
        practitionerId: practitioner.id,
      })
      const clash = created.clashingBookings?.length
        ? ` Warning: ${created.clashingBookings.length} clashing booking(s).`
        : ''
      setNotice(`Time off saved.${clash}`)
      setTimeOff(await cms.timeOff())
      setOffForm({ startsAt: '', endsAt: '', reason: '' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add time off.')
    } finally {
      setBusy(false)
    }
  }

  if (!practitioner && !error) return <p className="text-shadow/60">Loading profile…</p>

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <p className="type-eyebrow text-burgundy">Practitioner {me?.practitionerId ?? ''}</p>
        <h1 className="font-serif text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-semibold text-shadow">Profile & hours</h1>
      </header>

      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}
      {notice ? <p className="rounded-[0.7rem] border border-sage/40 bg-sage/15 px-4 py-3 text-sm text-[#3d4a32]">{notice}</p> : null}

      {practitioner ? (
        <>
          <form
            className="surface-card grid gap-4 rounded-[1rem] border border-coffee/12 p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              void saveProfile(new FormData(e.currentTarget))
            }}
          >
            <h2 className="font-serif text-2xl text-shadow">Profile</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={practitioner.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={practitioner.title} required />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="focus">Focus</Label>
                <Input id="focus" name="focus" defaultValue={practitioner.focus} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" name="summary" defaultValue={practitioner.summary} rows={5} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="yearsExperience">Years’ experience</Label>
                <Input id="yearsExperience" name="yearsExperience" type="number" min={0} max={80} defaultValue={practitioner.yearsExperience} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sessionMinutes">Session minutes</Label>
                <Input id="sessionMinutes" name="sessionMinutes" type="number" min={15} max={240} defaultValue={practitioner.sessionMinutes} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="languages">Languages (comma-separated)</Label>
                <Input id="languages" name="languages" defaultValue={practitioner.languages.join(', ')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Notification email</Label>
                <Input id="email" name="email" type="email" defaultValue={practitioner.email ?? ''} />
              </div>
            </div>
            <p className="text-sm text-coffee">Modes stay video-only while the public site is online-only.</p>
            <Button type="submit" disabled={busy}>
              Save profile
            </Button>
          </form>

          <section className="surface-card grid gap-4 rounded-[1rem] border border-coffee/12 p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-shadow">Weekly hours</h2>
            <ul className="grid gap-3">
              {DAYS.map((d) => {
                const row = hours[d.weekday]
                if (!row) return null
                return (
                  <li key={d.weekday} className="grid gap-2 rounded-[0.7rem] border border-coffee/10 bg-paper/50 p-3 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={row.on}
                        onChange={(e) => setHours((h) => ({ ...h, [d.weekday]: { ...row, on: e.target.checked } }))}
                      />
                      {d.label}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Input
                        type="time"
                        aria-label={`${d.label} start`}
                        value={row.start}
                        disabled={!row.on}
                        onChange={(e) => setHours((h) => ({ ...h, [d.weekday]: { ...row, start: e.target.value } }))}
                      />
                      <Input
                        type="time"
                        aria-label={`${d.label} end`}
                        value={row.end}
                        disabled={!row.on}
                        onChange={(e) => setHours((h) => ({ ...h, [d.weekday]: { ...row, end: e.target.value } }))}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
            <Button type="button" disabled={busy} onClick={() => void saveHours()}>
              Save hours
            </Button>
          </section>

          <section className="surface-card grid gap-4 rounded-[1rem] border border-coffee/12 p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-shadow">Time off</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="off-start">Starts (day)</Label>
                <Input id="off-start" type="date" value={offForm.startsAt} onChange={(e) => setOffForm((f) => ({ ...f, startsAt: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="off-end">Ends (first day back)</Label>
                <Input id="off-end" type="date" value={offForm.endsAt} onChange={(e) => setOffForm((f) => ({ ...f, endsAt: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="off-reason">Reason</Label>
                <Input id="off-reason" value={offForm.reason} onChange={(e) => setOffForm((f) => ({ ...f, reason: e.target.value }))} />
              </div>
            </div>
            <Button type="button" variant="outline" disabled={busy} onClick={() => void addOff()}>
              Add time off
            </Button>
            <ul className="grid gap-2">
              {timeOff.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[0.65rem] border border-coffee/10 px-3 py-2 text-sm">
                  <span>
                    {row.startsAt} → {row.endsAt}
                    {row.reason ? ` · ${row.reason}` : ''}
                  </span>
                  <Button
                    type="button"
                    size="xs"
                    variant="ghost"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true)
                      setError(null)
                      try {
                        await cms.deleteTimeOff(row.id)
                        setTimeOff(await cms.timeOff())
                      } catch (e) {
                        setError(e instanceof Error ? e.message : 'Could not remove the time off.')
                      } finally {
                        setBusy(false)
                      }
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </div>
  )
}
