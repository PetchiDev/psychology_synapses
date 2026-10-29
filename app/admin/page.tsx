'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarClock, Inbox, Sparkles } from 'lucide-react'
import { cms } from '@/lib/cms/api'
import type { StaffAppointment, Summary } from '@/lib/cms/types'
import { StatusBadge } from '@/components/admin/status-badge'
import { Button } from '@/components/ui/button'

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [pending, setPending] = useState<StaffAppointment[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    Promise.all([cms.summary(), cms.appointments({ status: 'pending', perPage: 8 })])
      .then(([s, list]) => {
        if (!alive) return
        setSummary(s)
        setPending(list.data)
      })
      .catch((e) => alive && setError(e instanceof Error ? e.message : 'Could not load dashboard.'))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <p className="type-eyebrow text-burgundy">Today’s desk</p>
        <h1 className="font-serif text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-semibold text-shadow">What needs you</h1>
        <p className="max-w-2xl text-[1rem] text-shadow/70">Confirm or decline waiting requests, then glance at today’s sessions.</p>
      </header>

      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Waiting', value: summary?.pending, icon: Inbox, hint: 'Need a decision' },
          { label: 'Today', value: summary?.today, icon: CalendarClock, hint: 'Confirmed sessions' },
          { label: 'Upcoming', value: summary?.upcomingConfirmed, icon: Sparkles, hint: 'Confirmed ahead' },
        ].map((card) => {
          const Icon = card.icon
          return (
            <article key={card.label} className="surface-card rounded-[1rem] border border-coffee/12 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-ui text-[0.62rem] tracking-[0.2em] text-coffee uppercase">{card.label}</p>
                  <p className="mt-3 font-serif text-4xl text-shadow">{summary ? card.value : '—'}</p>
                  <p className="mt-1 text-sm text-shadow/60">{card.hint}</p>
                </div>
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              </div>
            </article>
          )
        })}
      </div>

      <section className="surface-card rounded-[1rem] border border-coffee/12 p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-shadow">Waiting for you</h2>
            <p className="mt-1 text-sm text-shadow/65">Pending consultation requests</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/appointments/?tab=waiting">
              All appointments
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        {pending.length === 0 ? (
          <p className="py-8 text-center text-shadow/60">Nothing waiting — a quiet desk.</p>
        ) : (
          <ul className="grid gap-3">
            {pending.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/appointments/view/?id=${item.id}`}
                  className="group flex flex-col gap-2 rounded-[0.8rem] border border-coffee/10 bg-paper/50 px-4 py-4 transition-colors hover:border-burgundy/25 hover:bg-paper sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="grid gap-1">
                    <p className="font-serif text-lg text-shadow">{item.client.name}</p>
                    <p className="text-sm text-shadow/65">
                      {item.date} · {item.time} · {item.service?.name ?? 'Service'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} />
                    <span className="font-ui text-[0.65rem] tracking-[0.16em] text-burgundy uppercase opacity-0 transition-opacity group-hover:opacity-100">
                      Open
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
