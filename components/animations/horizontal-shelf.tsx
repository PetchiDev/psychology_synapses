'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'motion/react'
import { useMediaQuery, useMotionAllowed } from '@/lib/use-motion-allowed'
import { SwipeRail } from './swipe-rail'

interface HorizontalShelfProps {
  intro: ReactNode
  label: string
  children: ReactNode
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function ShelfPlank() {
  return (
    <div aria-hidden="true" className="relative h-5 shrink-0 bg-[linear-gradient(180deg,#6b4528_0%,#4a2e1c_30%,#2b1a10_100%)] shadow-[0_14px_24px_-6px_rgb(0_0_0/0.6)]">
      <span className="absolute inset-x-0 top-0 h-px bg-gold/40" />
    </div>
  )
}

export function HorizontalShelf({ intro, label, children }: HorizontalShelfProps) {
  const section = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const motionAllowed = useMotionAllowed()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const pin = motionAllowed && desktop

  const travel = useMotionValue(0)
  const height = useTransform(() => `calc(100vh + ${travel.get()}px)`)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(() => -travel.get() * clamp01((scrollYProgress.get() - 0.04) / 0.92))

  useEffect(() => {
    const trackEl = track.current
    const viewportEl = viewport.current
    if (!pin || !trackEl || !viewportEl) return
    const observer = new ResizeObserver(() => travel.set(Math.max(0, trackEl.scrollWidth - viewportEl.clientWidth)))
    observer.observe(trackEl)
    observer.observe(viewportEl)
    return () => observer.disconnect()
  }, [pin, travel])

  if (!pin) {
    return (
      <div ref={section}>
        <div className="container-editorial">{intro}</div>
        <div className="mt-10">
          <SwipeRail
            label={label}
            tone="light"
            hint="swipe the shelf"
            base={<ShelfPlank />}
            indicatorClassName="container-editorial mt-5"
            className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-px-4 px-4 pt-2 pb-5 sm:gap-5 sm:scroll-px-7 sm:px-7"
          >
            {children}
          </SwipeRail>
        </div>
      </div>
    )
  }

  return (
    <motion.div ref={section} className="relative" style={{ height }}>
      <div ref={viewport} className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden pt-16">
        <motion.ul
          ref={track}
          aria-label={label}
          style={{ x }}
          className="flex w-max items-end gap-8 px-[max(2.5rem,calc((100vw-82rem)/2+2.5rem))] will-change-transform"
        >
          <li className="w-[30rem] shrink-0 self-center pr-6">{intro}</li>
          {children}
        </motion.ul>
        <ShelfPlank />
      </div>
    </motion.div>
  )
}
