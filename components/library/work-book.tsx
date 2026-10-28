'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  animate,
  easeInOut,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { workAreas, type WorkArea } from '@/data/content'
import { cn } from '@/lib/utils'
import { useMediaQuery, useMotionAllowed } from '@/lib/use-motion-allowed'
import { Ornament } from './ornament'

/** Share of the scroll spent resting on the first and last page. */
const DWELL = 0.06
/** Share of each page's scroll slot spent still, before and after the turn. */
const REST = 0.14
const NOTEBOOK_TURN_SVH = 52

const turnRange = (leaf: number, turns: number): [number, number] => {
  const span = 1 - DWELL * 2
  return [DWELL + (span * (leaf + REST)) / turns, DWELL + (span * (leaf + 1 - REST)) / turns]
}

interface BookProps {
  areas: WorkArea[]
}

export function WorkBook() {
  const motionAllowed = useMotionAllowed()
  const wide = useMediaQuery('(min-width: 1024px)', true)

  if (!motionAllowed) return <StaticPages areas={workAreas} />
  return wide ? <Spread key="spread" areas={workAreas} /> : <Notebook key="notebook" areas={workAreas} />
}

function useBookScroll(total: number) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 26, mass: 0.5 })
  const [page, setPage] = useState(0)
  const turns = total - 1

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const turned = Array.from({ length: turns }, (_, leaf) => turnRange(leaf, turns)).filter(
      ([start, end]) => value > (start + end) / 2,
    ).length
    setPage((current) => (current === turned ? current : turned))
  })

  return { ref, progress, page, turns }
}

/* Desktop: an open book, pages turn right to left over the spine. */

function Spread({ areas }: BookProps) {
  const total = areas.length
  const { ref, progress, page, turns } = useBookScroll(total)

  return (
    <div ref={ref} className="relative" style={{ height: `calc(100dvh + ${turns * 62}vh)` }}>
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center gap-6 pt-24 pb-6">
        <div
          aria-hidden="true"
          className="relative w-full [container-type:inline-size]"
          style={{ maxWidth: 'calc((100dvh - 15rem) * 1.5)' }}
        >
          <span className="absolute -bottom-9 left-[calc(50%+2.2rem)] h-14 w-3.5 bg-burgundy shadow-[0_6px_10px_-4px_rgb(0_0_0/0.4)] [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]" />
          <div className="leather-surface absolute -inset-3.5 rounded-[0.7rem] shadow-[0_50px_80px_-34px_rgb(36_21_13/0.8)]" />
          <div className="relative aspect-[3/2] [perspective:2600px]">
            <PageStack side="left" />
            <PageStack side="right" />
            <div className="absolute inset-y-0 left-0 w-1/2">
              <PlatePage area={areas[0]} />
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2">
              <TextPage area={areas[turns]} index={turns} total={total} />
            </div>
            {areas.slice(0, turns).map((area, leaf) => (
              <SpreadLeaf
                key={area.slug}
                leaf={leaf}
                turns={turns}
                progress={progress}
                front={<TextPage area={area} index={leaf} total={total} />}
                back={<PlatePage area={areas[leaf + 1]} />}
              />
            ))}
            <span className="pointer-events-none absolute inset-y-0 left-1/2 z-[150] w-20 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(70_45_25/0.14)_40%,rgb(70_45_25/0.3)_50%,rgb(70_45_25/0.14)_60%,transparent)]" />
          </div>
        </div>
        <BookFooter areas={areas} page={page} />
      </div>
    </div>
  )
}

interface LeafProps {
  leaf: number
  turns: number
  progress: MotionValue<number>
  front: ReactNode
  back: ReactNode
}

function SpreadLeaf({ leaf, turns, progress, front, back }: LeafProps) {
  const angle = useTransform(progress, turnRange(leaf, turns), [0, -180], { ease: easeInOut })
  const zIndex = useTransform(angle, (value) => (value > -0.5 ? 100 + turns - leaf : value < -179.5 ? 10 + leaf : 300))
  const bend = useTransform(angle, [0, -90, -180], [0, -4, 0])
  const frontShade = useTransform(angle, [0, -90], [0, 0.5])
  const backShade = useTransform(angle, [-90, -180], [0.5, 0])
  const gloss = useTransform(angle, [-10, -60, -120, -170], [0, 0.6, 0.6, 0])

  return (
    <motion.div style={{ rotateY: angle, skewY: bend, zIndex }} className="absolute inset-y-0 right-0 w-1/2 origin-left [transform-style:preserve-3d]">
      <div className="absolute inset-0 [backface-visibility:hidden]">
        {front}
        <motion.span
          style={{ opacity: frontShade }}
          className="pointer-events-none absolute inset-0 rounded-r-[0.4rem] bg-[linear-gradient(90deg,rgb(42_26_16/0.6),rgb(42_26_16/0.12)_55%,transparent)]"
        />
        <motion.span
          style={{ opacity: gloss }}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,transparent_30%,rgb(255_244_214/0.45)_55%,transparent_75%)]"
        />
      </div>
      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
        {back}
        <motion.span
          style={{ opacity: backShade }}
          className="pointer-events-none absolute inset-0 rounded-l-[0.4rem] bg-[linear-gradient(270deg,rgb(42_26_16/0.6),rgb(42_26_16/0.12)_55%,transparent)]"
        />
      </div>
    </motion.div>
  )
}

function PageStack({ side }: { side: 'left' | 'right' }) {
  const left = side === 'left'
  return (
    <div
      className={cn(
        'absolute inset-y-0 w-1/2 bg-[#e8d6ad]',
        left
          ? 'left-0 rounded-l-[0.4rem] shadow-[-3px_3px_0_-1px_#dcc596,-6px_6px_0_-2px_#d2b984,-9px_9px_0_-3px_#c9ad76]'
          : 'right-0 rounded-r-[0.4rem] shadow-[3px_3px_0_-1px_#dcc596,6px_6px_0_-2px_#d2b984,9px_9px_0_-3px_#c9ad76]',
      )}
    />
  )
}

/* Phones and tablets: a single page, turned upward like a notebook. */

function Notebook({ areas }: BookProps) {
  const total = areas.length
  const { ref, page, turns } = useBookScroll(total)
  const turn = useMotionValue(0)

  useEffect(() => {
    const distance = Math.abs(page - turn.get())
    const controls = animate(turn, page, { duration: Math.max(0.45, 0.75 * distance), ease: 'linear' })
    return () => controls.stop()
  }, [page, turn])

  const restingPoints = Array.from({ length: total }, (_, index) => {
    if (index === 0) return 0
    if (index === turns) return 1
    return (turnRange(index - 1, turns)[1] + turnRange(index, turns)[0]) / 2
  })

  return (
    <div ref={ref} className="relative" style={{ height: `calc(100svh + ${turns * NOTEBOOK_TURN_SVH}svh)` }}>
      {restingPoints.map((point, index) => (
        <span
          key={index}
          data-page-snap
          className="absolute inset-x-0 h-px"
          style={{ top: `calc(${point} * ${turns * NOTEBOOK_TURN_SVH}svh + 6rem)` }}
        />
      ))}
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center gap-4 pt-24 pb-20 sm:pb-8">
        <div
          aria-hidden="true"
          className="relative w-[min(100%,25rem)] [container-type:inline-size] [perspective:1600px]"
          style={{ height: 'min(calc(100svh - 16rem), 38rem)' }}
        >
          <div className="leather-surface absolute -inset-2.5 rounded-[0.6rem] shadow-[0_36px_60px_-30px_rgb(36_21_13/0.8)]" />
          <div className="absolute inset-0 rounded-[0.4rem] bg-[#e8d6ad] shadow-[0_3px_0_-1px_#dcc596,0_6px_0_-2px_#d2b984,0_9px_0_-3px_#c9ad76]" />
          <div className="absolute inset-0">
            <NotebookPage area={areas[turns]} index={turns} total={total} />
          </div>
          {areas.slice(0, turns).map((area, leaf) => (
            <NotebookLeaf key={area.slug} leaf={leaf} turn={turn}>
              <NotebookPage area={area} index={leaf} total={total} />
            </NotebookLeaf>
          ))}
          <span className="absolute -top-3 left-1/2 z-[400] flex -translate-x-1/2 gap-5">
            {Array.from({ length: 6 }, (_, ring) => (
              <span key={ring} className="h-6 w-2.5 rounded-full border-2 border-[#8a6a3a] bg-[linear-gradient(90deg,#b8893b,#f3dfa0,#8a6a3a)]" />
            ))}
          </span>
        </div>
        <BookFooter areas={areas} page={page} />
      </div>
    </div>
  )
}

function NotebookLeaf({ leaf, turn, children }: { leaf: number; turn: MotionValue<number>; children: ReactNode }) {
  const angle = useTransform(turn, [leaf, leaf + 1], [0, 172], { ease: easeInOut })
  const zIndex = useTransform(angle, (value) => (value < 0.5 ? 100 - leaf : 300))
  const opacity = useTransform(angle, [120, 172], [1, 0])
  const visibility = useTransform(angle, (value) => (value > 171.5 ? 'hidden' : 'visible'))
  const shade = useTransform(angle, [0, 90], [0, 0.45])

  return (
    <motion.div style={{ rotateX: angle, zIndex, visibility }} className="absolute inset-0 origin-top [transform-style:preserve-3d]">
      <div className="absolute inset-0 [backface-visibility:hidden]">
        {children}
        <motion.span
          style={{ opacity: shade }}
          className="pointer-events-none absolute inset-0 rounded-[0.4rem] bg-[linear-gradient(180deg,rgb(42_26_16/0.55),rgb(42_26_16/0.1)_55%,transparent)]"
        />
      </div>
      <motion.div style={{ opacity }} className="paper-surface absolute inset-0 rounded-[0.4rem] [backface-visibility:hidden] [transform:rotateX(180deg)]" />
    </motion.div>
  )
}

/* Reduced motion: the pages laid out one after another. */

function StaticPages({ areas }: BookProps) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2">
      {areas.map((area, index) => (
        <li key={area.slug} className="grid gap-3">
          <div aria-hidden="true" className="h-[34rem] [container-type:inline-size]">
            <NotebookPage area={area} index={index} total={areas.length} />
          </div>
          <AreaLink area={area} />
        </li>
      ))}
    </ol>
  )
}

/* Page faces */

function Photo({ area, sizes }: { area: WorkArea; sizes: string }) {
  return (
    <Image
      src={area.image.src}
      alt=""
      fill
      sizes={sizes}
      className="object-cover sepia-[0.25] [mask-image:radial-gradient(ellipse_closest-side,#000_72%,transparent)]"
    />
  )
}

function PlatePage({ area }: { area: WorkArea }) {
  return (
    <div className="paper-surface relative flex h-full flex-col items-center overflow-hidden rounded-l-[0.4rem] px-[8%] pt-[7%] pb-[6%]">
      <span className="pointer-events-none absolute inset-y-0 right-0 w-[14%] bg-[linear-gradient(270deg,rgb(110_78_51/0.24),transparent)]" />
      <p className="font-ui text-[clamp(0.55rem,1.05cqw,0.68rem)] tracking-[0.3em] text-coffee uppercase">Area {area.number}</p>
      <div className="relative mt-[4%] min-h-0 w-full flex-1">
        <Photo area={area} sizes="(min-width: 1280px) 30rem, 36vw" />
      </div>
      <p className="type-hand mt-[3%] text-center text-[clamp(1rem,2.1cqw,1.4rem)] leading-snug text-burgundy">{area.caption}</p>
      <Ornament className="mt-[3%] h-3 w-24" />
    </div>
  )
}

function TextPage({ area, index, total }: { area: WorkArea; index: number; total: number }) {
  const Icon = area.icon
  return (
    <div className="paper-surface relative flex h-full flex-col overflow-hidden rounded-r-[0.4rem] px-[9%] pt-[8%] pb-[6%]">
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-[linear-gradient(90deg,rgb(110_78_51/0.24),transparent)]" />
      <div className="flex items-center justify-between font-ui text-[clamp(0.55rem,1.05cqw,0.68rem)] tracking-[0.26em] text-coffee uppercase">
        <span>Ways to work with me</span>
        <span>
          Page {index + 1} of {total}
        </span>
      </div>
      <div className="mt-[7%] flex items-center justify-between">
        <span className="font-serif text-[clamp(2.4rem,6.2cqw,4.4rem)] leading-none text-burgundy/85">{area.number}</span>
        <span className="leather-surface inline-flex size-[clamp(2.75rem,5.6cqw,3.75rem)] items-center justify-center rounded-full text-gold">
          <Icon className="size-[42%]" />
        </span>
      </div>
      <p className="mt-[6%] font-serif text-[clamp(1.25rem,2.8cqw,1.95rem)] leading-tight text-shadow">{area.title}</p>
      <Ornament className="mt-[3%] -ml-2 h-3 w-28" />
      <p className="drop-cap mt-[5%] text-[clamp(0.85rem,1.75cqw,1.05rem)] leading-relaxed text-shadow/80">{area.summary}</p>
      <p className="mt-[6%] font-ui text-[clamp(0.55rem,1.05cqw,0.66rem)] tracking-[0.24em] text-coffee uppercase">Written for</p>
      <p className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-gilt/40 bg-paper/60 px-3.5 py-1 text-[clamp(0.75rem,1.45cqw,0.875rem)] font-semibold text-coffee-deep">
        {area.forWhom}
      </p>
      <Icon strokeWidth={0.7} className="pointer-events-none absolute right-[6%] bottom-[9%] size-[34%] text-burgundy/[0.07]" />
      <p className="mt-auto text-center font-serif text-xs text-coffee">~ {index + 1} ~</p>
    </div>
  )
}

function NotebookPage({ area, index, total }: { area: WorkArea; index: number; total: number }) {
  const Icon = area.icon
  return (
    <div className="paper-surface relative flex h-full flex-col overflow-hidden rounded-[0.4rem] px-[7%] pt-[9%] pb-[5%]">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[9%] bg-[linear-gradient(180deg,rgb(110_78_51/0.2),transparent)]" />
      <div className="flex items-center justify-between font-ui text-[0.6rem] tracking-[0.24em] text-coffee uppercase">
        <span>Area {area.number}</span>
        <span>
          {index + 1} / {total}
        </span>
      </div>
      <div className="relative mt-3 min-h-[5rem] w-full flex-1">
        <Photo area={area} sizes="(min-width: 640px) 24rem, 88vw" />
      </div>
      <p className="type-hand mt-2 text-center text-[1.05rem] leading-snug text-burgundy">{area.caption}</p>
      <div className="mt-3 flex items-center gap-3 border-t border-gilt/30 pt-3">
        <span className="leather-surface inline-flex size-10 shrink-0 items-center justify-center rounded-full text-gold">
          <Icon className="size-4" />
        </span>
        <p className="font-serif text-[clamp(1.1rem,5.2cqw,1.4rem)] leading-tight text-shadow">
          <span className="mr-2 text-burgundy/80">{area.number}</span>
          {area.title}
        </p>
      </div>
      <p className="mt-2.5 line-clamp-4 text-[clamp(0.88rem,3.9cqw,0.98rem)] leading-relaxed text-shadow/80">{area.summary}</p>
      <p className="mt-3 inline-flex w-fit items-center rounded-full border border-gilt/40 bg-paper/60 px-3 py-0.5 text-[0.8rem] font-semibold text-coffee-deep">
        {area.forWhom}
      </p>
    </div>
  )
}

function AreaLink({ area }: { area: WorkArea }) {
  return (
    <Link
      href={`/work-with-me#${area.slug}`}
      className="inline-flex w-fit items-center gap-2 border-b border-burgundy/30 pb-1 font-ui text-[0.72rem] font-semibold tracking-[0.14em] text-burgundy uppercase transition-[border-color,gap] duration-500 hover:gap-3 hover:border-burgundy"
    >
      {area.cta}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  )
}

function BookFooter({ areas, page }: { areas: WorkArea[]; page: number }) {
  const total = areas.length
  return (
    <div className="grid w-full max-w-md justify-items-center gap-3 px-1">
      <div aria-hidden="true" className="flex w-full items-center gap-4">
        <span className="font-ui text-[0.62rem] tracking-[0.24em] whitespace-nowrap text-coffee uppercase tabular-nums">
          Page {page + 1} / {total}
        </span>
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={cn('h-[3px] flex-1 rounded-full transition-colors duration-500', index <= page ? 'bg-burgundy' : 'bg-coffee/20')}
            />
          ))}
        </div>
        <span className="type-hand text-lg whitespace-nowrap text-burgundy">{page + 1 < total ? 'scroll to turn' : 'the last page'}</span>
      </div>
      <div key={areas[page].slug} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-500">
        <AreaLink area={areas[page]} />
      </div>
    </div>
  )
}
