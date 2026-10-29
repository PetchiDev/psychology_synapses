'use client'

import { useEffect, useState } from 'react'
import { BookingApiError } from '@/lib/booking/api'
import { cms } from '@/lib/cms/api'
import { session } from '@/lib/cms/session'
import type { User } from '@/lib/cms/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'

/** 16 random characters, without look-alikes (0/O, 1/l/I), for passwords read out or pasted to someone. */
function generatePassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (b) => PASSWORD_CHARS[b % PASSWORD_CHARS.length]).join('')
}

const messageFor = (e: unknown, fallback: string) =>
  e instanceof BookingApiError && e.status === 422 ? Object.values(e.fields).join(' ') || e.message : e instanceof Error ? e.message : fallback

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [me, setMe] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' })
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' })
  const [reset, setReset] = useState<{ id: number; password: string } | null>(null)

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
      setError(messageFor(e, 'Password change failed.'))
    } finally {
      setBusy(false)
    }
  }

  async function createLogin() {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const user = await cms.createUser({ ...newUser, role: 'admin' })
      await reload()
      setNewUser({ name: '', email: '', password: '' })
      setNotice(`Login created for ${user.email}. Share the password privately; they can change it on this screen after signing in.`)
    } catch (e) {
      setError(messageFor(e, 'Could not create the login.'))
    } finally {
      setBusy(false)
    }
  }

  async function resetUserPassword() {
    if (!reset) return
    const user = users.find((u) => u.id === reset.id)
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await cms.resetPassword(reset.id, reset.password)
      setReset(null)
      setNotice(`New password set for ${user?.email ?? 'that login'}. Share it privately.`)
    } catch (e) {
      setError(messageFor(e, 'Password reset failed.'))
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
            <li key={u.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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
              {u.id === me?.id ? null : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => setReset(reset?.id === u.id ? null : { id: u.id, password: '' })}
                  >
                    Reset password
                  </Button>
                  <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void toggleActive(u)}>
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              )}
              {reset?.id === u.id ? (
                <form
                  className="grid w-full gap-2 sm:basis-full"
                  onSubmit={(e) => {
                    e.preventDefault()
                    void resetUserPassword()
                  }}
                >
                  <Label htmlFor={`reset-${u.id}`}>New password for {u.name}</Label>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      id={`reset-${u.id}`}
                      type="text"
                      autoComplete="off"
                      minLength={12}
                      maxLength={200}
                      required
                      className="sm:max-w-xs"
                      value={reset.password}
                      onChange={(e) => setReset({ id: u.id, password: e.target.value })}
                    />
                    <Button type="button" size="sm" variant="outline" onClick={() => setReset({ id: u.id, password: generatePassword() })}>
                      Generate
                    </Button>
                    <Button type="submit" size="sm" disabled={busy || reset.password.length < 12}>
                      Set password
                    </Button>
                  </div>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-card grid gap-4 rounded-[1rem] border border-coffee/12 p-6 sm:p-8">
        <h2 className="font-serif text-2xl text-shadow">Add a login</h2>
        <p className="text-sm text-shadow/70">Every CMS login can see and change everything here, so only add people you trust with patient details.</p>
        <form
          className="grid gap-3 sm:max-w-md"
          onSubmit={(e) => {
            e.preventDefault()
            void createLogin()
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="newName">Name</Label>
            <Input id="newName" required minLength={2} value={newUser.name} onChange={(e) => setNewUser((u) => ({ ...u, name: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newEmail">Email (used to sign in)</Label>
            <Input
              id="newEmail"
              type="email"
              required
              autoComplete="off"
              value={newUser.email}
              onChange={(e) => setNewUser((u) => ({ ...u, email: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword-initial">First password (at least 12 characters)</Label>
            <div className="flex gap-2">
              <Input
                id="newPassword-initial"
                type="text"
                autoComplete="off"
                required
                minLength={12}
                maxLength={200}
                value={newUser.password}
                onChange={(e) => setNewUser((u) => ({ ...u, password: e.target.value }))}
              />
              <Button type="button" variant="outline" onClick={() => setNewUser((u) => ({ ...u, password: generatePassword() }))}>
                Generate
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={busy || newUser.password.length < 12}>
            Create login
          </Button>
        </form>
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
