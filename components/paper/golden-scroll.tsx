'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/components/animations/gsap'
import { Ornament } from '@/components/library/ornament'

interface GoldenScrollProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  tilt?: number
  /** `load` unrolls once when the page opens; `scroll` unrolls as the reader scrolls past. */
  unroll?: 'load' | 'scroll'
}

function Roller({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-x-0 z-20 h-[1.15rem] sm:h-[1.35rem]', className)}>
      <span className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,#6b4614_0%,#e9c46a_22%,#fff3c4_38%,#d9a53f_58%,#8c5f1b_82%,#4f330c_100%)] shadow-[0_8px_14px_-6px_rgb(42_26_16/0.65)]" />
      <span className="absolute inset-y-0 left-[7%] w-1.5 bg-[#5c3c10]/45" />
      <span className="absolute inset-y-0 right-[7%] w-1.5 bg-[#5c3c10]/45" />
      <span className="absolute top-1/2 -left-2.5 size-[1.7rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff3c4_0%,#e2b24f_38%,#8c5f1b_78%,#4f330c_100%)] shadow-[0_4px_8px_rgb(42_26_16/0.5)] sm:size-[2rem]" />
      <span className="absolute top-1/2 -right-2.5 size-[1.7rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff3c4_0%,#e2b24f_38%,#8c5f1b_78%,#4f330c_100%)] shadow-[0_4px_8px_rgb(42_26_16/0.5)] sm:size-[2rem]" />
    </span>
  )
}

/** A gilded parchment scroll that unrolls from its top roller, then rests with a gentle drift. */
export function GoldenScroll({ children, className, contentClassName, tilt = 0, unroll = 'scroll' }: GoldenScrollProps) {
  const root = useRef<HTMLDivElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const scrub = unroll === 'scroll'
        const ease = scrub ? 'none' : 'power3.inOut'
        const tl = gsap.timeline({
          delay: scrub ? 0 : 0.5,
          scrollTrigger: scrub
            ? { trigger: root.current, start: 'top 88%', end: 'top 35%', scrub: 0.8, invalidateOnRefresh: true }
            : undefined,
          onComplete: () => root.current?.classList.add('paper-idle-drift'),
        })
        tl.fromTo(sheet.current, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease }, 0)
          .fromTo(bottom.current, { y: () => -(sheet.current?.offsetHeight ?? 0) }, { y: 0, duration: 1.6, ease }, 0)
          .fromTo(content.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: scrub ? 'none' : 'power2.out' }, 0.9)
      })
    },
    { scope: root, dependencies: [unroll] },
  )

  return (
    <div ref={root} className={cn('relative px-3 py-2 sm:px-4', className)} style={{ '--tilt': `${tilt}deg`, rotate: `${tilt}deg` } as CSSProperties}>
      <Roller className="top-2" />
      <div
        ref={sheet}
        className="relative mx-[3%] mt-[0.55rem] mb-[0.55rem] overflow-hidden bg-[#f3e2b3] shadow-[0_30px_50px_-28px_rgb(42_26_16/0.7)] sm:mt-[0.65rem] sm:mb-[0.65rem]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url(/images/textures/scroll-paper.jpg)] bg-cover bg-center opacity-55 mix-blend-multiply"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgb(255_246_214/0.85),transparent_62%),linear-gradient(90deg,rgb(150_100_34/0.38),transparent_9%,transparent_91%,rgb(150_100_34/0.38)),linear-gradient(180deg,rgb(120_80_24/0.28),transparent_7%,transparent_93%,rgb(120_80_24/0.28))]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#b8893b]/70 sm:inset-4" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-[1.05rem] border border-[#b8893b]/35 sm:inset-[1.3rem]" />
        <div ref={content} className={cn('relative', contentClassName)}>
          <Ornament className="mx-auto mb-5 block h-4 w-36 text-[#a87a2e]" />
          {children}
          <Ornament className="mx-auto mt-6 block h-4 w-36 rotate-180 text-[#a87a2e]" />
        </div>
      </div>
      <div ref={bottom} className="absolute inset-x-3 bottom-2 h-[1.15rem] sm:inset-x-4 sm:h-[1.35rem]">
        <Roller className="top-0" />
      </div>
    </div>
  )
}
