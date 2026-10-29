'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings2,
  Sparkles,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { cms } from '@/lib/cms/api'
import { session } from '@/lib/cms/session'
import type { User } from '@/lib/cms/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const NAV = [
  { href: '/admin/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/appointments/', label: 'Appointments', icon: CalendarDays },
  { href: '/admin/services/', label: 'Services', icon: ClipboardList },
  { href: '/admin/profile/', label: 'Profile & hours', icon: UserRound },
  { href: '/admin/settings/', label: 'Clinic settings', icon: Settings2 },
  { href: '/admin/clients/', label: 'Clients', icon: Users },
  { href: '/admin/users/', label: 'Staff logins', icon: Sparkles },
] as const

function pathActive(pathname: string, href: string) {
  if (href === '/admin/') return pathname === '/admin' || pathname === '/admin/'
  return pathname === href || pathname.startsWith(href.replace(/\/$/, ''))
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let alive = true
    cms
      .me()
      .then((me) => {
        if (alive) setUser(me)
      })
      .catch(() => {
        /* 401 clears session via api */
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const nav = (
    <nav aria-label="CMS" className="grid gap-1 p-3">
      {NAV.map((item) => {
        const Icon = item.icon
        const active = pathActive(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-[0.65rem] px-3 py-2.5 text-[0.92rem] transition-colors duration-300',
              active ? 'bg-burgundy text-paper' : 'text-paper/80 hover:bg-paper/10 hover:text-paper',
            )}
          >
            <Icon className="size-4 shrink-0 opacity-80" aria-hidden="true" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="relative min-h-dvh lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="espresso-surface hidden flex-col lg:flex">
        <div className="border-b border-paper/10 px-5 py-6">
          <p className="font-ui text-[0.62rem] tracking-[0.28em] text-gold uppercase">CMS</p>
          <p className="mt-2 font-serif text-xl text-paper">Paper Skin & Synapses</p>
          <p className="mt-1 text-sm text-paper/55">{user?.name ?? '…'}</p>
        </div>
        <div className="flex-1">{nav}</div>
        <div className="border-t border-paper/10 p-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full border-paper/25 text-paper hover:bg-paper hover:text-burgundy"
            onClick={() => session.clear()}
          >
            <LogOut aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-coffee/12 bg-paper/90 px-4 py-3 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu />
            </Button>
            <div>
              <p className="font-ui text-[0.62rem] tracking-[0.22em] text-burgundy uppercase lg:hidden">Admin</p>
              <p className="font-serif text-lg text-shadow lg:text-xl">Welcome{user ? `, ${user.name}` : ''}</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => session.clear()}>
            <LogOut aria-hidden="true" />
            Sign out
          </Button>
        </header>

        <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-shadow/45" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="espresso-surface absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col shadow-lifted">
            <div className="flex items-center justify-between border-b border-paper/10 px-4 py-4">
              <p className="font-serif text-lg text-paper">Menu</p>
              <Button type="button" variant="ghost" size="icon-sm" className="text-paper hover:bg-paper/10" onClick={() => setOpen(false)}>
                <X />
              </Button>
            </div>
            {nav}
            <div className="mt-auto border-t border-paper/10 p-4">
              <Button type="button" variant="outline" size="sm" className="w-full border-paper/25 text-paper" onClick={() => session.clear()}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
