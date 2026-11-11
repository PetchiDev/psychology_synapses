'use client'

import { useRef, type PointerEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import type { WorkArea } from '@/data/content'
import { cn } from '@/lib/utils'
import { useMediaQuery, useMotionAllowed } from '@/lib/use-motion-allowed'
import { Button } from '@/components/ui/button'

export function WorkAreaSection({ area, index }: { area: WorkArea; index: number }) {
  const section = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const animate = useMotionAllowed()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const flip = index % 2 === 1
  const Icon = area.icon

  const { scrollYProgress: enter } = useScroll({ target: frame, offset: ['start end', 'center 55%'] })
  const clipPath = useTransform(enter, [0, 1], ['inset(38% 14% 0% 14% round 999px 999px 0 0)', 'inset(0% 0% 0% 0% round 999px 999px 0 0)'])
  const imageScale = useTransform(enter, [0, 1], [1.28, 1])

  const { scrollYProgress: pass } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const numeralY = useTransform(pass, [0, 1], [70, -70])

  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 18 })
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 18 })
  const tilt = animate && finePointer

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!tilt) return
    const box = event.currentTarget.getBoundingClientRect()
    tiltY.set(((event.clientX - box.left) / box.width - 0.5) * 10)
    tiltX.set(-((event.clientY - box.top) / box.height - 0.5) * 8)
  }
  const onPointerLeave = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <section
      ref={section}
      id={area.slug}
      aria-labelledby={`${area.slug}-title`}
      className="relative grid scroll-mt-40 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16"
    >
      <motion.span
        aria-hidden="true"
        initial={animate ? { scale: 0.4, opacity: 0.3 } : false}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -45% 0px' }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        className="absolute top-3 left-[calc(var(--thread-x)-var(--thread-pad))] size-4 -translate-x-1/2 rounded-full border-2 border-paper bg-[radial-gradient(circle_at_35%_30%,#fff3c4,#d9a53f_55%,#8c5f1b)] shadow-[0_0_0_4px_rgb(217_165_63/0.22),0_0_18px_rgb(217_165_63/0.55)]"
      />

      <div className={cn('relative mx-auto w-full max-w-[30rem] lg:col-span-5 lg:max-w-none', flip && 'lg:order-2')}>
        <div className="[perspective:1100px]">
          <motion.div
            ref={frame}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            style={tilt ? { rotateX, rotateY } : undefined}
            className="relative rounded-t-[999px] rounded-b-[0.9rem] bg-[linear-gradient(160deg,#f3dfa0,#b8893b_45%,#7a5418)] p-[7px] shadow-[0_34px_60px_-30px_rgb(42_26_16/0.75)] [transform-style:preserve-3d]"
          >
            <motion.div
              style={animate ? { clipPath } : undefined}
              className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[0.6rem] bg-latte sm:aspect-[5/6]"
            >
              <motion.div style={animate ? { scale: imageScale } : undefined} className="absolute inset-0">
                <Image src={area.image.src} alt={area.image.alt} fill sizes="(min-width: 1024px) 34rem, 92vw" className="object-cover" />
              </motion.div>
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(36_21_13/0)_55%,rgb(36_21_13/0.35))]" />
            </motion.div>
            <span aria-hidden="true" className="pointer-events-none absolute inset-[14px] rounded-t-[999px] rounded-b-[0.45rem] border border-paper/40" />
          </motion.div>
        </div>

        <motion.span
          aria-hidden="true"
          initial={animate ? { scale: 1.9, rotate: -32, opacity: 0 } : false}
          whileInView={{ scale: 1, rotate: -8, opacity: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ type: 'spring', stiffness: 240, damping: 15, delay: 0.2 }}
          className={cn(
            'absolute bottom-10 inline-flex size-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#a8403f,#7a2326_55%,#4a1214)] font-serif text-3xl text-paper shadow-[0_0_0_5px_rgb(122_35_38/0.28),0_14px_24px_-10px_rgb(42_26_16/0.8)] sm:size-24 sm:text-4xl',
            flip ? '-left-2 sm:-left-6' : '-right-2 sm:-right-6',
          )}
        >
          {area.number}
        </motion.span>
        <p className="type-hand mt-6 text-center text-xl text-burgundy/85 sm:text-2xl">{area.caption}</p>
      </div>

      <div className={cn('relative isolate grid content-start gap-6 lg:col-span-7', flip && 'lg:order-1')}>
        <motion.span
          aria-hidden="true"
          style={animate ? { y: numeralY } : undefined}
          className="pointer-events-none absolute -top-14 right-0 -z-10 font-serif text-[clamp(7rem,4rem+12vw,15rem)] leading-none text-burgundy/[0.07] select-none"
        >
          {area.number}
        </motion.span>
        <p data-reveal className="type-eyebrow flex items-center gap-3 text-burgundy">
          <Icon className="size-4" aria-hidden="true" />
          {area.number} · Area of work
        </p>
        <h2 id={`${area.slug}-title`} data-reveal className="type-h2">
          {area.title}
        </h2>
        <p data-reveal className="type-lead text-shadow/80">
          {area.detail.intro}
        </p>

        <div data-reveal className="catalogue-card relative rounded-[0.35rem] px-5 pb-10 sm:px-7">
          <h3 className="flex h-[5.1rem] items-end pb-3 font-serif text-[1.3rem] text-shadow">What it can involve</h3>
          <ul data-reveal-group className="mt-2 grid">
            {area.detail.involves.map((item) => (
              <li key={item} data-reveal-item className="flex gap-3 text-[0.97rem] leading-[1.75rem] text-shadow/85">
                <Check className="mt-1.5 size-4 shrink-0 text-burgundy" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="grid gap-6 sm:grid-cols-2">
          <div className="border-l-2 border-gilt/60 pl-4">
            <h3 className="type-eyebrow text-coffee">Who it may suit</h3>
            <p className="mt-3 text-[0.97rem] leading-relaxed text-shadow/85">{area.detail.suits}</p>
          </div>
          <div className="border-l-2 border-gilt/60 pl-4">
            <h3 className="type-eyebrow text-coffee">How to enquire</h3>
            <p className="mt-3 text-[0.97rem] leading-relaxed text-shadow/85">{area.detail.enquire}</p>
          </div>
        </div>

        <div data-reveal>
          <Button asChild size="lg" className="h-auto min-h-12 py-3 text-center whitespace-normal">
            <Link href={`/contact?enquiry=${area.enquiry}#book`}>
              {area.cta}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
