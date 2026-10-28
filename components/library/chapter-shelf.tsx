import Link from 'next/link'
import type { CSSProperties } from 'react'
import { libraryChapters } from '@/data/content'
import { Candle } from './candle'
import { ROMAN } from './roman'

const COVERS = ['#6b1e1e', '#2f4a3a', '#24364f', '#5a3b1f', '#4a1c24', '#3d2a4a']
const HEIGHTS = [100, 88, 96, 84, 100, 92]

export function ChapterShelf() {
  return (
    <nav aria-label="Library chapters" className="relative mx-auto w-full max-w-3xl">
      <div className="relative flex items-end justify-center gap-1 px-6 sm:gap-2.5 sm:px-16">
        <Candle className="absolute bottom-0 left-0 w-5 sm:left-2 sm:w-8" height={0.7} />
        <Candle className="absolute right-0 bottom-0 w-5 sm:right-2 sm:w-8" height={0.55} delay={1.1} />
        {libraryChapters.map((chapter, index) => (
          <Link
            key={chapter.slug}
            href={`#chapter-${chapter.slug}`}
            aria-label={`Chapter ${ROMAN[index]}: ${chapter.title}`}
            style={{ '--cover': COVERS[index], height: `${HEIGHTS[index] * 0.18}rem` } as CSSProperties}
            className="group relative flex w-[clamp(2.1rem,10.5vw,4.4rem)] flex-col items-center justify-between rounded-t-[0.3rem] bg-(--cover) py-3 text-gold shadow-[inset_-6px_0_10px_rgb(0_0_0/0.35),inset_4px_0_6px_rgb(255_240_200/0.12)] transition-[translate,rotate,box-shadow,filter] duration-500 ease-(--ease-paper) hover:-translate-y-4 hover:rotate-[-2deg] hover:shadow-[inset_-6px_0_10px_rgb(0_0_0/0.35),0_18px_30px_-10px_rgb(248_217_143/0.55)] focus-visible:-translate-y-4"
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-[12%] h-[3px] bg-[linear-gradient(90deg,#8a6a3a,#f3dfa0,#8a6a3a)] opacity-80" />
            <span aria-hidden="true" className="absolute inset-x-0 bottom-[12%] h-[3px] bg-[linear-gradient(90deg,#8a6a3a,#f3dfa0,#8a6a3a)] opacity-80" />
            <span aria-hidden="true" className="font-serif text-[0.8rem] sm:text-sm">
              {ROMAN[index]}
            </span>
            <span
              aria-hidden="true"
              className="font-serif text-[0.78rem] leading-none tracking-[0.06em] whitespace-nowrap [writing-mode:vertical-rl] sm:text-[1.05rem]"
            >
              {chapter.title}
            </span>
            <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold/70" />
          </Link>
        ))}
      </div>
      <div aria-hidden="true" className="h-4 rounded-[0.2rem] bg-[linear-gradient(180deg,#6b4527_0%,#4a2c18_60%,#2b1a10_100%)] shadow-[0_18px_24px_-12px_rgb(36_21_13/0.7)]" />
      <div aria-hidden="true" className="mx-3 h-2 rounded-b-[0.3rem] bg-[#2b1a10]/80" />
    </nav>
  )
}
