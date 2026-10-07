'use client'

import { useRef } from 'react'
import { controlAmbient } from '@/lib/ambient'
import { gsap, useGSAP } from './gsap'

const stars = Array.from({ length: 34 }, (_, index) => {
  const x = (index * 37.7) % 100
  const y = (index * 23.3 + (index % 3) * 11) % 62
  const size = index % 5 === 0 ? 3 : index % 2 === 0 ? 2 : 1.5
  return { x, y, size }
})

export function NightSky() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-night-star]',
          { autoAlpha: 0, scale: 0.4 },
          {
            autoAlpha: (index: number) => 0.45 + (index % 4) * 0.15,
            scale: 1,
            duration: 2.2,
            ease: 'power1.out',
            stagger: { each: 0.06, from: 'random' },
            scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
          },
        )
        gsap.fromTo(
          '[data-night-moon]',
          { y: 120, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            ease: 'power1.out',
            scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'center 55%', scrub: 1.5 },
          },
        )
        const glow = gsap.to('[data-night-glow]', { scale: 1.08, opacity: 0.9, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        return controlAmbient([glow], root.current)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#221b30_0%,#3a2238_48%,#6a1f26_100%)]" />
      {stars.map((star, index) => (
        <span
          key={index}
          data-night-star
          className="absolute rounded-full bg-[#fff6dc] shadow-[0_0_6px_1px_rgb(243_223_160/0.55)]"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
        />
      ))}
      <div data-night-moon className="absolute top-[10%] right-[12%] size-24 sm:size-32">
        <div data-night-glow className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgb(243_223_160/0.45)_0%,transparent_65%)] opacity-70" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_38%_35%,#fffaf0_0%,#f6e7c4_55%,#e9d3a6_100%)] shadow-[0_0_50px_10px_rgb(243_223_160/0.35)]" />
        <div className="absolute top-[28%] left-[55%] size-[16%] rounded-full bg-[#e3cc9c]/60" />
        <div className="absolute top-[58%] left-[34%] size-[11%] rounded-full bg-[#e3cc9c]/50" />
      </div>
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-28 w-full sm:h-36">
        <path d="M0 120 C200 80 360 90 520 118 S860 70 1040 100 1300 86 1440 110 V200 H0Z" fill="#521820" opacity="0.8" />
        <path d="M0 160 C240 132 480 150 720 142 S1200 128 1440 150 V200 H0Z" fill="#45141b" />
      </svg>
    </div>
  )
}
