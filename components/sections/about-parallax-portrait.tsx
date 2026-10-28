'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useMotionAllowed } from '@/lib/use-motion-allowed'
import { Portrait } from './psychologist'

export function AboutParallaxPortrait() {
  const ref = useRef<HTMLDivElement>(null)
  const motionOk = useMotionAllowed()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [36, -48])
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.7, 0.25])

  return (
    <div ref={ref} className="relative">
      <motion.div
        aria-hidden="true"
        style={motionOk ? { opacity: glow } : undefined}
        className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle,rgb(122_35_38/0.18),transparent_68%)]"
      />
      <motion.div style={motionOk ? { y } : undefined}>
        <Portrait priority />
      </motion.div>
    </div>
  )
}
