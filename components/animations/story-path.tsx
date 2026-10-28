'use client'

import { useRef, type CSSProperties } from 'react'
import type { ProcessStep } from '@/data/content'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from './gsap'

const VIEW_W = 1000
const VIEW_H = 170
const TOP = 40
const BOTTOM = 130

const buildPath = (count: number) => {
  const step = VIEW_W / count
  const x = (index: number) => step * (index + 0.5)
  const y = (index: number) => (index % 2 === 0 ? TOP : BOTTOM)
  let path = `M${x(0)} ${y(0)} C${x(0) + step / 2} ${y(0)} ${x(1) - step / 2} ${y(1)} ${x(1)} ${y(1)}`
  for (let index = 2; index < count; index++) path += ` S${x(index) - step / 2} ${y(index)} ${x(index)} ${y(index)}`
  return path
}

export function StoryPath({ steps }: { steps: ProcessStep[] }) {
  const root = useRef<HTMLDivElement>(null)
  const PATH = buildPath(steps.length)

  useGSAP(
    () => {
      const scope = root.current
      if (!scope) return
      const lanterns = gsap.utils.toArray<HTMLElement>('[data-lantern]', scope)
      const thresholds = lanterns.map((_, index) => Math.max(0, index / (lanterns.length - 1) - 0.03))
      const light = (progress: number) =>
        lanterns.forEach((lantern, index) => {
          lantern.dataset.lit = String(progress >= thresholds[index])
        })

      const mm = gsap.matchMedia()

      mm.add(
        { desktop: '(min-width: 1024px)', motion: '(prefers-reduced-motion: no-preference)' },
        (context) => {
          const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean }
          if (!motion) {
            light(1)
            return
          }
          light(0)

          if (desktop) {
            const path = scope.querySelector<SVGPathElement>('[data-story-path]')
            const svg = path?.ownerSVGElement
            const firefly = scope.querySelector<HTMLElement>('[data-path-firefly]')
            if (!path || !svg || !firefly) return
            const length = path.getTotalLength()
            const place = (progress: number) => {
              const point = path.getPointAtLength(progress * length)
              const box = svg.getBoundingClientRect()
              gsap.set(firefly, { xPercent: -50, yPercent: -50, x: (point.x / VIEW_W) * box.width, y: (point.y / VIEW_H) * box.height, autoAlpha: progress > 0.005 && progress < 0.995 ? 1 : 0 })
            }
            place(0)
            gsap.fromTo(
              path,
              { strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: scope,
                  start: 'top 72%',
                  end: 'bottom 62%',
                  scrub: 1.2,
                  onUpdate: (self) => {
                    light(self.progress)
                    place(self.progress)
                  },
                },
              },
            )
          } else {
            const line = scope.querySelector<HTMLElement>('[data-story-line]')
            if (!line) return
            gsap.fromTo(
              line,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: { trigger: scope, start: 'top 75%', end: 'bottom 60%', scrub: 1, onUpdate: (self) => light(self.progress) },
              },
            )
          }
        },
      )

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative mt-12 lg:mt-16">
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[170px] w-full overflow-visible lg:block"
      >
        <path d={PATH} fill="none" stroke="#6b4f3a" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="2 8" vectorEffect="non-scaling-stroke" />
        <path
          data-story-path
          d={PATH}
          pathLength={1}
          strokeDasharray="1"
          fill="none"
          stroke="#c99a6b"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        aria-hidden="true"
        data-path-firefly
        className="pointer-events-none absolute top-0 left-0 hidden size-4 rounded-full bg-[radial-gradient(circle,#fffaf0_0%,var(--gold)_40%,rgb(243_223_160/0)_72%)] opacity-0 shadow-[0_0_18px_6px_rgb(243_223_160/0.55)] lg:block"
      />

      <div aria-hidden="true" className="absolute top-0 bottom-0 left-[1.4rem] w-px bg-coffee/20 lg:hidden">
        <div data-story-line className="h-full w-full origin-top bg-[#c99a6b]" />
      </div>

      <ol
        data-reveal-group
        style={{ '--cols': steps.length } as CSSProperties}
        className="relative grid gap-10 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-x-0"
      >
        {steps.map((step, index) => (
          <li
            key={step.title}
            data-reveal-item
            className={cn(
              'relative grid grid-cols-[2.8rem_1fr] gap-5 lg:grid-cols-1 lg:justify-items-center lg:px-3 lg:text-center',
              index % 2 === 0 ? 'lg:mt-[17.6px]' : 'lg:mt-[107.6px]',
            )}
          >
            <span
              data-lantern
              data-lit="false"
              className="lantern relative z-10 inline-flex size-[2.8rem] items-center justify-center rounded-full border border-coffee/40 bg-paper font-serif text-lg text-coffee-deep shadow-paper"
            >
              {index + 1}
            </span>
            <div className="grid gap-2 lg:mt-3">
              <h3 className="type-h3">{step.title}</h3>
              <p className="text-[0.96rem] leading-relaxed text-shadow/80 lg:mx-auto lg:max-w-[17rem]">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
