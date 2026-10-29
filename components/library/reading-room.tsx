'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import { bookHref } from '@/lib/site'
import { useMotionAllowed } from '@/lib/use-motion-allowed'
import { Ornament } from './ornament'
import { ROMAN } from './roman'

const STEPS = [
  {
    title: 'Choose a chapter',
    body: 'Let the pages of the book turn as you scroll, or open a drawer in the card catalogue. Each chapter gathers one kind of writing.',
  },
  {
    title: 'Read at your own pace',
    body: 'There is no order to follow and nothing to finish. Stay with one page, and come back to another later.',
  },
  {
    title: 'Take what helps',
    body: 'Keep the ideas that are useful to you and leave the rest. If something stirs more than you expected, pause and take a breath.',
  },
]

export function ReadingRoom() {
  return (
    <section aria-labelledby="reading-room-title" className="relative overflow-x-clip py-20 lg:py-28">
      <div className="container-editorial grid justify-items-center gap-6 text-center">
        <p data-reveal className="font-ui text-[0.7rem] tracking-[0.3em] text-coffee uppercase">
          The reading room
        </p>
        <h2 id="reading-room-title" data-reveal className="type-h2 max-w-3xl">
          How to read <em className="text-burgundy italic">here</em>
        </h2>
        <Ornament className="text-gilt" />
        <ol className="mt-6 grid w-full max-w-5xl gap-6 [perspective:1400px] md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <ReadingCard key={step.title} index={index} title={step.title} body={step.body} />
          ))}
        </ol>
        <p data-reveal className="mt-6 max-w-2xl text-[0.98rem] leading-relaxed text-shadow/80">
          The library is here for learning and reflection. It is not a substitute for personal care. If you would like support, you can{' '}
          <Link href={bookHref} className="font-semibold text-burgundy underline underline-offset-4 hover:text-shadow">
            book a conversation
          </Link>
          .
        </p>
      </div>
    </section>
  )
}

function ReadingCard({ index, title, body }: { index: number; title: string; body: string }) {
  const ref = useRef<HTMLLIElement>(null)
  const animate = useMotionAllowed()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 45%'] })
  const start = index * 0.12
  const rotateX = useTransform(scrollYProgress, [start, 0.75 + index * 0.08], [64, 0])
  const y = useTransform(scrollYProgress, [start, 0.75 + index * 0.08], [110, 0])
  const z = useTransform(scrollYProgress, [start, 0.75 + index * 0.08], [-220, 0])
  const opacity = useTransform(scrollYProgress, [start, start + 0.3], [0, 1])

  return (
    <motion.li
      ref={ref}
      style={animate ? { rotateX, y, z, opacity, transformOrigin: '50% 100%' } : undefined}
      className="[transform-style:preserve-3d]"
    >
      <div className="catalogue-card relative h-full rounded-[0.3rem] px-6 pb-12 text-left transition-[translate,rotate,box-shadow] duration-700 ease-(--ease-paper) hover:-translate-y-2 hover:rotate-[-1deg] hover:shadow-[0_26px_40px_-18px_rgb(42_26_16/0.55)]">
        <div className="flex h-[5.1rem] items-end gap-3 pb-3">
          <span aria-hidden="true" className="font-serif text-3xl leading-none text-burgundy">
            {ROMAN[index]}
          </span>
          <h3 className="font-serif text-[1.35rem] leading-tight text-shadow">{title}</h3>
        </div>
        <p className="mt-4 text-[0.98rem] leading-[1.75rem] text-shadow/85">{body}</p>
      </div>
    </motion.li>
  )
}
