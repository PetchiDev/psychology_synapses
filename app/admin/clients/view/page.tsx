'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { BookingApiError } from '@/lib/booking/api'
import { cms } from '@/lib/cms/api'
import type { ClientDetail } from '@/lib/cms/types'
import { StatusBadge } from '@/components/admin/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ClientDetailView() {
  const params = useSearchParams()
  const id = Number(params.get('id'))
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    if (!Number.isFinite(id) || id <= 0) {
      setError('Missing client id.')
      return
    }
    cms
      .client(id)
      .then(setClient)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load client.'))
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  async function save(form: FormData) {
    if (!client) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const next = await cms.updateClient(client.id, {
        name: String(form.get('name')),
        email: String(form.get('email')),
        phone: String(form.get('phone')) || undefined,
        address: String(form.get('address')),
      })
      setClient(next)
      setNotice('Client updated.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  async function erase() {
    if (!client) return
    if (!window.confirm(`Permanently erase “${client.name}”? This cannot be undone.`)) return
    setBusy(true)
    setError(null)
    try {
      await cms.eraseClient(client.id)
      setNotice('Client erased.')
      load()
    } catch (e) {
      if (e instanceof BookingApiError && e.code === 'CLIENT_HAS_BOOKINGS') {
        setError(`${e.message} Cancel upcoming bookings first.`)
      } else {
        setError(e instanceof Error ? e.message : 'Erase failed.')
      }
    } finally {
      setBusy(false)
    }
  }

  if (!client && !error) return <p className="text-shadow/60">Loading…</p>
  if (!client) {
    return (
      <div className="grid gap-4">
        <p className="text-burgundy">{error}</p>
        <Button asChild variant="outline">
          <Link href="/admin/clients/">Back</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-7">
      <Button asChild variant="ghost" size="sm" className="w-fit px-0">
        <Link href="/admin/clients/">
          <ArrowLeft aria-hidden="true" />
          Clients
        </Link>
      </Button>
      <header>
        <p className="type-eyebrow text-burgundy">Client #{client.id}</p>
        <h1 className="font-serif text-[clamp(1.8rem,1.4rem+1.4vw,2.3rem)] font-semibold text-shadow">{client.name}</h1>
      </header>
      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}
      {notice ? <p className="rounded-[0.7rem] border border-sage/40 bg-sage/15 px-4 py-3 text-sm text-[#3d4a32]">{notice}</p> : null}

      <form
        className="surface-card grid gap-4 rounded-[1rem] border border-coffee/12 p-6"
        onSubmit={(e) => {
          e.preventDefault()
          void save(new FormData(e.currentTarget))
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={client.name} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={client.email ?? ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={client.phone ?? ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={client.address ?? ''} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={busy}>
            Save
          </Button>
          <Button type="button" variant="destructive" disabled={busy} onClick={() => void erase()}>
            Erase client
          </Button>
        </div>
      </form>

      <section className="surface-card rounded-[1rem] border border-coffee/12 p-6">
        <h2 className="font-serif text-xl text-shadow">Appointments</h2>
        <ul className="mt-4 divide-y divide-coffee/10">
          {client.appointments.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <Link href={`/admin/appointments/view/?id=${a.id}`} className="text-burgundy underline-offset-4 hover:underline">
                {a.reference} · {a.startsAt} · {a.service ?? '—'}
              </Link>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default function ClientViewPage() {
  return (
    <Suspense fallback={<p className="text-shadow/60">Loading…</p>}>
      <ClientDetailView />
    </Suspense>
  )
}
