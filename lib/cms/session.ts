'use client'

import { useSyncExternalStore } from 'react'

const KEY = 'pss-admin-token'
const EXP_KEY = 'pss-admin-expires'
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const session = {
  get: () => (typeof window === 'undefined' ? null : window.sessionStorage.getItem(KEY)),
  getExpires: () => (typeof window === 'undefined' ? null : window.sessionStorage.getItem(EXP_KEY)),
  set(token: string, expiresAt?: string) {
    window.sessionStorage.setItem(KEY, token)
    if (expiresAt) window.sessionStorage.setItem(EXP_KEY, expiresAt)
    notify()
  },
  clear() {
    window.sessionStorage.removeItem(KEY)
    window.sessionStorage.removeItem(EXP_KEY)
    notify()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export const useAdminToken = () => useSyncExternalStore(session.subscribe, session.get, () => null)
