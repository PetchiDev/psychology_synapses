'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, useScroll, useSpring } from 'motion/react'
import { workAreas } from '@/data/content'
import { cn } from '@/lib/utils'
import { useMotionAllowed } from '@/lib/use-motion-allowed'
import { WorkAreaSection } from './work-area'

/** The four areas of work, joined by a golden thread that draws as the reader scrolls. */
export function WorkJourney({ children }: { children?: ReactNode }) {
  const track = useRef<HTMLDivElement>(null)
  const chips = useRef<HTMLUListElement>(null)
  const animate = useMotionAllowed()
  const [active, setActive] = useState(workAreas[0].slug)

  const { scrollYProgress: reading } = useScroll({ target: track, offset: ['start 40%', 'end 60%'] })
  const progress = useSpring(reading, { stiffness: 120, damping: 24, mass: 0.4 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    workAreas.forEach((area) => {
      const section = document.getElementById(area.slug)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const list = chips.current
    const chip = list?.querySelector<HTMLElement>(`[data-chip="${active}"]`)
    if (!list || !chip) return
    list.scrollTo({ left: chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2, behavior: animate ? 'smooth' : 'auto' })
  }, [active, animate])

  return (
    <>
      <nav aria-label="Areas of work" className="sticky top-[5.25rem] z-30 border-y border-coffee/12 bg-paper/90 backdrop-blur-md">
        <ul ref={chips} className="container-editorial flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
          {workAreas.map((area) => {
            const current = active === area.slug
            return (
              <li key={area.slug} data-chip={area.slug} className="relative shrink-0">
                {current ? (
                  <motion.span
                    layoutId="work-chip"
                    aria-hidden="true"
                    transition={animate ? { type: 'spring', stiffness: 380, damping: 32 } : { duration: 0 }}
                    className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,#f6e3b0,#e2c27a)] shadow-[inset_0_0_0_1px_rgb(184_137_59/0.6)]"
                  />
                ) : null}
                <Link
                  href={`#${area.slug}`}
                  aria-current={current ? 'location' : undefined}
                  className={cn(
                    'relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.88rem] font-medium whitespace-nowrap transition-colors duration-300',
                    current ? 'text-shadow' : 'text-shadow/75 hover:text-burgundy',
                  )}
                >
                  <span className="font-serif text-base text-burgundy">{area.number}</span>
                  {area.title}
                </Link>
              </li>
            )
          })}
        </ul>
        <motion.span
          aria-hidden="true"
          style={{ scaleX: animate ? progress : 1 }}
          className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-[linear-gradient(90deg,#8c5f1b,#e9c46a,#8c5f1b)]"
        />
      </nav>

      <div className="container-editorial overflow-x-clip py-20 lg:py-28">
        <div
          ref={track}
          className="relative grid gap-28 pl-[var(--thread-pad)] [--thread-pad:1.75rem] [--thread-x:0.35rem] sm:[--thread-pad:2.75rem] sm:[--thread-x:0.75rem] lg:gap-36 lg:[--thread-pad:4rem] lg:[--thread-x:1.25rem]"
        >
          <span aria-hidden="true" className="absolute top-3 bottom-0 left-[var(--thread-x)] w-px -translate-x-1/2 bg-gilt/25" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: animate ? progress : 1 }}
            className="absolute top-3 bottom-0 left-[var(--thread-x)] w-[3px] origin-top -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#e9c46a,#b8893b_60%,#8c5f1b)] shadow-[0_0_10px_rgb(217_165_63/0.45)]"
          />
          {workAreas.map((area, index) => (
            <WorkAreaSection key={area.slug} area={area} index={index} />
          ))}
        </div>
        {children ? <div className="mt-28 lg:mt-36">{children}</div> : null}
      </div>
    </>
  )
}
