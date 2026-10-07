'use client'

import { useRef } from 'react'
import { controlAmbient } from '@/lib/ambient'
import { cn } from '@/lib/utils'
import { FairyParticles } from './fairy-particles'
import { gsap, useGSAP } from './gsap'
import { ParallaxLayer } from './parallax-layer'

const stars = [
  [6, 14, 9], [14, 30, 6], [22, 9, 7], [31, 22, 5], [39, 6, 8], [47, 18, 6], [55, 11, 5],
  [63, 26, 7], [71, 8, 6], [78, 20, 9], [86, 12, 6], [93, 28, 7], [27, 38, 5], [58, 36, 6],
] as const

const SCROLL_TRAVEL = 150
const POINTER_RANGE = 14

function Sparkle({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <svg
      data-twinkle
      viewBox="0 0 20 20"
      className="absolute text-[#d9b97c]"
      style={{ left: `${x}%`, top: `${y}%`, width: size * 2, height: size * 2 }}
    >
      <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0Z" fill="currentColor" />
    </svg>
  )
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg data-cloud viewBox="0 0 260 90" className={cn('absolute', className)} fill="#fffaf2">
      <path d="M30 80 C8 80 2 58 20 50 C14 30 40 20 56 32 C64 10 100 4 116 24 C132 2 176 6 182 34 C200 22 232 30 230 54 C254 56 258 80 236 80 Z" />
    </svg>
  )
}

function Flowers({ side }: { side: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 220 170" className={cn('h-full w-auto', side === 'right' && '-scale-x-100')}>
      <g data-sway style={{ transformOrigin: '60px 170px' }}>
        <path d="M60 170 C58 130 52 100 40 70" stroke="#8f9c7f" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M52 120 C30 112 18 96 16 80 C36 86 50 100 52 120Z" fill="#a9b596" />
        <circle cx="40" cy="66" r="11" fill="#f3c9a8" />
        <circle cx="40" cy="66" r="4" fill="#6a1f26" opacity="0.7" />
      </g>
      <g data-sway style={{ transformOrigin: '110px 170px' }}>
        <path d="M110 170 C112 120 118 90 128 50" stroke="#8f9c7f" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M114 118 C136 106 152 92 156 72 C134 78 118 96 114 118Z" fill="#b7c4a4" />
        <circle cx="128" cy="46" r="13" fill="#cdc3e3" />
        <circle cx="128" cy="46" r="5" fill="#f3dfa0" />
      </g>
      <g data-sway style={{ transformOrigin: '170px 170px' }}>
        <path d="M170 170 C168 140 164 120 158 98" stroke="#8f9c7f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="157" cy="94" r="8" fill="#f3dfa0" />
      </g>
      <path d="M0 170 C20 150 34 148 50 156 C70 140 96 142 112 156 C134 144 160 146 180 160 C196 152 210 154 220 170Z" fill="#a9b596" opacity="0.85" />
    </svg>
  )
}

export function StorybookScene({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const scene = root.current
      if (!scene) return
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const hero = scene.parentElement ?? scene

        gsap.utils.toArray<HTMLElement>('[data-scene-layer]', scene).forEach((layer) => {
          const depth = Number(layer.dataset.sceneLayer ?? 1)
          gsap.to(layer, {
            y: (1 - depth) * SCROLL_TRAVEL,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
          })
        })

        const loops = [
          ...gsap.utils.toArray<SVGElement>('[data-twinkle]', scene).map((star) =>
            gsap.fromTo(
              star,
              { opacity: 0.25, scale: 0.75, transformOrigin: '50% 50%' },
              { opacity: 0.9, scale: 1, duration: gsap.utils.random(2.4, 4.2), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: gsap.utils.random(0, 3) },
            ),
          ),
          ...gsap.utils.toArray<SVGElement>('[data-cloud]', scene).map((cloud, index) =>
            gsap.to(cloud, { x: index % 2 ? -46 : 46, duration: 16 + index * 3, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
          ),
          ...gsap.utils.toArray<SVGElement>('[data-sway]', scene).map((stem, index) =>
            gsap.fromTo(stem, { rotate: -2.5 }, { rotate: 2.5, duration: 5 + index * 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
          ),
          gsap.to('[data-moon]', { scale: 1.06, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 50%' }),
        ]
        const release = controlAmbient(loops, scene)
        return release
      })

      mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 1024px)', () => {
        const hero = scene.parentElement ?? scene
        const movers = gsap.utils.toArray<HTMLElement>('[data-pointer-layer]', scene).map((layer) => {
          const depth = Number(layer.dataset.pointerLayer ?? 1)
          return {
            depth,
            x: gsap.quickTo(layer, 'x', { duration: 1.6, ease: 'power2.out' }),
            y: gsap.quickTo(layer, 'y', { duration: 1.6, ease: 'power2.out' }),
          }
        })
        const onMove = (event: PointerEvent) => {
          const rect = hero.getBoundingClientRect()
          const px = (event.clientX - rect.left) / rect.width - 0.5
          const py = (event.clientY - rect.top) / rect.height - 0.5
          movers.forEach((mover) => {
            mover.x(-px * POINTER_RANGE * mover.depth)
            mover.y(-py * POINTER_RANGE * 0.6 * mover.depth)
          })
        }
        const onLeave = () => movers.forEach((mover) => (mover.x(0), mover.y(0)))
        hero.addEventListener('pointermove', onMove)
        hero.addEventListener('pointerleave', onLeave)
        return () => {
          hero.removeEventListener('pointermove', onMove)
          hero.removeEventListener('pointerleave', onLeave)
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#e7dfeb_0%,#efe3e1_38%,#f4e7da_68%,var(--paper)_100%)]" />

      <ParallaxLayer depth={0.15} className="inset-x-0 top-0 h-[60%]">
        {stars.map(([x, y, size]) => (
          <Sparkle key={`${x}-${y}`} x={x} y={y} size={size} />
        ))}
        <div data-moon className="absolute top-[9%] right-[8%] size-28 rounded-full bg-[radial-gradient(circle,#fffaf0_0%,#fbf0dc_38%,rgb(243_223_160/0.35)_58%,transparent_72%)] sm:size-40" />
      </ParallaxLayer>

      <ParallaxLayer depth={0.3} className="inset-x-0 top-[6%] h-[40%]">
        <Cloud className="top-[8%] left-[4%] w-40 opacity-70 sm:w-56" />
        <Cloud className="top-[30%] right-[24%] hidden w-44 opacity-55 md:block" />
        <Cloud className="top-[2%] right-[2%] w-32 opacity-60 sm:w-48" />
      </ParallaxLayer>

      <FairyParticles contained density={0.65} />

      <div className="absolute inset-x-0 bottom-0 h-[38%] min-h-48 sm:min-h-64">
        <ParallaxLayer depth={0.45} className="-inset-x-8 bottom-0 h-full">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0 170 C180 110 320 120 470 160 S760 90 930 130 1220 100 1440 140 V320 H0Z" fill="#dcd2e4" />
          </svg>
        </ParallaxLayer>
        <ParallaxLayer depth={0.65} className="-inset-x-8 bottom-0 hidden h-full sm:block">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0 220 C160 180 300 175 450 205 S720 165 900 195 1180 170 1440 205 V320 H0Z" fill="#cfd6c1" />
            <g fill="#aeb99b">
              <ellipse cx="300" cy="182" rx="16" ry="20" />
              <ellipse cx="330" cy="188" rx="11" ry="14" />
              <ellipse cx="1120" cy="170" rx="18" ry="22" />
              <ellipse cx="1150" cy="178" rx="12" ry="15" />
            </g>
          </svg>
        </ParallaxLayer>
        <ParallaxLayer depth={0.85} className="-inset-x-8 bottom-0 h-full">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0 262 C200 230 360 238 540 255 S860 222 1040 240 1300 230 1440 250 V320 H0Z" fill="#e8dbc6" />
          </svg>
        </ParallaxLayer>
        <ParallaxLayer depth={1} className="-inset-x-8 -bottom-2 h-full">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0 300 C240 280 480 292 720 288 S1200 276 1440 292 V320 H0Z" fill="var(--paper)" />
          </svg>
        </ParallaxLayer>
        <ParallaxLayer depth={1} className="bottom-0 left-0 h-24 sm:h-36 lg:h-44">
          <Flowers side="left" />
        </ParallaxLayer>
        <ParallaxLayer depth={1} className="right-0 bottom-0 hidden h-28 sm:block lg:h-40">
          <Flowers side="right" />
        </ParallaxLayer>
        <div className="absolute inset-x-0 -bottom-px h-10 bg-gradient-to-b from-transparent to-paper" />
      </div>
    </div>
  )
}
