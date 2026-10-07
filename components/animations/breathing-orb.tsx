'use client'

import { useRef } from 'react'
import { controlAmbient } from '@/lib/ambient'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from './gsap'

const PHASE = 4

export function BreathingOrb({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
        tl.set('[data-label="in"]', { autoAlpha: 1 })
          .set('[data-label="out"]', { autoAlpha: 0 })
          .fromTo('[data-orb]', { scale: 0.68 }, { scale: 1, duration: PHASE })
          .fromTo('[data-halo]', { scale: 0.8, opacity: 0.25 }, { scale: 1.12, opacity: 0.65, duration: PHASE }, '<')
          .to('[data-label="in"]', { autoAlpha: 0, duration: 0.6 }, `>-0.6`)
          .to('[data-label="out"]', { autoAlpha: 1, duration: 0.6 }, '<')
          .to('[data-orb]', { scale: 0.68, duration: PHASE }, '<')
          .to('[data-halo]', { scale: 0.8, opacity: 0.25, duration: PHASE }, '<')
          .to('[data-label="out"]', { autoAlpha: 0, duration: 0.6 }, '>-0.6')
          .to('[data-label="in"]', { autoAlpha: 1, duration: 0.6 }, '<')
        return controlAmbient([tl], root.current)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className={cn('relative grid place-items-center', className)}>
      <div aria-hidden="true" className="relative grid aspect-square w-full max-w-[19rem] place-items-center">
        <div data-halo className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(205_195_227/0.55)_0%,rgb(185_199_227/0.25)_45%,transparent_70%)]" />
        <div className="absolute inset-[12%] rounded-full border border-paper/15" />
        <div
          data-orb
          className="relative grid size-[62%] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fbf3e6_0%,var(--peach)_38%,var(--lavender)_72%,#9d93c2_100%)] shadow-[0_0_60px_10px_rgb(205_195_227/0.35)]"
        >
          <span data-label="in" className="absolute font-serif text-xl text-dusk">
            Breathe in
          </span>
          <span data-label="out" className="absolute font-serif text-xl text-dusk opacity-0">
            Breathe out
          </span>
        </div>
      </div>
      <p className="mt-6 max-w-xs text-center text-sm leading-relaxed text-paper/75">
        Follow the circle for a moment: breathe in for four as it grows, and out for four as it softens.
      </p>
    </div>
  )
}
