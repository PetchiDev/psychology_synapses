'use client'

import { useRef } from 'react'
import { psychologist } from '@/data/content'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/components/animations/gsap'
import { ScrollPaper } from '@/components/paper/scroll-paper'

const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'] as const

const leafStyle = [
  { seed: 11, tilt: -1.8, offset: 'lg:mr-10 lg:-rotate-1', float: true },
  { seed: 19, tilt: 1.4, offset: 'lg:ml-12 lg:rotate-1', float: false },
  { seed: 27, tilt: -0.9, offset: 'lg:mr-6', float: true },
  { seed: 33, tilt: 2.1, offset: 'lg:ml-16 lg:-rotate-1', float: false },
  { seed: 41, tilt: -1.5, offset: 'lg:mr-14 lg:rotate-[0.6deg]', float: true },
  { seed: 47, tilt: 0.8, offset: 'lg:ml-8', float: false },
] as const

/**
 * My Story as separate parchment leaves — one piece of writing per scroll beat —
 * instead of a single image-like scroll with everything baked inside.
 */
export function StoryLeaves() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const scope = root.current
      if (!scope) return

      const leaves = gsap.utils.toArray<HTMLElement>('[data-story-leaf]', scope)
      if (!leaves.length) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(leaves, { clearProps: 'all', autoAlpha: 1, y: 0, rotate: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(leaves, { autoAlpha: 0, y: 72, rotate: (i) => (i % 2 === 0 ? -2.4 : 2.4) })

        leaves.forEach((leaf, index) => {
          gsap.to(leaf, {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            ease: 'power3.out',
            duration: 1.05,
            scrollTrigger: {
              trigger: leaf,
              start: 'top 86%',
              end: 'top 48%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.04,
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative grid gap-8 sm:gap-10 lg:gap-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-8 bottom-8 left-[1.15rem] hidden w-px bg-[linear-gradient(180deg,transparent,rgb(122_35_38/0.35)_12%,rgb(122_35_38/0.35)_88%,transparent)] sm:left-[1.35rem] lg:block"
      />

      {psychologist.story.map((paragraph, index) => {
        const style = leafStyle[index % leafStyle.length]
        return (
          <article
            key={paragraph.slice(0, 28)}
            data-story-leaf
            className={cn('relative will-change-transform', style.offset)}
          >
            <span
              aria-hidden="true"
              className="absolute top-6 -left-1 z-10 hidden size-3 rounded-full bg-burgundy shadow-[0_0_0_6px_rgb(239_224_189/0.9)] lg:block"
            />
            <ScrollPaper
              seed={style.seed}
              tilt={style.tilt}
              float={style.float}
              contentClassName="grid gap-4 px-[10%] py-10 text-[1.04rem] leading-[1.85] text-shadow/90 sm:px-[11%] sm:py-12"
            >
              <p className="type-hand text-xl text-burgundy/80">— {roman[index] ?? String(index + 1)} —</p>
              <p className={index === 0 ? 'drop-cap' : undefined}>{paragraph}</p>
            </ScrollPaper>
          </article>
        )
      })}

      <article data-story-leaf className="relative will-change-transform lg:ml-20 lg:rotate-1">
        <span
          aria-hidden="true"
          className="absolute top-6 -left-1 z-10 hidden size-3 rounded-full bg-gold shadow-[0_0_0_6px_rgb(239_224_189/0.9)] lg:block"
        />
        <ScrollPaper
          seed={55}
          tilt={1.2}
          float
          stain={false}
          contentClassName="flex flex-col items-end gap-2 px-[12%] py-10 sm:py-12"
        >
          <p className="type-hand text-right text-[1.85rem] leading-none text-burgundy sm:text-[2.15rem]">{siteConfig.name}</p>
          <p className="font-ui text-[0.68rem] tracking-[0.28em] text-coffee uppercase">still writing this chapter</p>
        </ScrollPaper>
      </article>
    </div>
  )
}
