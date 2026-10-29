'use client'

import { useEffect, useState } from 'react'
import { fetchOpeningHours } from '@/lib/booking/api'
import { siteConfig } from '@/lib/site'

/**
 * Opening hours as set in the CMS (Settings → Opening hours text). Shows the built-in label from
 * lib/site.ts until the API answers, and keeps it if the API can't be reached.
 */
export function OpeningHours({ fallback = siteConfig.hoursLabel }: { fallback?: string }) {
  const [text, setText] = useState<string>(fallback)
  useEffect(() => {
    let active = true
    fetchOpeningHours().then((hours) => {
      if (active && hours) setText(hours)
    })
    return () => {
      active = false
    }
  }, [])
  return <>{text}</>
}
