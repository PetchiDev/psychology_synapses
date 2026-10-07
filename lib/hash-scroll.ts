export const samePageHash = (href: string) => {
  const url = new URL(href, window.location.href)
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return null
  return url.hash
}

export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const target = document.getElementById(id)
  if (!target) return false
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  if (window.location.hash !== hash) window.history.pushState(null, '', hash)
  return true
}
