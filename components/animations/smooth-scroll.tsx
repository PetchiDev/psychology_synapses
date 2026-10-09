'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenis } from '@/lib/smooth-scroll'
import { gsap, ScrollTrigger } from './gsap'

const NATIVE_SCROLL_AREAS = '[data-slot="sheet-content"], [data-slot="dialog-content"], [data-radix-popper-content-wrapper]'

export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lenis: Lenis | null = null
    let lockObserver: MutationObserver | null = null
    const tick = (time: number) => lenis?.raf(time * 1000)

    const start = () => {
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.085,
        wheelMultiplier: 0.9,
        stopInertiaOnNavigate: true,
        prevent: (node) => Boolean(node.closest(NATIVE_SCROLL_AREAS)),
      })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      // Radix dialogs and sheets lock the page via this attribute; inertia scrolling must pause with them.
      lockObserver = new MutationObserver(() => {
        if (document.body.hasAttribute('data-scroll-locked')) lenis?.stop()
        else lenis?.start()
      })
      lockObserver.observe(document.body, { attributes: true, attributeFilter: ['data-scroll-locked'] })
      setLenis(lenis)
    }

    const stop = () => {
      lockObserver?.disconnect()
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis?.destroy()
      lenis = null
      setLenis(null)
    }

    const sync = () => {
      if (reduceMotion.matches) stop()
      else if (!lenis) start()
    }

    sync()
    reduceMotion.addEventListener('change', sync)
    return () => {
      reduceMotion.removeEventListener('change', sync)
      stop()
    }
  }, [])

  return null
}
