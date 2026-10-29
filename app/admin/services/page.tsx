'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookingApiError } from '@/lib/booking/api'
import { cms } from '@/lib/cms/api'
import type { AdminService } from '@/lib/cms/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export default function ServicesPage() {
  const [services, setServices] = useState<AdminService[]>([])
  const [selected, setSelected] = useState<AdminService | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const active = useMemo(() => services.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [services])
  const hidden = useMemo(() => services.filter((s) => !s.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [services])

  async function reload() {
    const list = await cms.services()
    setServices(list)
    setSelected((prev) => (prev ? list.find((s) => s.id === prev.id) ?? list[0] ?? null : list[0] ?? null))
  }

  useEffect(() => {
    reload().catch((e) => setError(e instanceof Error ? e.message : 'Could not load services.'))
  }, [])

  async function save(form: FormData) {
    if (!selected) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const priceRaw = String(form.get('price') ?? '')
      const hidePrice = form.get('hidePrice') === 'on'
      await cms.updateService(selected.id, {
        name: String(form.get('name')),
        description: String(form.get('description')),
        suitableFor: String(form.get('suitableFor')),
        durationMinutes: Number(form.get('durationMinutes')),
        bookingType: String(form.get('bookingType')) as 'individual' | 'enquiry',
        sortOrder: Number(form.get('sortOrder')),
        isActive: form.get('isActive') === 'on',
        price: hidePrice ? null : priceRaw === '' ? undefined : Number(priceRaw),
      })
      await reload()
      setNotice('Service saved.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!selected || !window.confirm(`Delete “${selected.name}”? Prefer Hide if bookings already use it.`)) return
    setBusy(true)
    setError(null)
    try {
      await cms.deleteService(selected.id)
      await reload()
      setNotice('Service deleted.')
    } catch (e) {
      if (e instanceof BookingApiError && e.code === 'SERVICE_IN_USE') {
        setError(`${e.message} Use Hide instead.`)
      } else {
        setError(e instanceof Error ? e.message : 'Delete failed.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-7">
      <header className="grid gap-2">
        <p className="type-eyebrow text-burgundy">Enquiry types</p>
        <h1 className="font-serif text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-semibold text-shadow">Services</h1>
        <p className="max-w-2xl text-shadow/70">These power the booking form. Rename freely — don’t change the slug after create.</p>
      </header>

      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}
      {notice ? <p className="rounded-[0.7rem] border border-sage/40 bg-sage/15 px-4 py-3 text-sm text-[#3d4a32]">{notice}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="surface-card rounded-[1rem] border border-coffee/12 p-3">
          <p className="px-2 py-2 font-ui text-[0.62rem] tracking-[0.18em] text-coffee uppercase">Active</p>
          <ul className="grid gap-1">
            {active.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelected(s)}
                  className={cn(
                    'w-full rounded-[0.65rem] px-3 py-2.5 text-left text-sm transition-colors',
                    selected?.id === s.id ? 'bg-burgundy text-paper' : 'hover:bg-burgundy/8',
                  )}
                >
                  <span className="block font-medium">{s.name}</span>
                  <span className={cn('text-xs', selected?.id === s.id ? 'text-paper/70' : 'text-coffee')}>{s.slug}</span>
                </button>
              </li>
            ))}
          </ul>
          {hidden.length ? (
            <details className="mt-3 border-t border-coffee/10 pt-3">
              <summary className="cursor-pointer px-2 py-1 font-ui text-[0.62rem] tracking-[0.18em] text-coffee uppercase">
                Hidden ({hidden.length})
              </summary>
              <ul className="mt-2 grid gap-1">
                {hidden.map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => setSelected(s)} className="w-full rounded-[0.65rem] px-3 py-2 text-left text-sm opacity-70 hover:bg-burgundy/8">
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>

        {selected ? (
          <form
            key={selected.id}
            className="surface-card grid gap-4 rounded-[1rem] border border-coffee/12 p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              void save(new FormData(e.currentTarget))
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={selected.name} required minLength={2} />
            </div>
            <div className="grid gap-2">
              <Label>Slug (read-only)</Label>
              <Input value={selected.slug} readOnly className="bg-paper-deep/40" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={selected.description} required rows={4} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="suitableFor">Suitable for</Label>
                <Input id="suitableFor" name="suitableFor" defaultValue={selected.suitableFor} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                <Input id="durationMinutes" name="durationMinutes" type="number" min={15} max={240} defaultValue={selected.durationMinutes} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bookingType">Type</Label>
                <select id="bookingType" name="bookingType" defaultValue={selected.bookingType} className="h-11 rounded-[0.5rem] border border-coffee/20 bg-paper px-3">
                  <option value="individual">individual</option>
                  <option value="enquiry">enquiry</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sortOrder">Sort order</Label>
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={selected.sortOrder} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (INR)</Label>
                <Input id="price" name="price" type="number" defaultValue={selected.price?.amount ?? ''} placeholder="Optional" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="hidePrice" defaultChecked={!selected.price} />
              Don’t show a price
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" defaultChecked={selected.isActive} />
              Show on the website
            </label>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Save service'}
              </Button>
              <Button type="button" variant="outline" disabled={busy} onClick={() => void remove()}>
                Delete
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-shadow/60">No services loaded.</p>
        )}
      </div>
    </div>
  )
}
