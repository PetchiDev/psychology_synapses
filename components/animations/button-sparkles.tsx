'use client'

import { useEffect } from 'react'
import { gsap } from './gsap'

const DOTS = 7

export function ButtonSparkles() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const onClick = (event: MouseEvent) => {
      if (reduceMotion.matches) return
      const button = (event.target as Element | null)?.closest('.btn-shimmer')
      if (!button) return
      const rect = button.getBoundingClientRect()
      const x = event.clientX || rect.left + rect.width / 2
      const y = event.clientY || rect.top + rect.height / 2

      for (let index = 0; index < DOTS; index++) {
        const dot = document.createElement('span')
        dot.className = 'sparkle-dot'
        dot.setAttribute('aria-hidden', 'true')
        document.body.appendChild(dot)
        const angle = (index / DOTS) * Math.PI * 2 + gsap.utils.random(-0.3, 0.3)
        const distance = gsap.utils.random(22, 42)
        gsap.fromTo(
          dot,
          { x: x - 3, y: y - 3, scale: gsap.utils.random(0.8, 1.4), opacity: 1 },
          {
            x: x - 3 + Math.cos(angle) * distance,
            y: y - 3 + Math.sin(angle) * distance - 8,
            scale: 0,
            opacity: 0,
            duration: gsap.utils.random(0.9, 1.3),
            ease: 'power2.out',
            onComplete: () => dot.remove(),
          },
        )
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
