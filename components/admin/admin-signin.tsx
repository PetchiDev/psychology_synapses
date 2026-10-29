'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { BookingApiError } from '@/lib/booking/api'
import { cms } from '@/lib/cms/api'
import { session } from '@/lib/cms/session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminSignIn() {
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [retryAfter, setRetryAfter] = useState(0)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || retryAfter > 0) return
    setError(null)
    setBusy(true)
    const form = new FormData(event.currentTarget)
    try {
      const { data } = await cms.login(String(form.get('email')), String(form.get('password')))
      session.set(data.token, data.expiresAt)
    } catch (e) {
      if (e instanceof BookingApiError && e.status === 429) {
        const wait = 60
        setRetryAfter(wait)
        setError(e.message)
        const tick = window.setInterval(() => {
          setRetryAfter((n) => {
            if (n <= 1) {
              window.clearInterval(tick)
              return 0
            }
            return n - 1
          })
        }, 1000)
      } else {
        setError(e instanceof Error ? e.message : 'Sign-in failed.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_20%,rgb(122_35_38/0.1),transparent_50%),radial-gradient(ellipse_at_80%_90%,rgb(196_149_74/0.14),transparent_45%)]"
      />
      <div className="surface-card w-full max-w-md rounded-[1.15rem] border border-coffee/12 p-8 shadow-lifted sm:p-10">
        <div className="mb-8 grid justify-items-center gap-3 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-burgundy text-paper shadow-[0_12px_24px_-10px_rgb(122_35_38/0.55)]">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </span>
          <p className="type-eyebrow text-burgundy">Private desk</p>
          <h1 className="font-serif text-[2rem] leading-tight font-semibold text-shadow">Sign in to the CMS</h1>
          <p className="text-[0.95rem] leading-relaxed text-shadow/70">For Megha — bookings, services, hours and clinic settings.</p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              defaultValue="megha@paperskinandsynapses.com"
              className="h-11"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input id="admin-password" name="password" type="password" autoComplete="current-password" required minLength={8} className="h-11" />
          </div>
          {error ? (
            <p role="alert" className="rounded-[0.6rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
              {error}
              {retryAfter > 0 ? ` Try again in ${retryAfter}s.` : null}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="w-full" disabled={busy || retryAfter > 0}>
            {busy ? 'Signing in…' : 'Sign in'}
            <ArrowRight aria-hidden="true" />
          </Button>
        </form>
      </div>
    </div>
  )
}
