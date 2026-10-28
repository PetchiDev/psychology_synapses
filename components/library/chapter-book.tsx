'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
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
import { libraryChapters, type LibraryChapter } from '@/data/content'
import { cn } from '@/lib/utils'
import { useMediaQuery, useMotionAllowed } from '@/lib/use-motion-allowed'
import { Ornament } from './ornament'
import { ROMAN } from './roman'


/** Share of the scroll spent resting on the first and last page. */
const DWELL = 0.06
/** Share of each page's scroll slot spent still, before and after the turn. */
const REST = 0.14
const SPREAD_TURN_VH = 62
const NOTEBOOK_TURN_SVH = 52

const turnRange = (leaf: number, turns: number): [number, number] => {
  const span = 1 - DWELL * 2
  return [DWELL + (span * (leaf + REST)) / turns, DWELL + (span * (leaf + 1 - REST)) / turns]
}

const restingPoints = (total: number) => {
  const turns = total - 1
  return Array.from({ length: total }, (_, index) => {
    if (index === 0) return 0
    if (index === turns) return 1
    return (turnRange(index - 1, turns)[1] + turnRange(index, turns)[0]) / 2
  })
}

interface BookProps {
  chapters: LibraryChapter[]
}

export function ChapterBook() {
  const motionAllowed = useMotionAllowed()
  const wide = useMediaQuery('(min-width: 1024px)', true)

  if (!motionAllowed) return <StaticPages chapters={libraryChapters} />
  return wide ? <Spread key="spread" chapters={libraryChapters} /> : <Notebook key="notebook" chapters={libraryChapters} />
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

/** Invisible markers at each page's resting scroll position, so chapter links land on an open page. */
function ChapterAnchors({ chapters, distance, snap }: { chapters: LibraryChapter[]; distance: string; snap?: boolean }) {
  return restingPoints(chapters.length).map((point, index) => (
    <span
      key={chapters[index].slug}
      id={`chapter-${chapters[index].slug}`}
      data-page-snap={snap ? '' : undefined}
      className="absolute inset-x-0 h-px"
      style={{ top: `calc(${point} * ${distance} + 6rem)` }}
    />
  ))
}

/* Desktop: an open book, pages turn right to left over the spine. */

function Spread({ chapters }: BookProps) {
  const total = chapters.length
  const { ref, progress, page, turns } = useBookScroll(total)

  return (
    <div ref={ref} className="relative" style={{ height: `calc(100dvh + ${turns * SPREAD_TURN_VH}vh)` }}>
      <ChapterAnchors chapters={chapters} distance={`${turns * SPREAD_TURN_VH}vh`} />
      <div aria-hidden="true" className="sticky top-0 flex h-dvh flex-col items-center justify-center gap-7 pt-24 pb-8">
        <div className="relative w-full [container-type:inline-size]" style={{ maxWidth: 'calc((100dvh - 13rem) * 1.5)' }}>
          <span className="absolute -bottom-9 left-[calc(50%+2.2rem)] h-14 w-3.5 bg-burgundy shadow-[0_6px_10px_-4px_rgb(0_0_0/0.4)] [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]" />
          <div className="leather-surface absolute -inset-3.5 rounded-[0.7rem] shadow-[0_50px_80px_-34px_rgb(36_21_13/0.8)]" />
          <div className="relative aspect-[3/2] [perspective:2600px]">
            <PageStack side="left" />
            <PageStack side="right" />
            <div className="absolute inset-y-0 left-0 w-1/2">
              <PlatePage chapter={chapters[0]} index={0} />
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2">
              <TextPage chapter={chapters[turns]} index={turns} total={total} />
            </div>
            {chapters.slice(0, turns).map((chapter, leaf) => (
              <SpreadLeaf
                key={chapter.slug}
                leaf={leaf}
                turns={turns}
                progress={progress}
                front={<TextPage chapter={chapter} index={leaf} total={total} />}
                back={<PlatePage chapter={chapters[leaf + 1]} index={leaf + 1} />}
              />
            ))}
            <span className="pointer-events-none absolute inset-y-0 left-1/2 z-[150] w-20 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(70_45_25/0.14)_40%,rgb(70_45_25/0.3)_50%,rgb(70_45_25/0.14)_60%,transparent)]" />
          </div>
        </div>
        <BookProgress page={page} total={total} />
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

function Notebook({ chapters }: BookProps) {
  const total = chapters.length
  const { ref, page, turns } = useBookScroll(total)
  const turn = useMotionValue(0)

  useEffect(() => {
    const distance = Math.abs(page - turn.get())
    const controls = animate(turn, page, { duration: Math.max(0.45, 0.75 * distance), ease: 'linear' })
    return () => controls.stop()
  }, [page, turn])

  return (
    <div ref={ref} className="relative" style={{ height: `calc(100svh + ${turns * NOTEBOOK_TURN_SVH}svh)` }}>
      <ChapterAnchors chapters={chapters} distance={`${turns * NOTEBOOK_TURN_SVH}svh`} snap />
      <div aria-hidden="true" className="sticky top-0 flex h-svh flex-col items-center justify-center gap-5 pt-24 pb-20 sm:pb-8">
        <div
          className="relative w-[min(calc(100%-2.5rem),25rem)] [container-type:inline-size] [perspective:1600px]"
          style={{ height: 'min(calc(100svh - 13.5rem), 40rem)' }}
        >
          <div className="leather-surface absolute -inset-2.5 rounded-[0.6rem] shadow-[0_36px_60px_-30px_rgb(36_21_13/0.8)]" />
          <div className="absolute inset-0 rounded-[0.4rem] bg-[#e8d6ad] shadow-[0_3px_0_-1px_#dcc596,0_6px_0_-2px_#d2b984,0_9px_0_-3px_#c9ad76]" />
          <div className="absolute inset-0">
            <NotebookPage chapter={chapters[turns]} index={turns} total={total} />
          </div>
          {chapters.slice(0, turns).map((chapter, leaf) => (
            <NotebookLeaf key={chapter.slug} leaf={leaf} turn={turn}>
              <NotebookPage chapter={chapter} index={leaf} total={total} />
            </NotebookLeaf>
          ))}
          <span className="absolute -top-3 left-1/2 z-[400] flex -translate-x-1/2 gap-5">
            {Array.from({ length: 6 }, (_, ring) => (
              <span key={ring} className="h-6 w-2.5 rounded-full border-2 border-[#8a6a3a] bg-[linear-gradient(90deg,#b8893b,#f3dfa0,#8a6a3a)]" />
            ))}
          </span>
        </div>
        <BookProgress page={page} total={total} />
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

function StaticPages({ chapters }: BookProps) {
  return (
    <ol aria-hidden="true" className="container-editorial grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {chapters.map((chapter, index) => (
        <li key={chapter.slug} id={`chapter-${chapter.slug}`} className="h-[34rem] scroll-mt-28 [container-type:inline-size]">
          <NotebookPage chapter={chapter} index={index} total={chapters.length} />
        </li>
      ))}
    </ol>
  )
}

/* Page faces */

interface PageProps {
  chapter: LibraryChapter
  index: number
}

function PlatePage({ chapter, index }: PageProps) {
  const Icon = chapter.icon
  return (
    <div className="paper-surface relative flex h-full flex-col items-center justify-center overflow-hidden rounded-l-[0.4rem] px-[8%] pt-[7%] pb-[6%] text-center">
      <span className="pointer-events-none absolute inset-y-0 right-0 w-[14%] bg-[linear-gradient(270deg,rgb(110_78_51/0.24),transparent)]" />
      <p className="font-ui text-[clamp(0.55rem,1.05cqw,0.68rem)] tracking-[0.3em] text-coffee uppercase">Chapter {ROMAN[index]}</p>
      <span className="leather-surface mt-[8%] inline-flex size-[clamp(6rem,16cqw,10rem)] items-center justify-center rounded-full text-gold">
        <Icon strokeWidth={1.1} className="size-[44%]" />
      </span>
      <p className="mt-[8%] font-serif text-[clamp(1.6rem,3.6cqw,2.6rem)] leading-tight text-shadow">{chapter.title}</p>
      <Ornament className="mt-[4%] h-3 w-28" />
      <p className="type-hand mt-[5%] max-w-[22ch] text-[clamp(1rem,2cqw,1.35rem)] leading-snug text-burgundy">first pages being written</p>
    </div>
  )
}

function TextPage({ chapter, index, total }: PageProps & { total: number }) {
  const Icon = chapter.icon
  return (
    <div className="paper-surface relative flex h-full flex-col overflow-hidden rounded-r-[0.4rem] px-[9%] pt-[8%] pb-[6%]">
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-[linear-gradient(90deg,rgb(110_78_51/0.24),transparent)]" />
      <div className="flex items-center justify-between font-ui text-[clamp(0.55rem,1.05cqw,0.68rem)] tracking-[0.26em] text-coffee uppercase">
        <span>Chapter {ROMAN[index]}</span>
        <span>
          Page {index + 1} of {total}
        </span>
      </div>
      <p className="mt-[8%] font-serif text-[clamp(1.4rem,3cqw,2.1rem)] leading-tight text-shadow">{chapter.title}</p>
      <Ornament className="mt-[3%] -ml-2 h-3 w-28" />
      <p className="drop-cap mt-[5%] text-[clamp(0.9rem,1.85cqw,1.1rem)] leading-relaxed text-shadow/80">{chapter.summary}</p>
      <p className="mt-[6%] font-ui text-[clamp(0.55rem,1.05cqw,0.66rem)] tracking-[0.24em] text-coffee uppercase">Inside this chapter</p>
      <ul className="mt-[2%] grid gap-[0.4em] text-[clamp(0.85rem,1.7cqw,1rem)] text-shadow/85">
        {chapter.contents.map((item) => (
          <li key={item} className="flex items-center gap-[0.6em]">
            <span className="size-1.5 shrink-0 rotate-45 bg-burgundy/70" />
            {item}
          </li>
        ))}
      </ul>
      <Icon strokeWidth={0.7} className="pointer-events-none absolute right-[6%] bottom-[9%] size-[34%] text-burgundy/[0.07]" />
      <p className="mt-auto text-center font-serif text-xs text-coffee">~ {index + 1} ~</p>
    </div>
  )
}

function NotebookPage({ chapter, index, total }: PageProps & { total: number }) {
  const Icon = chapter.icon
  return (
    <div className="paper-surface relative flex h-full flex-col overflow-hidden rounded-[0.4rem] px-[7%] pt-[9%] pb-[6%]">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[9%] bg-[linear-gradient(180deg,rgb(110_78_51/0.2),transparent)]" />
      <div className="flex items-center justify-between font-ui text-[0.6rem] tracking-[0.24em] text-coffee uppercase">
        <span>Chapter {ROMAN[index]}</span>
        <span>
          {index + 1} / {total}
        </span>
      </div>
      <div className="grid flex-1 place-items-center py-4">
        <span className="leather-surface inline-flex size-24 items-center justify-center rounded-full text-gold">
          <Icon strokeWidth={1.1} className="size-10" />
        </span>
      </div>
      <p className="font-serif text-[clamp(1.5rem,7cqw,2rem)] leading-tight text-shadow">{chapter.title}</p>
      <Ornament className="mt-2 -ml-2 h-3 w-24" />
      <p className="mt-3 text-[clamp(0.92rem,4cqw,1.02rem)] leading-relaxed text-shadow/80">{chapter.summary}</p>
      <ul className="mt-3 grid gap-1 text-[0.9rem] text-shadow/80">
        {chapter.contents.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="size-1.5 shrink-0 rotate-45 bg-burgundy/70" />
            {item}
          </li>
        ))}
      </ul>
      <p className="type-hand mt-4 text-center text-lg text-burgundy">first pages being written</p>
    </div>
  )
}

function BookProgress({ page, total }: { page: number; total: number }) {
  return (
    <div className="flex w-full max-w-md items-center gap-4 px-1">
      <span className="font-ui text-[0.62rem] tracking-[0.24em] whitespace-nowrap text-coffee uppercase tabular-nums">
        Chapter {ROMAN[page]} / {ROMAN[total - 1]}
      </span>
      <div className="flex flex-1 gap-1.5">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn('h-[3px] flex-1 rounded-full transition-colors duration-500', index <= page ? 'bg-burgundy' : 'bg-coffee/20')}
          />
        ))}
      </div>
      <span className="type-hand text-lg whitespace-nowrap text-burgundy">{page + 1 < total ? 'scroll to turn' : 'more pages soon'}</span>
    </div>
  )
}
