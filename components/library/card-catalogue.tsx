'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { libraryChapters, type LibraryChapter } from '@/data/content'
import { useMotionAllowed } from '@/lib/use-motion-allowed'
import { Ornament } from './ornament'
import { ROMAN } from './roman'

export function CardCatalogue() {
  const cabinet = useRef<HTMLDivElement>(null)
  const animate = useMotionAllowed()
  const { scrollYProgress } = useScroll({ target: cabinet, offset: ['start end', 'end start'] })
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 1], [26, 0, -8])
  const y = useTransform(scrollYProgress, [0, 0.4], [90, 0])

  return (
    <section aria-labelledby="catalogue-title" className="relative overflow-x-clip py-20 lg:py-28">
      <div className="container-editorial grid justify-items-center gap-6 text-center">
        <p data-reveal className="font-ui text-[0.7rem] tracking-[0.3em] text-coffee uppercase">
          Find your way
        </p>
        <h2 id="catalogue-title" data-reveal className="type-h2 max-w-3xl">
          The card <em className="text-burgundy italic">catalogue</em>
        </h2>
        <Ornament className="text-gilt" />
        <p data-reveal className="type-lead max-w-2xl text-shadow/80">
          Every chapter has a drawer. Hover over one, or tap it, and its card rises to show what the chapter holds.
        </p>

        <div ref={cabinet} className="mt-8 w-full max-w-5xl [perspective:1600px]">
          <motion.div
            style={animate ? { rotateX, y, transformOrigin: '50% 100%' } : undefined}
            className="relative rounded-[0.5rem] bg-[linear-gradient(180deg,#5d3a22_0%,#43281a_55%,#2f1b10_100%)] p-3 shadow-[inset_0_0_0_1px_rgb(226_194_122/0.25),inset_0_2px_0_rgb(255_220_170/0.12),0_40px_60px_-30px_rgb(36_21_13/0.75)] [transform-style:preserve-3d] sm:p-4"
          >
            <div aria-hidden="true" className="-mx-3 -mt-3 mb-3 h-4 rounded-t-[0.5rem] bg-[linear-gradient(180deg,#7a5131,#4a2c18)] sm:-mx-4 sm:-mt-4 sm:mb-4" />
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {libraryChapters.map((chapter, index) => (
                <Drawer key={chapter.slug} chapter={chapter} index={index} animate={animate} />
              ))}
            </ul>
          </motion.div>
          <div aria-hidden="true" className="mx-6 h-3 rounded-b-[0.4rem] bg-[#2b1a10]/85" />
        </div>
      </div>
    </section>
  )
}

function Drawer({ chapter, index, animate }: { chapter: LibraryChapter; index: number; animate: boolean }) {
  const [open, setOpen] = useState(false)
  const delay = (index % 3) * 0.12
  const cardId = `catalogue-card-${chapter.slug}`
  const Icon = chapter.icon

  return (
    <motion.li
      initial={animate ? 'rest' : false}
      whileInView={animate ? 'shown' : undefined}
      viewport={{ once: true, amount: 0.45 }}
      data-open={open}
      className="group rounded-[0.35rem] bg-[#24150c] p-2 shadow-[inset_0_6px_14px_rgb(0_0_0/0.6)]"
    >
      <div className="relative overflow-hidden rounded-t-[0.25rem] bg-[radial-gradient(ellipse_at_50%_100%,#3a2213,#1a0e07_75%)] pt-2">
        <div
          id={cardId}
          className="catalogue-card relative mx-2 translate-y-[calc(100%-5.6rem)] rounded-[0.25rem] px-5 pb-10 text-left transition-[translate,box-shadow] duration-700 ease-(--ease-paper) group-hover:translate-y-0 group-has-[button:focus-visible]:translate-y-0 group-data-[open=true]:translate-y-0 motion-reduce:transition-none"
        >
          <div className="flex h-[5.1rem] items-end justify-between gap-3 pb-3">
            <h3 className="font-serif text-[1.25rem] leading-tight text-shadow">{chapter.title}</h3>
            <Icon aria-hidden="true" className="mb-1 size-5 shrink-0 text-burgundy" />
          </div>
          <ul className="mt-2 grid text-[0.92rem] leading-[1.75rem] text-shadow/85">
            {chapter.contents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <motion.div
        variants={{ rest: { z: 0, y: 0 }, shown: { z: [0, 60, 30], y: [0, 6, 3], transition: { duration: 1.1, delay, ease: 'easeOut' } } }}
        className="relative z-10 -mt-2"
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={cardId}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-[0.25rem] bg-[linear-gradient(180deg,#7a5131_0%,#5d3a22_50%,#4a2c18_100%)] px-4 py-3 text-left shadow-[inset_0_1px_0_rgb(255_220_170/0.25),inset_0_-2px_6px_rgb(0_0_0/0.35),0_10px_18px_-8px_rgb(0_0_0/0.6)] transition-[translate,filter] duration-500 ease-(--ease-paper) group-hover:translate-y-1 group-hover:brightness-110 group-data-[open=true]:translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <span className="min-w-0 rounded-[0.15rem] bg-[linear-gradient(180deg,#f0d999,#c39a4c)] px-2.5 py-1 font-serif text-[0.85rem] leading-snug text-shadow shadow-[inset_0_0_0_1px_rgb(92_60_20/0.5)]">
            {ROMAN[index]} · {chapter.title}
            <span className="sr-only">: show what this chapter holds</span>
          </span>
          <span aria-hidden="true" className="h-2.5 w-12 shrink-0 rounded-full bg-[linear-gradient(180deg,#f0d999,#9c7433)] shadow-[0_2px_3px_rgb(0_0_0/0.5)]" />
        </button>
      </motion.div>
    </motion.li>
  )
}
