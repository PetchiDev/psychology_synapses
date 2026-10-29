'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { cms } from '@/lib/cms/api'
import type { ClientListItem } from '@/lib/cms/types'
import { Input } from '@/components/ui/input'

export default function ClientsPage() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<ClientListItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    const handle = window.setTimeout(() => {
      cms
        .clients(q.trim())
        .then((list) => {
          if (!alive) return
          setError(null)
          setItems(list)
        })
        .catch((e) => alive && setError(e instanceof Error ? e.message : 'Could not load clients.'))
    }, 250)
    return () => {
      alive = false
      window.clearTimeout(handle)
    }
  }, [q])

  return (
    <div className="grid gap-7">
      <header className="grid gap-2">
        <p className="type-eyebrow text-burgundy">People</p>
        <h1 className="font-serif text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-semibold text-shadow">Clients</h1>
        <p className="max-w-2xl text-shadow/70">Created by bookings — search by name, phone digits or email.</p>
      </header>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-coffee" aria-hidden="true" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search clients" placeholder="Search…" className="h-11 pl-10" />
      </div>

      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}

      <div className="surface-card overflow-hidden rounded-[1rem] border border-coffee/12">
        {items.length === 0 ? (
          <p className="px-5 py-12 text-center text-shadow/60">No clients found.</p>
        ) : (
          <ul className="divide-y divide-coffee/10">
            {items.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/clients/view/?id=${c.id}`} className="grid gap-1 px-5 py-4 hover:bg-burgundy/[0.03] sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="font-serif text-lg text-shadow">{c.name}</p>
                    <p className="text-sm text-shadow/65">
                      {c.email ?? 'No email'} · {c.phone ?? 'No phone'}
                    </p>
                  </div>
                  <p className="font-ui text-[0.65rem] tracking-[0.14em] text-coffee uppercase">{c.appointments} appointments</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
