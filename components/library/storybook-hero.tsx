'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ChevronsDown } from 'lucide-react'
import { useMediaQuery, useMotionAllowed } from '@/lib/use-motion-allowed'
import { FairyParticles } from '@/components/animations/fairy-particles'
import { ArchedWindow } from './arched-window'
import { Bookshelf } from './bookshelf'
import { Candle } from './candle'
import { FloatingBook } from './floating-book'
import { Ornament } from './ornament'
import { RoseDome } from './rose-dome'
import { Storybook, type StorybookContent } from './storybook'

const line = (index: number) => ({ '--l': index }) as CSSProperties
const stagger = (index: number) => ({ '--i': index }) as CSSProperties

interface StorybookHeroProps {
  titleId: string
  eyebrow: ReactNode
  /** Each entry is one animated line of the headline. */
  titleLines: ReactNode[]
  kicker?: ReactNode
  lead: ReactNode
  actions: ReactNode
  caption: string
  book?: StorybookContent
}

export function StorybookHero({ titleId, eyebrow, titleLines, kicker, lead, actions, caption, book }: StorybookHeroProps) {
  const root = useRef<HTMLElement>(null)
  const animate = useMotionAllowed()
  const wide = useMediaQuery('(min-width: 768px)', true)
  const { scrollYProgress: progress } = useScroll({ target: root, offset: ['start start', 'end end'] })

  const sceneScale = useTransform(progress, [0, 0.8], [1, wide ? 1.32 : 1.18])
  const sceneOpacity = useTransform(progress, [0.72, 0.86], [1, 0])
  const shelfLeft = useTransform(progress, [0, 0.6], ['0%', wide ? '-70%' : '-100%'])
  const shelfRight = useTransform(progress, [0, 0.6], ['0%', wide ? '70%' : '100%'])
  const windowScale = useTransform(progress, [0, 0.8], [1, 1.45])
  const nearBooks = useTransform(progress, [0, 0.7], [0, wide ? -260 : -160])
  const farBooks = useTransform(progress, [0, 0.7], [0, wide ? -120 : -70])
  const textOpacity = useTransform(progress, [0.1, 0.22], [1, 0])
  const textY = useTransform(progress, [0.1, 0.22], [0, wide ? -70 : -40])
  const textVisibility = useTransform(progress, (value) => (value > 0.23 ? 'hidden' : 'visible'))
  const roseOpacity = useTransform(progress, [0.1, 0.24], [1, 0])
  const roseScale = useTransform(progress, [0.1, 0.24], [1, 0.85])
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0])
  const pageOpacity = useTransform(progress, [0.76, 0.88], [0, 1])

  return (
    <section
      ref={root}
      aria-labelledby={titleId}
      className="relative bg-mahogany text-paper motion-safe:h-[210vh] motion-safe:md:h-[260vh]"
    >
      <div className="relative h-svh min-h-[38rem] overflow-hidden motion-safe:sticky motion-safe:top-0 md:h-dvh md:min-h-[42rem]">
        <motion.div
          style={animate ? { scale: sceneScale, opacity: sceneOpacity } : undefined}
          className="absolute inset-0 will-change-transform"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,#4a2c18_0%,#2a180e_45%,#140a05_100%)]" />

          <motion.div
            style={animate ? { scale: windowScale } : undefined}
            className="absolute bottom-[14%] left-1/2 h-[68%] w-[min(46vw,22rem)] origin-bottom -translate-x-1/2"
          >
            <ArchedWindow className="h-full w-full" />
          </motion.div>

          <motion.div style={animate ? { x: shelfLeft } : undefined} className="absolute inset-y-0 left-0 w-[30vw] max-w-[26rem] min-w-36">
            <Bookshelf side="left" seed={11} />
          </motion.div>
          <motion.div style={animate ? { x: shelfRight } : undefined} className="absolute inset-y-0 right-0 w-[30vw] max-w-[26rem] min-w-36">
            <Bookshelf side="right" seed={29} />
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(180deg,#2b1a10_0%,#1a0f08_100%)]">
            <div className="absolute inset-x-[18%] top-[18%] h-[60%] rounded-[50%] bg-[radial-gradient(ellipse,rgb(122_35_38/0.55),rgb(90_24_27/0.2)_60%,transparent_72%)]" />
          </div>

          <motion.div style={animate ? { y: farBooks } : undefined} className="absolute inset-0">
            <FloatingBook className="absolute top-[18%] left-[34%] w-20 opacity-70 sm:w-24" cover="#24364f" delay={2} />
            <FloatingBook className="absolute top-[12%] right-[30%] hidden w-16 opacity-60 md:block" cover="#2f4a3a" delay={4} />
          </motion.div>
          <motion.div style={animate ? { y: nearBooks } : undefined} className="absolute inset-0">
            <FloatingBook className="absolute top-[30%] right-[6%] w-28 sm:w-36 lg:top-[16%] lg:right-[26%]" delay={1} />
            <FloatingBook className="absolute right-[34%] bottom-[20%] hidden w-28 xl:block" cover="#5a3b1f" delay={3} />
          </motion.div>

          <Candle className="absolute bottom-[9%] left-[6%] w-7 sm:w-9" />
          <Candle className="absolute bottom-[8%] left-[11%] hidden w-6 sm:block" height={0.6} delay={1.3} />
          <Candle className="absolute right-[7%] bottom-[9%] w-8 sm:w-10" height={0.8} delay={0.7} />
          <Candle className="absolute right-[13%] bottom-[8%] hidden w-6 md:block" height={0.5} delay={2.1} />

          <FairyParticles contained density={0.8} />

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_35%,rgb(10_5_2/0.75)_100%)]" />
          <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgb(20_10_5/0.9)_0%,rgb(20_10_5/0.7)_45%,transparent_78%)] lg:w-[70%]" />
        </motion.div>

        <motion.div
          style={animate ? { opacity: textOpacity, y: textY, visibility: textVisibility } : undefined}
          className="container-editorial relative z-10 grid h-full items-center pt-24 pb-16 sm:pt-28 sm:pb-20 lg:grid-cols-12 lg:gap-8 [@media(max-height:760px)]:pt-20 [@media(max-height:760px)]:pb-8"
        >
          <div className="lg:col-span-7">
            <p data-hero-item style={stagger(0)} className="type-eyebrow flex items-center gap-3 text-gold">
              <span aria-hidden="true" className="h-px w-6 shrink-0 bg-gold/60 sm:w-10" />
              {eyebrow}
            </p>

            {kicker ? (
              <div data-hero-item style={stagger(1)} className="mt-3 [@media(max-height:640px)]:hidden">
                {kicker}
              </div>
            ) : null}

            <h1 id={titleId} className="type-display mt-4 max-w-[15ch] [text-shadow:0_2px_24px_rgb(10_5_2/0.6)] text-[clamp(2.5rem,1.3rem+4.4vw,5.8rem)] text-paper sm:mt-5 lg:[@media(max-height:760px)]:text-[clamp(2.8rem,9vh,4.6rem)]">
              {titleLines.map((titleLine, index) => (
                <span key={index} data-line style={line(index)}>
                  {titleLine}
                </span>
              ))}
            </h1>

            <Ornament className="mt-4 text-gold sm:mt-5 [@media(max-height:760px)]:hidden" />

            <div data-hero-item style={stagger(5)} className="type-lead mt-4 max-w-xl text-paper/90 [text-shadow:0_1px_12px_rgb(10_5_2/0.7)] sm:mt-5 [@media(max-height:760px)]:text-[0.98rem] [@media(max-height:760px)]:leading-relaxed">
              {lead}
            </div>

            <div data-hero-item style={stagger(6)} className="mt-7 grid gap-3 sm:mt-8 sm:flex sm:items-center [@media(max-height:760px)]:mt-5 [@media(max-height:760px)]:gap-2">
              {actions}
            </div>
          </div>

          <motion.div style={animate ? { opacity: roseOpacity, scale: roseScale } : undefined} className="hidden lg:col-span-5 lg:block">
            <RoseDome className="mx-auto w-full max-w-[19rem]" />
            <p className="type-hand mt-4 text-center text-xl text-gold/90">{caption}</p>
          </motion.div>
        </motion.div>

        <motion.p
          aria-hidden="true"
          style={animate ? { opacity: hintOpacity } : undefined}
          className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 font-ui text-[0.62rem] tracking-[0.3em] whitespace-nowrap text-gold/80 uppercase motion-reduce:hidden lg:right-[22%] lg:bottom-6 lg:left-auto lg:translate-x-0 [@media(min-height:46rem)]:flex"
        >
          <span className="sm:hidden">Scroll to open</span>
          <span className="hidden sm:inline">Scroll to open the storybook</span>
          <ChevronsDown className="hint-bob size-4" />
        </motion.p>

        {animate ? (
          <>
            <Storybook key={wide ? 'spread' : 'flip'} progress={progress} layout={wide ? 'spread' : 'flip'} content={book} />
            <motion.div
              aria-hidden="true"
              style={{ opacity: pageOpacity }}
              className="pointer-events-none absolute inset-0 z-30 bg-paper bg-(image:--fibres) motion-reduce:hidden"
            />
          </>
        ) : null}
      </div>
    </section>
  )
}
