'use client'

import { useEffect, useState } from 'react'
import { BookingApiError } from '@/lib/booking/api'
import { cms } from '@/lib/cms/api'
import { session } from '@/lib/cms/session'
import type { User } from '@/lib/cms/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [me, setMe] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' })

  const fetchUsers = () => Promise.all([cms.users(), cms.me()])

  function apply([list, user]: Awaited<ReturnType<typeof fetchUsers>>) {
    setUsers(list)
    setMe(user)
  }

  async function reload() {
    apply(await fetchUsers())
  }

  useEffect(() => {
    Promise.all([cms.users(), cms.me()])
      .then(([list, user]) => {
        setUsers(list)
        setMe(user)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load users.'))
  }, [])

  async function changeOwnPassword() {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await cms.changePassword(pwd.currentPassword, pwd.newPassword)
      setNotice('Password changed. Please sign in again.')
      session.clear()
    } catch (e) {
      if (e instanceof BookingApiError && e.status === 422) {
        setError(Object.values(e.fields).join(' ') || e.message)
      } else {
        setError(e instanceof Error ? e.message : 'Password change failed.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function toggleActive(user: User) {
    if (user.id === me?.id) {
      setError('You can’t deactivate yourself.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await cms.updateUser(user.id, { isActive: !user.isActive })
      await reload()
      setNotice(`${user.name} is now ${user.isActive ? 'inactive' : 'active'}.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <p className="type-eyebrow text-burgundy">Access</p>
        <h1 className="font-serif text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-semibold text-shadow">Staff logins</h1>
      </header>

      {error ? (
        <p role="alert" className="rounded-[0.7rem] border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}
      {notice ? <p className="rounded-[0.7rem] border border-sage/40 bg-sage/15 px-4 py-3 text-sm text-[#3d4a32]">{notice}</p> : null}

      <section className="surface-card overflow-hidden rounded-[1rem] border border-coffee/12">
        <ul className="divide-y divide-coffee/10">
          {users.map((u) => (
            <li key={u.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-serif text-lg text-shadow">
                  {u.name} {u.id === me?.id ? <span className="text-sm text-burgundy">(you)</span> : null}
                </p>
                <p className="text-sm text-shadow/65">
                  {u.email} · {u.role}
                  {u.practitionerId ? ` · practitioner ${u.practitionerId}` : ''} · {u.isActive ? 'active' : 'inactive'}
                </p>
                <p className="text-xs text-coffee">Last login: {u.lastLoginAt ?? '—'}</p>
              </div>
              <Button type="button" size="sm" variant="outline" disabled={busy || u.id === me?.id} onClick={() => void toggleActive(u)}>
                {u.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-card grid gap-4 rounded-[1rem] border border-coffee/12 p-6 sm:p-8">
        <h2 className="font-serif text-2xl text-shadow">Change your password</h2>
        <p className="text-sm text-shadow/70">At least 12 characters. After a successful change you’ll be signed out.</p>
        <div className="grid gap-3 sm:max-w-md">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={pwd.currentPassword}
              onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              minLength={12}
              value={pwd.newPassword}
              onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
            />
          </div>
          <Button type="button" disabled={busy || pwd.newPassword.length < 12} onClick={() => void changeOwnPassword()}>
            Update password
          </Button>
        </div>
      </section>
    </div>
  )
}
