'use client'

import { useEffect } from 'react'
import { samePageHash, scrollToHash } from '@/lib/hash-scroll'

export function HashLinkHandler() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
      if (anchor.closest('[data-slot="sheet-content"]')) return
      const hash = samePageHash(anchor.href)
      if (!hash) return
      if (scrollToHash(hash)) event.preventDefault()
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
