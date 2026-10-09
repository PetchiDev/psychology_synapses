import { getLenis } from './smooth-scroll'

const HEADER_OFFSET = 96

export const samePageHash = (href: string) => {
  const url = new URL(href, window.location.href)
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return null
  return url.hash
}

export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const target = document.getElementById(id)
  if (!target) return false
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(target, { offset: -HEADER_OFFSET, duration: 1.6 })
  } else {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }
  if (window.location.hash !== hash) window.history.pushState(null, '', hash)
  return true
}
