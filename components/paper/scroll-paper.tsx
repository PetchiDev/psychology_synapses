'use client'

import { useId, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/components/animations/gsap'

export type PaperMotion = 'roll' | 'drift' | 'sway' | 'settle' | 'lift'

interface ScrollPaperProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  seed?: number
  tilt?: number
  /** Legacy idle float — prefer `motion` for varied vintage behaviours. */
  float?: boolean
  stain?: boolean
  /**
   * Distinct vintage paper behaviours:
   * roll = scroll unfurls like a parchment roll
   * drift / sway / settle / lift = different idle breathing after reveal
   */
  motion?: PaperMotion
}

const IDLE: Record<PaperMotion, string> = {
  roll: 'paper-idle-drift',
  drift: 'paper-idle-drift',
  sway: 'paper-idle-sway',
  settle: 'paper-idle-settle',
  lift: 'paper-idle-lift',
}

/**
 * A wrinkled, coffee-stained sheet with a lightly burnt, irregular edge.
 * Each instance can open and breathe with a different vintage motion.
 */
export function ScrollPaper({
  children,
  className,
  contentClassName,
  seed = 3,
  tilt = -1.2,
  float = false,
  stain = true,
  motion = float ? 'drift' : 'settle',
}: ScrollPaperProps) {
  const root = useRef<HTMLDivElement>(null)
  const curl = useRef<HTMLSpanElement>(null)
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const rough = `${id}-rough`
  const char = `${id}-char`
  const cut = `${id}-cut`

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(el, { clearProps: 'all', opacity: 1 })
        if (curl.current) gsap.set(curl.current, { autoAlpha: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const from =
          motion === 'roll'
            ? { opacity: 0.2, scaleY: 0.08, rotateX: 68, y: -24, filter: 'blur(3px)', transformOrigin: '50% 0%' }
            : motion === 'lift'
              ? { opacity: 0, y: 56, rotate: tilt - 4, scale: 0.96, filter: 'blur(4px)', transformOrigin: '50% 80%' }
              : motion === 'sway'
                ? { opacity: 0, y: 36, rotate: tilt + (tilt >= 0 ? 8 : -8), transformOrigin: '20% 100%' }
                : motion === 'drift'
                  ? { opacity: 0, y: 42, x: tilt > 0 ? 18 : -18, rotate: tilt, filter: 'blur(2px)' }
                  : { opacity: 0, y: 28, scale: 0.985, rotate: tilt * 0.4 }

        gsap.set(el, { ...from, force3D: true })
        if (curl.current && motion === 'roll') gsap.set(curl.current, { autoAlpha: 1, scaleY: 1 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })

        tl.to(el, {
          opacity: 1,
          scaleY: 1,
          scale: 1,
          rotateX: 0,
          rotate: tilt,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          duration: motion === 'roll' ? 1.55 : 1.15,
          ease: motion === 'roll' ? 'power3.out' : 'power2.out',
          clearProps: 'filter',
          onComplete: () => {
            el.dataset.paperReady = 'true'
            el.classList.add(IDLE[motion])
          },
        })

        if (curl.current && motion === 'roll') {
          tl.to(
            curl.current,
            { autoAlpha: 0, scaleY: 0.2, y: -8, duration: 0.7, ease: 'power2.in' },
            '-=0.85',
          )
        }
      })
    },
    { scope: root, dependencies: [motion, tilt] },
  )

  return (
    <div
      ref={root}
      className={cn('relative isolate [perspective:900px]', className)}
      style={{ '--tilt': `${tilt}deg`, '--paper-seed': seed } as CSSProperties}
      data-paper-motion={motion}
    >
      <span
        ref={curl}
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-0 right-[6%] left-[6%] z-20 h-5 origin-top rounded-b-[100%] bg-[linear-gradient(180deg,rgb(90_52_24/0.55),rgb(122_74_36/0.2)_55%,transparent)] opacity-0 shadow-[0_10px_18px_-8px_rgb(42_26_16/0.55)]',
          motion === 'roll' && 'will-change-transform',
        )}
      />
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 -z-10 size-full overflow-visible drop-shadow-[0_26px_30px_rgb(42_26_16/0.28)]"
      >
        <defs>
          <filter id={rough} x="-4%" y="-4%" width="108%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves="4" seed={seed} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id={char} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves="4" seed={seed} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" result="shape" />
            <feGaussianBlur in="shape" stdDeviation="2.2" />
          </filter>
          <mask id={cut} maskUnits="userSpaceOnUse">
            <rect x="1.6%" y="2%" width="96.8%" height="96%" rx="6" fill="#fff" filter={`url(#${rough})`} />
          </mask>
        </defs>
        <rect x="0.6%" y="0.8%" width="98.8%" height="98.4%" rx="8" fill="#3b2011" opacity="0.9" filter={`url(#${char})`} />
        <rect x="1%" y="1.4%" width="98%" height="97.2%" rx="8" fill="#7a4a24" opacity="0.75" filter={`url(#${rough})`} />
        <g mask={`url(#${cut})`}>
          <rect width="100%" height="100%" fill="#efe0bd" />
          <image href="/images/textures/scroll-paper.jpg" width="100%" height="100%" preserveAspectRatio="none" />
          {stain ? (
            <>
              <circle cx="86%" cy="16%" r="34" fill="none" stroke="#8a5528" strokeOpacity="0.16" strokeWidth="5" filter={`url(#${rough})`} />
              <circle cx="12%" cy="88%" r="18" fill="#8a5528" fillOpacity="0.07" filter={`url(#${rough})`} />
            </>
          ) : null}
        </g>
      </svg>
      <div className={cn('relative', contentClassName)}>{children}</div>
    </div>
  )
}
