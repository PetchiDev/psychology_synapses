'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, type PanInfo } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { workAreas } from '@/data/content'
import { cn } from '@/lib/utils'
import { useMotionAllowed } from '@/lib/use-motion-allowed'

const INTERVAL = 5200
const COUNT = workAreas.length

/** Where a card sits in the deck: 0 is the front card, then two behind it to the right, and the last one tucked to the left. */
const POSE = [
  { x: '0%', y: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: '7%', y: -14, rotate: 4, scale: 0.94, opacity: 0.85 },
  { x: '13%', y: -26, rotate: 8, scale: 0.88, opacity: 0.6 },
  { x: '-8%', y: -12, rotate: -6, scale: 0.9, opacity: 0.45 },
]

/** Hero aside for Work With Me: a 3D deck of the four areas that turns on its own, by tab, or by swipe. */
export function WorkWaysAside() {
  const animate = useMotionAllowed()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const playing = animate && !paused

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % COUNT), INTERVAL)
    return () => window.clearTimeout(timer)
  }, [playing, active])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 60) return
    setActive((current) => (current + (info.offset.x < 0 ? 1 : COUNT - 1)) % COUNT)
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[27rem] overflow-x-clip pt-8 lg:max-w-[28rem]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Ways to work with me"
    >
      <div
        aria-hidden="true"
        className="ambient-breathe absolute inset-x-[8%] top-[18%] bottom-[22%] -z-10 rounded-full bg-[radial-gradient(ellipse,rgb(217_165_63/0.32),rgb(122_35_38/0.08)_55%,transparent_72%)] blur-2xl"
      />

      <div className="grid pr-[17%] pl-[10%] [perspective:1400px] *:[grid-area:1/1]">
        {workAreas.map((area, index) => {
          const slot = (index - active + COUNT) % COUNT
          const front = slot === 0
          const Icon = area.icon
          return (
            <motion.article
              key={area.slug}
              aria-hidden={!front}
              inert={!front}
              initial={false}
              animate={POSE[slot]}
              transition={animate ? { type: 'spring', stiffness: 170, damping: 22, mass: 0.9 } : { duration: 0 }}
              drag={front && animate ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              onDragEnd={onDragEnd}
              style={{ zIndex: COUNT - slot, transformOrigin: '50% 100%' }}
              className={cn(
                'overflow-hidden rounded-[1.25rem] border border-[#b8893b]/35 bg-paper shadow-[0_30px_60px_-30px_rgb(42_26_16/0.65)]',
                front && 'cursor-grab active:cursor-grabbing',
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ scale: front && animate ? 1 : 1.12 }}
                  transition={{ duration: front ? 6 : 0.6, ease: 'easeOut' }}
                >
                  <Image src={area.image.src} alt="" fill sizes="(min-width: 1024px) 28rem, 92vw" className="pointer-events-none object-cover" draggable={false} />
                </motion.div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(36_21_13/0.05)_35%,rgb(36_21_13/0.72))]" />
                <span className="absolute top-4 left-4 inline-flex size-10 items-center justify-center rounded-full bg-paper/90 text-burgundy shadow-md backdrop-blur-sm">
                  <Icon className="size-[1.1rem]" aria-hidden="true" />
                </span>
                <span className="absolute right-5 bottom-3 font-serif text-[3.4rem] leading-none text-paper/90 [text-shadow:0_4px_18px_rgb(0_0_0/0.45)]">
                  {area.number}
                </span>
              </div>
              <div className="grid gap-3 p-5 sm:p-6">
                <span className="w-fit rounded-full border border-[#b8893b]/40 bg-[#f6e3b0]/50 px-3 py-1 font-ui text-[0.62rem] tracking-[0.18em] text-coffee uppercase">
                  {area.forWhom}
                </span>
                <p className="font-serif text-[1.45rem] leading-tight font-semibold text-shadow sm:text-[1.6rem]">{area.title}</p>
                <p className="type-hand text-lg text-burgundy/85">{area.caption}</p>
                <Link
                  href={`#${area.slug}`}
                  className="group/link mt-1 inline-flex w-fit items-center gap-2 font-ui text-[0.72rem] font-semibold tracking-[0.2em] text-burgundy uppercase"
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover/link:bg-[length:100%_1px]">
                    Explore this area
                  </span>
                  <ArrowDown className="size-3.5 transition-transform duration-500 group-hover/link:translate-y-0.5" aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2" role="group" aria-label="Choose an area">
        {workAreas.map((area, index) => {
          const current = index === active
          return (
            <button
              key={area.slug}
              type="button"
              aria-pressed={current}
              aria-label={`Show ${area.title}`}
              onClick={() => setActive(index)}
              className="group grid min-h-11 content-center gap-2 text-left"
            >
              <span className={cn('font-serif text-lg leading-none transition-colors duration-300', current ? 'text-burgundy' : 'text-shadow/40 group-hover:text-shadow/70')}>
                {area.number}
              </span>
              <span className="relative h-[3px] overflow-hidden rounded-full bg-coffee/15">
                {current ? (
                  <motion.span
                    key={`${active}-${playing}`}
                    className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#8c5f1b,#e9c46a)]"
                    initial={{ width: playing ? '0%' : '100%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: playing ? INTERVAL / 1000 : 0, ease: 'linear' }}
                  />
                ) : null}
              </span>
            </button>
          )
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {`${workAreas[active].number}: ${workAreas[active].title}`}
      </p>
    </div>
  )
}
