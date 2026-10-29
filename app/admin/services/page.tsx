'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { BookingApiError } from '@/lib/booking/api'
import { cms } from '@/lib/cms/api'
import type { AdminService, ServiceInput } from '@/lib/cms/types'
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
  const [creating, setCreating] = useState(false)

  const active = useMemo(() => services.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [services])
  const hidden = useMemo(() => services.filter((s) => !s.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [services])
  const blank = useMemo<AdminService>(
    () => ({
      id: 0,
      slug: '',
      name: '',
      description: '',
      suitableFor: '',
      durationMinutes: 50,
      bookingType: 'individual',
      price: null,
      sortOrder: Math.max(0, ...services.map((s) => s.sortOrder)) + 1,
      isActive: true,
      practitionerIds: [],
    }),
    [services],
  )
  const draft = creating ? blank : selected

  function pick(service: AdminService) {
    setCreating(false)
    setSelected(service)
    setError(null)
    setNotice(null)
  }

  function startNew() {
    setCreating(true)
    setError(null)
    setNotice(null)
  }

  function apply(list: AdminService[]) {
    setServices(list)
    setSelected((prev) => (prev ? list.find((s) => s.id === prev.id) ?? list[0] ?? null : list[0] ?? null))
  }

  async function reload() {
    apply(await cms.services())
  }

  useEffect(() => {
    cms
      .services()
      .then(apply)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load services.'))
  }, [])

  async function save(form: FormData) {
    if (!draft) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const priceRaw = String(form.get('price') ?? '')
      const hidePrice = form.get('hidePrice') === 'on'
      const body: ServiceInput = {
        name: String(form.get('name')),
        description: String(form.get('description')),
        suitableFor: String(form.get('suitableFor')),
        durationMinutes: Number(form.get('durationMinutes')),
        bookingType: String(form.get('bookingType')) as 'individual' | 'enquiry',
        sortOrder: Number(form.get('sortOrder')),
        isActive: form.get('isActive') === 'on',
        // A blank price leaves an existing price alone; a new service just has none.
        price: hidePrice ? null : priceRaw === '' ? (creating ? null : undefined) : Number(priceRaw),
      }
      if (creating) {
        const slug = String(form.get('slug') ?? '').trim()
        const created = await cms.createService(slug ? { ...body, slug } : body)
        setServices(await cms.services())
        setSelected(created)
        setCreating(false)
        setNotice(`Service added (slug: ${created.slug}).`)
      } else {
        await cms.updateService(draft.id, body)
        await reload()
        setNotice('Service saved.')
      }
    } catch (e) {
      if (e instanceof BookingApiError && e.status === 422) {
        setError(Object.values(e.fields).join(' ') || e.message)
      } else {
        setError(e instanceof Error ? e.message : 'Save failed.')
      }
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
        <p className="max-w-2xl text-shadow/70">
          These power the booking form and phone bookings. Rename freely; the slug can’t change after create. The website form’s five enquiry
          types are linked by slug, so a new service shows in phone bookings, not on the website form.
        </p>
      </header>

      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}
      {notice ? <p className="rounded-[0.7rem] border border-sage/40 bg-sage/15 px-4 py-3 text-sm text-[#3d4a32]">{notice}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="surface-card rounded-[1rem] border border-coffee/12 p-3">
          <Button type="button" size="sm" variant={creating ? 'default' : 'outline'} className="mb-2 w-full" onClick={startNew}>
            <Plus aria-hidden="true" />
            New service
          </Button>
          <p className="px-2 py-2 font-ui text-[0.62rem] tracking-[0.18em] text-coffee uppercase">Active</p>
          <ul className="grid gap-1">
            {active.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => pick(s)}
                  className={cn(
                    'w-full rounded-[0.65rem] px-3 py-2.5 text-left text-sm transition-colors',
                    draft?.id === s.id ? 'bg-burgundy text-paper' : 'hover:bg-burgundy/8',
                  )}
                >
                  <span className="block font-medium">{s.name}</span>
                  <span className={cn('text-xs', draft?.id === s.id ? 'text-paper/70' : 'text-coffee')}>{s.slug}</span>
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
                    <button type="button" onClick={() => pick(s)} className="w-full rounded-[0.65rem] px-3 py-2 text-left text-sm opacity-70 hover:bg-burgundy/8">
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>

        {draft ? (
          <form
            key={creating ? 'new' : draft.id}
            className="surface-card grid gap-4 rounded-[1rem] border border-coffee/12 p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              void save(new FormData(e.currentTarget))
            }}
          >
            {creating ? <h2 className="font-serif text-2xl text-shadow">New service</h2> : null}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={draft.name} required minLength={2} maxLength={120} />
            </div>
            {creating ? (
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input id="slug" name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} placeholder="Made from the name if left blank, e.g. couples-therapy" />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="slug-readonly">Slug (read-only)</Label>
                <Input id="slug-readonly" value={draft.slug} readOnly className="bg-paper-deep/40" />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={draft.description} required minLength={2} rows={4} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="suitableFor">Suitable for</Label>
                <Input id="suitableFor" name="suitableFor" defaultValue={draft.suitableFor} required minLength={2} maxLength={160} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                <Input id="durationMinutes" name="durationMinutes" type="number" min={15} max={240} defaultValue={draft.durationMinutes} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bookingType">Type</Label>
                <select id="bookingType" name="bookingType" defaultValue={draft.bookingType} className="h-11 rounded-[0.5rem] border border-coffee/20 bg-paper px-3">
                  <option value="individual">individual</option>
                  <option value="enquiry">enquiry</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sortOrder">Sort order</Label>
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={draft.sortOrder} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (INR)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  defaultValue={draft.price?.amount ?? ''}
                  placeholder="Optional"
                  onInput={(e) => {
                    const hide = e.currentTarget.form?.elements.namedItem('hidePrice')
                    if (hide instanceof HTMLInputElement && e.currentTarget.value) hide.checked = false
                  }}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="hidePrice" defaultChecked={!creating && !draft.price} />
              Don’t show a price
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" defaultChecked={draft.isActive} />
              Show on the website
            </label>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" disabled={busy}>
                {busy ? 'Saving…' : creating ? 'Add service' : 'Save service'}
              </Button>
              {creating ? (
                <Button type="button" variant="outline" disabled={busy} onClick={() => setCreating(false)}>
                  Cancel
                </Button>
              ) : (
                <Button type="button" variant="outline" disabled={busy} onClick={() => void remove()}>
                  Delete
                </Button>
              )}
            </div>
          </form>
        ) : (
          <p className="text-shadow/60">No services loaded.</p>
        )}
      </div>
    </div>
  )
}
