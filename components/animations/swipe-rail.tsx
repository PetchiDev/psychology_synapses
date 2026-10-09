'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SwipeRailProps {
  label: string
  children: ReactNode
  /** Classes for the list; include the breakpoint where it stops being a horizontal rail. */
  className?: string
  /** Classes for the progress row, typically hiding it from the same breakpoint. */
  indicatorClassName?: string
  hint?: string
  tone?: 'dark' | 'light'
  revealGroup?: boolean
  /** Rendered between the list and the progress row, e.g. a shelf the cards stand on. */
  base?: ReactNode
}

export function SwipeRail({
  label,
  children,
  className,
  indicatorClassName,
  hint = 'swipe to turn the pages',
  tone = 'dark',
  revealGroup = false,
  base,
}: SwipeRailProps) {
  const rail = useRef<HTMLUListElement>(null)
  const { scrollXProgress } = useScroll({ container: rail })
  const progress = useSpring(scrollXProgress, { stiffness: 220, damping: 32, mass: 0.4 })
  const light = tone === 'light'

  return (
    <>
      <ul
        ref={rail}
        aria-label={label}
        data-reveal-group={revealGroup ? '' : undefined}
        className={cn('swipe-rail', className)}
      >
        {children}
      </ul>
      {base}
      <div aria-hidden="true" className={cn('mt-4 flex items-center gap-4', indicatorClassName)}>
        <div className={cn('relative h-[3px] flex-1 overflow-hidden rounded-full', light ? 'bg-paper/15' : 'bg-coffee/15')}>
          <motion.span
            style={{ scaleX: progress }}
            className={cn(
              'absolute inset-0 origin-left rounded-full',
              light ? 'bg-[linear-gradient(90deg,var(--gilt),var(--candle))]' : 'bg-[linear-gradient(90deg,var(--burgundy),var(--gilt))]',
            )}
          />
        </div>
        <span className={cn('type-hand inline-flex shrink-0 items-center gap-1.5 text-lg', light ? 'text-gold' : 'text-burgundy')}>
          {hint}
          <ArrowRight className="swipe-nudge size-4" />
        </span>
      </div>
    </>
  )
}
