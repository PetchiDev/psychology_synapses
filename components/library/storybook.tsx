'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'
import { Ornament } from './ornament'

export interface StorybookContent {
  coverSubtitle: string
  pageLabel: string
  pageTitle: string
  pageBody: string
}

const LIBRARY_BOOK: StorybookContent = {
  coverSubtitle: 'The Library',
  pageLabel: 'Chapter I',
  pageTitle: 'A gentle beginning',
  pageBody:
    'Once upon a time, someone grew curious about why people think, feel and behave the way they do. Every page in this library begins with that same question.',
}

interface StorybookProps {
  progress: MotionValue<number>
  content?: StorybookContent
  /** `spread` opens the cover sideways (wide screens); `flip` lifts it upward like a notebook (phones). */
  layout?: 'spread' | 'flip'
}

export function Storybook({ progress, layout = 'spread', content = LIBRARY_BOOK }: StorybookProps) {
  const flip = layout === 'flip'
  const opacity = useTransform(progress, [0.16, 0.3], [0, 1])
  const y = useTransform(progress, flip ? [0.16, 0.42, 0.72] : [0.16, 0.42], flip ? ['38vh', '0vh', '16vh'] : ['38vh', '0vh'])
  const x = useTransform(progress, [0.44, 0.7, 0.78, 1], flip ? ['0%', '0%', '0%', '0%'] : ['0%', '50%', '50%', '0%'])
  const scale = useTransform(progress, [0.16, 0.42, 0.78, 1], flip ? [0.8, 1, 1, 3.6] : [0.7, 1, 1, 4.4])
  const coverAngle = useTransform(progress, [0.44, 0.72], flip ? [0, 172] : [0, -172])
  const glow = useTransform(progress, [0.3, 0.5, 0.8], [0, 1, 0])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center motion-reduce:hidden">
      <motion.div style={{ opacity, x, y, scale }} className="relative w-[min(64vw,20rem)] will-change-transform">
        <motion.span
          style={{ opacity: glow }}
          className="absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgb(248_217_143/0.5)_0%,transparent_70%)]"
        />
        <div className="relative aspect-[5/7] [perspective:2000px]">
          <div
            className={cn(
              'paper-surface absolute inset-0 overflow-hidden px-[9%] py-[12%] text-center shadow-[6px_6px_0_-2px_#e2cfa3,10px_10px_0_-4px_#d8c08f,0_30px_60px_-20px_rgb(0_0_0/0.7)]',
              flip ? 'rounded-b-[0.35rem]' : 'rounded-r-[0.35rem]',
            )}
          >
            <p className="font-ui text-[0.6rem] tracking-[0.3em] text-coffee uppercase">{content.pageLabel}</p>
            <Ornament className="mx-auto mt-3 h-3 w-28" />
            <p className="mt-4 font-serif text-[1.35rem] leading-tight text-shadow">{content.pageTitle}</p>
            <p className="drop-cap mt-4 text-left text-[0.72rem] leading-relaxed text-shadow/80">{content.pageBody}</p>
          </div>

          <motion.div
            style={flip ? { rotateX: coverAngle } : { rotateY: coverAngle }}
            className={cn('absolute inset-0 [transform-style:preserve-3d]', flip ? 'origin-top' : 'origin-left')}
          >
            <div
              className={cn(
                'leather-surface absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center [backface-visibility:hidden]',
                flip ? 'rounded-b-[0.35rem]' : 'rounded-r-[0.35rem]',
              )}
            >
              <Ornament className="h-3 w-28 text-gold" />
              <p className="gilt-text font-serif text-[1.7rem] leading-tight">{siteConfig.name}</p>
              <p className="font-ui text-[0.55rem] tracking-[0.3em] text-gold/80 uppercase">{content.coverSubtitle}</p>
              <Ornament className="h-3 w-28 rotate-180 text-gold" />
            </div>
            <div
              className={cn(
                'absolute inset-0 bg-[#3a2416] bg-[radial-gradient(circle_at_20%_30%,rgb(122_35_38/0.6),transparent_40%),radial-gradient(circle_at_70%_60%,rgb(184_137_59/0.35),transparent_45%),radial-gradient(circle_at_40%_80%,rgb(47_74_58/0.6),transparent_40%)] shadow-[inset_0_0_0_10px_#f3e6c8] [backface-visibility:hidden]',
                flip ? 'rounded-t-[0.35rem] [transform:rotateX(180deg)]' : 'rounded-l-[0.35rem] [transform:rotateY(180deg)]',
              )}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
