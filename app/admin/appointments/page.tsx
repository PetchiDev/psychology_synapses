'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { format, subDays } from 'date-fns'
import { Plus, Search } from 'lucide-react'
import { cms } from '@/lib/cms/api'
import type { StaffAppointment } from '@/lib/cms/types'
import { StatusBadge } from '@/components/admin/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Tab = 'waiting' | 'upcoming' | 'past' | 'all'

const TABS: { id: Tab; label: string }[] = [
  { id: 'waiting', label: 'Waiting' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'all', label: 'All' },
]

function filtersFor(tab: Tab) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
  if (tab === 'waiting') return { status: 'pending' }
  if (tab === 'upcoming') return { status: 'confirmed', from: today }
  if (tab === 'past') return { to: yesterday }
  return {}
}

export default function AppointmentsPage() {
  const requestedTab = useSearchParams().get('tab')
  const [tab, setTab] = useState<Tab>(TABS.find((x) => x.id === requestedTab)?.id ?? 'waiting')
  const [q, setQ] = useState('')
  const [items, setItems] = useState<StaffAppointment[]>([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const query = useMemo(() => ({ ...filtersFor(tab), q: q.trim() || undefined, perPage: 40 }), [tab, q])
  const [loadedQuery, setLoadedQuery] = useState<typeof query | null>(null)
  const loading = loadedQuery !== query

  useEffect(() => {
    let alive = true
    cms
      .appointments(query)
      .then((res) => {
        if (!alive) return
        setItems(res.data)
        setTotal(res.meta.total)
      })
      .catch((e) => alive && setError(e instanceof Error ? e.message : 'Could not load appointments.'))
      .finally(() => alive && setLoadedQuery(query))
    return () => {
      alive = false
    }
  }, [query])

  return (
    <div className="grid gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-2">
          <p className="type-eyebrow text-burgundy">Bookings</p>
          <h1 className="font-serif text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-semibold text-shadow">Appointments</h1>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/appointments/new/">
            <Plus aria-hidden="true" />
            New phone booking
          </Link>
        </Button>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-full border border-coffee/15 bg-paper/70 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-full px-4 py-2 font-ui text-[0.68rem] tracking-[0.14em] uppercase transition-colors',
                tab === t.id ? 'bg-burgundy text-paper' : 'text-shadow/70 hover:text-burgundy',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-coffee" aria-hidden="true" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, ref…" className="h-11 pl-10" />
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}

      <div className="surface-card overflow-hidden rounded-[1rem] border border-coffee/12">
        <div className="border-b border-coffee/10 px-5 py-3 text-sm text-shadow/60">
          {loading ? 'Loading…' : `${total} booking${total === 1 ? '' : 's'}`}
        </div>
        {items.length === 0 && !loading ? (
          <p className="px-5 py-12 text-center text-shadow/60">No appointments in this view.</p>
        ) : (
          <ul className="divide-y divide-coffee/10">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/appointments/view/?id=${item.id}`}
                  className="grid gap-2 px-5 py-4 transition-colors hover:bg-burgundy/[0.03] sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <p className="font-serif text-lg text-shadow">{item.client.name}</p>
                    <p className="text-sm text-shadow/65">
                      {item.reference} · {item.date} {item.time} · {item.service?.name ?? '—'}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button asChild variant="outline" className="w-fit">
        <Link href="/admin/">Back to dashboard</Link>
      </Button>
    </div>
  )
}
