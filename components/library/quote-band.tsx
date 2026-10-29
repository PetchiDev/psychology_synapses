'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { siteConfig } from '@/lib/site'
import { useMotionAllowed } from '@/lib/use-motion-allowed'
import { FairyParticles } from '@/components/animations/fairy-particles'
import { FloatingBook } from './floating-book'
import { Ornament } from './ornament'

export function QuoteBand() {
  const ref = useRef<HTMLElement>(null)
  const animate = useMotionAllowed()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const near = useTransform(scrollYProgress, [0, 1], [180, -180])
  const far = useTransform(scrollYProgress, [0, 1], [70, -70])
  const spin = useTransform(scrollYProgress, [0, 1], [-14, 14])
  const rotateX = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [24, 0, -16])
  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.9, 1, 0.96])

  return (
    <section ref={ref} aria-labelledby="quote-title" className="relative isolate overflow-hidden bg-mahogany py-28 text-paper lg:py-36">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,#4a2c18_0%,#2a180e_55%,#140a05_100%)]" />
      <FairyParticles contained density={0.6} />

      <motion.div aria-hidden="true" style={animate ? { y: far } : undefined} className="absolute inset-0 -z-10">
        <FloatingBook className="absolute top-[14%] left-[16%] hidden w-16 opacity-60 md:block" cover="#24364f" delay={1.5} />
        <FloatingBook className="absolute right-[18%] bottom-[16%] hidden w-14 opacity-50 md:block" cover="#2f4a3a" delay={3.2} />
      </motion.div>
      <motion.div aria-hidden="true" style={animate ? { y: near, rotate: spin } : undefined} className="absolute inset-0 -z-10">
        <FloatingBook className="absolute top-[10%] right-[4%] w-20 opacity-80 sm:w-28 lg:right-[8%]" delay={0.6} />
        <FloatingBook className="absolute bottom-[8%] left-[3%] w-20 opacity-80 sm:w-28 lg:left-[7%]" cover="#5a3b1f" delay={2.4} />
      </motion.div>

      <div className="container-editorial grid justify-items-center text-center [perspective:1200px]">
        <h2 id="quote-title" className="sr-only">
          A thought from the library
        </h2>
        <motion.figure style={animate ? { rotateX, scale } : undefined} className="grid justify-items-center">
          <p className="type-hand text-2xl text-gold">a thought to carry</p>
          <blockquote className="type-display mt-5 max-w-[16ch] text-[clamp(2.3rem,1.2rem+3.8vw,4.8rem)] [text-shadow:0_2px_24px_rgb(10_5_2/0.6)]">
            <p>
              Every mind has <span className="gilt-text gilt-shift">more than one story</span>
            </p>
          </blockquote>
          <Ornament className="mt-6 text-gold" />
          <figcaption className="mt-4 font-ui text-[0.7rem] tracking-[0.3em] text-gold/85 uppercase">{siteConfig.name}</figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
