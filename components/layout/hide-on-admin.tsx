'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

/** Leaves the public site's chrome out of the admin screens. */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return pathname.startsWith('/admin') ? null : children
}
