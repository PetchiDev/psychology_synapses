'use client'

import { useRef, type CSSProperties } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { workAreas } from '@/data/content'
import { cn } from '@/lib/utils'

const DESKTOP_SLOTS = [
  { className: 'left-[4%] top-[6%] rotate-[-3deg]', delay: 0 },
  { className: 'right-[2%] top-[14%] rotate-[2.5deg]', delay: 0.12 },
  { className: 'left-[8%] bottom-[8%] rotate-[2deg]', delay: 0.22 },
  { className: 'right-[4%] bottom-[4%] rotate-[-2deg]', delay: 0.32 },
] as const

/**
 * Hero aside for Work With Me: four living “pathway” cards that float and
 * connect to a centre hub — content-relevant motion, no empty right column.
 */
export function WorkWaysAside() {
  const root = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [18, -28])

  return (
    <motion.div ref={root} style={{ y: drift }} className="relative w-full">
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden" aria-label="Ways to work with me">
        {workAreas.map((area) => {
          const Icon = area.icon
          return (
            <li key={area.slug}>
              <Link
                href={`#${area.slug}`}
                className={cn(
                  'group flex h-full min-h-[9.5rem] flex-col gap-3 rounded-[1rem] border border-coffee/12 bg-paper/90 p-4 shadow-[0_14px_28px_-22px_rgb(42_26_16/0.5)] transition-[transform,border-color,box-shadow] duration-500',
                  'hover:-translate-y-1 hover:border-burgundy/30 hover:shadow-lifted active:scale-[0.98]',
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-burgundy/10 text-burgundy transition-colors duration-500 group-hover:bg-burgundy group-hover:text-paper">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-serif text-lg text-burgundy/40">{area.number}</span>
                </span>
                <span className="font-serif text-[1.02rem] leading-snug font-semibold text-shadow sm:text-[1.08rem]">{area.title}</span>
                <span className="mt-auto font-ui text-[0.6rem] tracking-[0.16em] text-coffee uppercase">{area.forWhom}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="relative hidden min-h-[28rem] lg:block xl:min-h-[30rem]" aria-label="Ways to work with me">
        <svg aria-hidden="true" viewBox="0 0 420 460" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id="way-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(122 35 38)" stopOpacity="0.05" />
              <stop offset="50%" stopColor="rgb(122 35 38)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(196 149 74)" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path d="M210 230 L95 95" stroke="url(#way-line)" strokeWidth="1.2" pathLength="1" fill="none" className={cn(!reduce && 'ways-draw')} />
          <path
            d="M210 230 L330 110"
            stroke="url(#way-line)"
            strokeWidth="1.2"
            pathLength="1"
            fill="none"
            className={cn(!reduce && 'ways-draw')}
            style={{ animationDelay: '0.2s' }}
          />
          <path
            d="M210 230 L110 360"
            stroke="url(#way-line)"
            strokeWidth="1.2"
            pathLength="1"
            fill="none"
            className={cn(!reduce && 'ways-draw')}
            style={{ animationDelay: '0.35s' }}
          />
          <path
            d="M210 230 L325 365"
            stroke="url(#way-line)"
            strokeWidth="1.2"
            pathLength="1"
            fill="none"
            className={cn(!reduce && 'ways-draw')}
            style={{ animationDelay: '0.5s' }}
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 z-10 flex size-[7.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-burgundy text-center text-paper shadow-[0_20px_40px_-12px_rgb(122_35_38/0.55)] ring-8 ring-paper/80">
          {!reduce ? <span aria-hidden="true" className="ways-pulse absolute inset-0 rounded-full bg-burgundy/30" /> : null}
          <span className="relative font-serif text-3xl leading-none font-semibold">04</span>
          <span className="relative mt-1 font-ui text-[0.58rem] tracking-[0.22em] uppercase opacity-80">pathways</span>
        </div>

        {workAreas.map((area, index) => {
          const Icon = area.icon
          const slot = DESKTOP_SLOTS[index]!
          return (
            <Link
              key={area.slug}
              href={`#${area.slug}`}
              className={cn(
                'group absolute z-20 w-[11.5rem] rounded-[1rem] border border-coffee/12 bg-paper/95 p-4 shadow-[0_18px_36px_-20px_rgb(42_26_16/0.55)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-500',
                'hover:z-30 hover:-translate-y-1.5 hover:border-burgundy/35 hover:shadow-[0_28px_48px_-18px_rgb(122_35_38/0.35)]',
                slot.className,
                !reduce && 'ways-float',
              )}
              style={!reduce ? ({ animationDelay: `${slot.delay}s` } as CSSProperties) : undefined}
            >
              <span className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-burgundy/10 text-burgundy transition-colors duration-500 group-hover:bg-burgundy group-hover:text-paper">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="font-serif text-xl text-burgundy/35 transition-colors duration-500 group-hover:text-burgundy/70">{area.number}</span>
              </span>
              <span className="block font-serif text-[1.05rem] leading-snug font-semibold text-shadow">{area.title}</span>
              <span className="mt-2 block text-[0.78rem] leading-snug text-coffee">{area.caption}</span>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
