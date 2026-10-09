'use client'

import { Children, useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useMediaQuery, useMotionAllowed } from '@/lib/use-motion-allowed'

interface StackedPagesProps {
  children: ReactNode
  label: string
}

export function StackedPages({ children, label }: StackedPagesProps) {
  const ref = useRef<HTMLOListElement>(null)
  const motionAllowed = useMotionAllowed()
  const wide = useMediaQuery('(min-width: 768px)')
  const stack = motionAllowed && wide
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const items = Children.toArray(children)

  return (
    <ol ref={ref} aria-label={label} className="relative grid gap-6 md:block">
      {items.map((child, index) => (
        <Page key={index} index={index} total={items.length} progress={scrollYProgress} stack={stack} animate={motionAllowed}>
          {child}
        </Page>
      ))}
    </ol>
  )
}

interface PageProps {
  index: number
  total: number
  progress: MotionValue<number>
  stack: boolean
  animate: boolean
  children: ReactNode
}

function Page({ index, total, progress, stack, animate, children }: PageProps) {
  const behind = total - 1 - index
  const start = index / total
  const scale = useTransform(progress, [start, 1], [1, 1 - behind * 0.03])
  const shade = useTransform(progress, [start, 1], [0, Math.min(behind * 0.05, 0.32)])

  return (
    <li
      className={stack ? 'sticky h-[44vh] min-h-[19rem] pb-6 last:h-auto' : undefined}
      style={stack ? { top: `calc(7.5rem + ${index * 0.9}rem)` } : undefined}
    >
      <motion.div style={stack ? { scale, transformOrigin: '50% 0%' } : undefined} className="relative">
        <motion.div
          initial={animate ? { opacity: 0, y: 40, rotate: -1 } : false}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
        {stack ? (
          <motion.span
            aria-hidden="true"
            style={{ opacity: shade }}
            className="pointer-events-none absolute inset-0 rounded-[0.5rem] bg-mahogany"
          />
        ) : null}
      </motion.div>
    </li>
  )
}
