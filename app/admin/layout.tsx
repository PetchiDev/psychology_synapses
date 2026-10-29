import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AdminGuard } from '@/components/admin/admin-guard'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

function AdminFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <p className="font-serif text-xl text-shadow/70">Opening the desk…</p>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminGuard>{children}</AdminGuard>
    </Suspense>
  )
}
