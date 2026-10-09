'use client'

import { Fragment } from 'react'
import { motion, type Variants } from 'motion/react'
import { useMotionAllowed } from '@/lib/use-motion-allowed'

const line: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.075, delayChildren: 0.1 } },
}

const word: Variants = {
  hidden: { y: '110%', rotate: 4, opacity: 0 },
  shown: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] } },
}

interface Token {
  emphasis: string
  rest: string
}

// Words wrapped in *asterisks* render as emphasis, e.g. "Care that feels *human*, always."
const tokenize = (text: string): Token[] =>
  text.split(' ').map((raw) => {
    const match = raw.match(/^\*(.+?)\*(.*)$/)
    return match ? { emphasis: match[1], rest: match[2] } : { emphasis: '', rest: raw }
  })

interface KineticTextProps {
  text: string
  className?: string
  emphasisClassName?: string
}

export function KineticText({ text, className, emphasisClassName = 'text-burgundy italic' }: KineticTextProps) {
  const animate = useMotionAllowed()
  const tokens = tokenize(text)

  const render = (token: Token) => (
    <>
      {token.emphasis ? <em className={emphasisClassName}>{token.emphasis}</em> : null}
      {token.rest}
    </>
  )

  if (!animate) {
    return (
      <span className={className}>
        {tokens.map((token, index) => (
          <Fragment key={index}>
            {render(token)}
            {index < tokens.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    )
  }

  return (
    <motion.span className={className} variants={line} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.4 }}>
      {tokens.map((token, index) => (
        <Fragment key={index}>
          <span className="-mb-[0.16em] inline-block overflow-hidden pr-[0.06em] pb-[0.16em] align-bottom">
            <motion.span className="inline-block origin-bottom-left" variants={word}>
              {render(token)}
            </motion.span>
          </span>
          {index < tokens.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </motion.span>
  )
}
