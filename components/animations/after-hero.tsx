'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useMotionAllowed } from '@/lib/use-motion-allowed'

/**
 * Holds the section that sits over the last screen of the hero. It stays hidden while the storybook
 * zooms in, then fades in near the top of the viewport once the page has turned to paper.
 */
export function AfterHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const animate = useMotionAllowed()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const opacity = useTransform(scrollYProgress, [0.82, 0.9], [0, 1])
  const y = useTransform(scrollYProgress, [0.82, 0.96], [28, 0])
  const pointerEvents = useTransform(opacity, (value) => (value < 0.5 ? 'none' : 'auto'))

  return (
    <motion.div ref={ref} style={animate ? { opacity, y, pointerEvents } : undefined}>
      {children}
    </motion.div>
  )
}
