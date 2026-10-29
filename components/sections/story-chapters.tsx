'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { psychologist } from '@/data/content'
import { siteConfig } from '@/lib/site'
import { useMotionAllowed } from '@/lib/use-motion-allowed'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/components/animations/gsap'

const CHAPTERS = [
  { label: 'Beginnings', kicker: '01' },
  { label: 'Curiosity', kicker: '02' },
  { label: 'Study', kicker: '03' },
  { label: 'Doors', kicker: '04' },
  { label: 'Practice', kicker: '05' },
  { label: 'Purpose', kicker: '06' },
] as const

/**
 * Modern editorial story — no parchment imagery. Sticky progress rail,
 * large chapter indices with parallax, and cards that lift on hover.
 */
export function StoryChapters() {
  const root = useRef<HTMLDivElement>(null)
  const motionOk = useMotionAllowed()
  const { scrollYProgress } = useScroll({ target: root, offset: ['start 70%', 'end 40%'] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const drift = useTransform(scrollYProgress, [0, 1], [0, -80])

  useGSAP(
    () => {
      const scope = root.current
      if (!scope || !motionOk) return
      const cards = gsap.utils.toArray<HTMLElement>('[data-story-card]', scope)
      gsap.set(cards, { opacity: 0, y: 48 })
      cards.forEach((card) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
      })
    },
    { scope: root, dependencies: [motionOk] },
  )

  return (
    <div ref={root} className="relative">
      <motion.div
        aria-hidden="true"
        style={motionOk ? { y: drift } : undefined}
        className="pointer-events-none absolute -top-8 right-0 select-none font-serif text-[clamp(6rem,18vw,11rem)] leading-none font-semibold tracking-tight text-burgundy/[0.06]"
      >
        story
      </motion.div>

      <div className="relative grid gap-5 sm:gap-6">
        <div aria-hidden="true" className="absolute top-3 bottom-3 left-[1.15rem] hidden w-px bg-coffee/15 lg:block">
          <motion.span
            className="absolute inset-x-0 top-0 origin-top bg-burgundy"
            style={motionOk ? { scaleY: lineScale, height: '100%' } : { height: '100%' }}
          />
        </div>

        {psychologist.story.map((paragraph, index) => {
          const chapter = CHAPTERS[index] ?? { label: `Chapter ${index + 1}`, kicker: String(index + 1).padStart(2, '0') }
          const flip = index % 2 === 1
          return (
            <article
              key={paragraph.slice(0, 28)}
              data-story-card
              className={cn(
                'group relative grid gap-4 rounded-[1.1rem] border border-coffee/10 bg-paper/80 p-6 shadow-[0_18px_40px_-28px_rgb(42_26_16/0.45)] backdrop-blur-[2px] transition-[transform,box-shadow,border-color] duration-500 ease-out will-change-transform sm:p-8',
                'hover:-translate-y-1.5 hover:border-burgundy/25 hover:shadow-[0_28px_50px_-24px_rgb(122_35_38/0.35)]',
                flip ? 'lg:ml-10' : 'lg:mr-6',
              )}
            >
              <span
                aria-hidden="true"
                className="absolute top-8 -left-[0.2rem] hidden size-3 rounded-full border-2 border-paper bg-burgundy shadow-[0_0_0_4px_rgb(122_35_38/0.15)] transition-transform duration-500 group-hover:scale-125 lg:block"
              />
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-ui text-[0.68rem] tracking-[0.28em] text-burgundy uppercase">{chapter.label}</p>
                  <p className="mt-1 font-serif text-[1.55rem] leading-none font-semibold text-shadow sm:text-[1.75rem]">
                    {chapter.kicker}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="font-serif text-5xl leading-none text-burgundy/10 transition-colors duration-500 group-hover:text-burgundy/20 sm:text-6xl"
                >
                  {chapter.kicker}
                </span>
              </div>
              <p className="max-w-[62ch] text-[1.05rem] leading-[1.8] text-shadow/85">{paragraph}</p>
              <span
                aria-hidden="true"
                className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-burgundy/50 via-gold/40 to-transparent transition-transform duration-700 group-hover:scale-x-100"
              />
            </article>
          )
        })}

        <footer
          data-story-card
          className="group relative overflow-hidden rounded-[1.1rem] bg-mahogany px-7 py-9 text-paper shadow-lifted transition-transform duration-500 hover:-translate-y-1 sm:px-10"
        >
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-10 size-48 rounded-full bg-[radial-gradient(circle,rgb(248_217_143/0.28),transparent_65%)]"
          />
          <p className="type-hand relative text-[2rem] leading-none text-gold sm:text-[2.35rem]">{siteConfig.name}</p>
          <p className="relative mt-3 font-ui text-[0.7rem] tracking-[0.28em] text-paper/65 uppercase">still writing this chapter</p>
        </footer>
      </div>
    </div>
  )
}
