'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Award, BadgeCheck, GraduationCap } from 'lucide-react'
import { psychologist } from '@/data/content'
import { useMotionAllowed } from '@/lib/use-motion-allowed'
import { SectionHeading } from './section-heading'

export function AboutPath() {
  const root = useRef<HTMLElement>(null)
  const motionOk = useMotionAllowed()
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })
  const orbY = useTransform(scrollYProgress, [0, 1], [40, -90])
  const orbY2 = useTransform(scrollYProgress, [0, 1], [-20, 70])

  return (
    <section ref={root} aria-labelledby="credentials-title" className="relative overflow-hidden bg-paper-deep/50 py-24 lg:py-32">
      <motion.div
        aria-hidden="true"
        style={motionOk ? { y: orbY } : undefined}
        className="pointer-events-none absolute -top-10 left-[8%] size-[22rem] rounded-full bg-[radial-gradient(circle,rgb(122_35_38/0.12),transparent_68%)]"
      />
      <motion.div
        aria-hidden="true"
        style={motionOk ? { y: orbY2 } : undefined}
        className="pointer-events-none absolute right-[4%] bottom-0 size-[26rem] rounded-full bg-[radial-gradient(circle,rgb(196_149_74/0.16),transparent_65%)]"
      />

      <div className="container-editorial relative">
        <SectionHeading id="credentials-title" eyebrow="Qualifications & experience" title="The path so *far*" />

        <ol data-reveal-group className="mt-14 grid gap-5 md:grid-cols-3">
          {psychologist.degrees.map((degree, index) => (
            <li
              key={degree.award}
              data-reveal-item
              className="group relative overflow-hidden rounded-[1.15rem] border border-coffee/10 bg-paper p-7 shadow-[0_16px_36px_-28px_rgb(42_26_16/0.4)] transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-2 hover:border-burgundy/20 hover:shadow-[0_28px_48px_-22px_rgb(122_35_38/0.28)] sm:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-burgundy via-gilt to-gold transition-transform duration-700 group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between gap-3">
                <span className="font-serif text-4xl text-coffee/20 transition-colors duration-500 group-hover:text-burgundy/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-burgundy/8 text-burgundy transition-colors duration-500 group-hover:bg-burgundy group-hover:text-paper">
                  <GraduationCap className="size-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-6 font-serif text-[1.45rem] leading-snug font-semibold text-shadow">{degree.award}</p>
              <p className="mt-2 text-[0.95rem] text-coffee">{degree.place}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-5">
          {psychologist.sections.map((section) => {
            const Icon = section.icon
            return (
              <article
                key={section.id}
                data-reveal
                className="group grid content-start gap-4 rounded-[1.15rem] border border-transparent bg-paper/40 p-6 transition-[transform,background-color,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-coffee/10 hover:bg-paper hover:shadow-lifted sm:p-7"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-burgundy text-paper shadow-[0_12px_24px_-10px_rgb(122_35_38/0.55)] transition-transform duration-500 group-hover:scale-110">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="type-h3">{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-[1rem] leading-[1.8] text-shadow/80">
                    {paragraph}
                  </p>
                ))}
                {section.id === 'research' ? (
                  <p className="inline-flex w-fit items-center gap-2 rounded-full bg-gold/25 px-4 py-1.5 text-sm font-semibold text-coffee-deep">
                    <Award className="size-4 text-burgundy" aria-hidden="true" />
                    Best Paper Awards
                  </p>
                ) : null}
              </article>
            )
          })}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div
            data-reveal
            className="group rounded-[1.15rem] border border-coffee/10 bg-paper p-7 shadow-[0_16px_36px_-28px_rgb(42_26_16/0.35)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-lifted sm:p-9"
          >
            <h2 className="type-h3">Training & certifications</h2>
            <p className="mt-2 text-[0.98rem] text-shadow/75">Additional training in therapeutic approaches.</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {psychologist.training.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-burgundy/20 bg-burgundy/[0.04] px-4 py-2 text-[0.92rem] font-medium text-burgundy transition-[transform,background-color,border-color] duration-500 hover:-translate-y-0.5 hover:border-burgundy/45 hover:bg-burgundy/10"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div
            data-reveal
            className="group rounded-[1.15rem] border border-coffee/10 bg-paper p-7 shadow-[0_16px_36px_-28px_rgb(42_26_16/0.35)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-lifted sm:p-9"
          >
            <h2 className="type-h3">Registration & professional credentials</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {psychologist.registrations.map((item) => (
                <li
                  key={item.region}
                  className="flex items-start gap-3 rounded-[0.75rem] border border-coffee/8 bg-paper-deep/40 p-4 transition-colors duration-500 hover:border-burgundy/20 hover:bg-burgundy/[0.04]"
                >
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-burgundy" aria-hidden="true" />
                  <span>
                    <span className="type-eyebrow block text-[0.62rem] text-coffee">{item.region}</span>
                    <span className="mt-1 block font-serif text-xl font-semibold text-shadow">{item.credential}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
