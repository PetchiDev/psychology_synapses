'use client'

import type { ReactNode } from 'react'
import { useAdminToken } from '@/lib/cms/session'
import { AdminShell } from './admin-shell'
import { AdminSignIn } from './admin-signin'

export function AdminGuard({ children }: { children: ReactNode }) {
  const token = useAdminToken()
  if (!token) return <AdminSignIn />
  return <AdminShell>{children}</AdminShell>
}
