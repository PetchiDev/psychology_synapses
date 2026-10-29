'use client'

import { useEffect, useState } from 'react'
import { BookingApiError } from '@/lib/booking/api'
import { cms } from '@/lib/cms/api'
import type { Settings } from '@/lib/cms/types'
import { BreaksEditor, breaksAreValid } from '@/components/admin/breaks-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [breaks, setBreaks] = useState<Settings['breaks']>({})

  function apply(next: Settings) {
    setSettings(next)
    setBreaks(next.breaks)
  }

  useEffect(() => {
    cms
      .settings()
      .then(apply)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load settings.'))
  }, [])

  async function onSubmit(form: FormData) {
    if (!settings) return
    setBusy(true)
    setError(null)
    setFieldErrors({})
    setNotice(null)
    try {
      const languages = String(form.get('languages'))
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
      const next = await cms.updateSettings({
        clinicName: String(form.get('clinicName')),
        phone: String(form.get('phone')),
        email: String(form.get('email')),
        address: String(form.get('address')),
        openingHoursText: String(form.get('openingHoursText')),
        languages,
        emergency: { police: String(form.get('police')), teleManas: String(form.get('teleManas')) },
        minLeadMinutes: Number(form.get('minLeadMinutes')),
        maxDaysAhead: Number(form.get('maxDaysAhead')),
        maxPendingPerPhone: Number(form.get('maxPendingPerPhone')),
        siteUrl: String(form.get('siteUrl')),
        copyOwnerOnPractitionerBookings: form.get('copyOwnerOnPractitionerBookings') === 'on',
        slotGrid: settings.slotGrid,
        breaks,
      })
      apply(next)
      setNotice('Clinic settings saved.')
    } catch (e) {
      if (e instanceof BookingApiError && e.status === 422) setFieldErrors(e.fields)
      setError(e instanceof Error ? e.message : 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  if (!settings && !error) return <p className="text-shadow/60">Loading settings…</p>

  return (
    <div className="grid gap-7">
      <header className="grid gap-2">
        <p className="type-eyebrow text-burgundy">Clinic-wide</p>
        <h1 className="font-serif text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-semibold text-shadow">Settings</h1>
        <p className="max-w-2xl text-shadow/70">Phone, email, booking window and crisis numbers used across patient messages.</p>
      </header>

      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}
      {notice ? <p className="rounded-[0.7rem] border border-sage/40 bg-sage/15 px-4 py-3 text-sm text-[#3d4a32]">{notice}</p> : null}

      {settings ? (
        <form
          className="surface-card grid gap-4 rounded-[1rem] border border-coffee/12 p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault()
            void onSubmit(new FormData(e.currentTarget))
          }}
        >
          {(
            [
              ['clinicName', 'Clinic name', settings.clinicName],
              ['phone', 'Phone', settings.phone],
              ['email', 'Email', settings.email],
              ['address', 'Address', settings.address],
              ['siteUrl', 'Site URL', settings.siteUrl],
            ] as const
          ).map(([name, label, value]) => (
            <div key={name} className="grid gap-2">
              <Label htmlFor={name}>{label}</Label>
              <Input id={name} name={name} defaultValue={value} required />
              {fieldErrors[name] ? <p className="text-sm text-burgundy">{fieldErrors[name]}</p> : null}
            </div>
          ))}
          <div className="grid gap-2">
            <Label htmlFor="openingHoursText">Opening hours text</Label>
            <Textarea id="openingHoursText" name="openingHoursText" defaultValue={settings.openingHoursText} rows={2} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="languages">Languages (comma-separated)</Label>
            <Input id="languages" name="languages" defaultValue={settings.languages.join(', ')} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="police">Emergency (police)</Label>
              <Input id="police" name="police" defaultValue={settings.emergency.police} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teleManas">Tele-MANAS</Label>
              <Input id="teleManas" name="teleManas" defaultValue={settings.emergency.teleManas} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minLeadMinutes">Min lead (minutes)</Label>
              <Input id="minLeadMinutes" name="minLeadMinutes" type="number" defaultValue={settings.minLeadMinutes} />
              {fieldErrors.minLeadMinutes ? <p className="text-sm text-burgundy">{fieldErrors.minLeadMinutes}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxDaysAhead">Max days ahead</Label>
              <Input id="maxDaysAhead" name="maxDaysAhead" type="number" defaultValue={settings.maxDaysAhead} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxPendingPerPhone">Max pending per phone/email</Label>
              <Input id="maxPendingPerPhone" name="maxPendingPerPhone" type="number" defaultValue={settings.maxPendingPerPhone} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="copyOwnerOnPractitionerBookings" defaultChecked={settings.copyOwnerOnPractitionerBookings} />
            Copy clinic email on owner booking emails
          </label>
          <div className="grid gap-2 pt-2">
            <h2 className="font-serif text-xl text-shadow">Breaks</h2>
            <p className="text-sm text-coffee">
              Times inside a break (lunch, for example) aren’t offered for booking. Working days and hours are set on the Profile &amp; hours screen.
            </p>
            <BreaksEditor value={breaks} onChange={setBreaks} disabled={busy} />
            {fieldErrors.breaks ? <p className="text-sm text-burgundy">{fieldErrors.breaks}</p> : null}
          </div>
          <Button type="submit" disabled={busy || !breaksAreValid(breaks)}>
            {busy ? 'Saving…' : 'Save settings'}
          </Button>
        </form>
      ) : null}
    </div>
  )
}
