'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export const AFFIRMATIONS = [
  'You don’t have to have it all figured out.',
  'Breathe. You are safe in this moment.',
  'Rest is not something you have to earn.',
  'Small steps still move you forward.',
  'Your feelings are welcome here.',
  'Be as gentle with yourself as you are with others.',
]

interface AffirmationsProps {
  className?: string
  interval?: number
}

export function Affirmations({ className, interval = 6500 }: AffirmationsProps) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let swap = 0
    const timer = window.setInterval(() => {
      setVisible(false)
      swap = window.setTimeout(() => {
        setIndex((current) => (current + 1) % AFFIRMATIONS.length)
        setVisible(true)
      }, 700)
    }, interval)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(swap)
    }
  }, [interval])

  return (
    <p
      className={cn(
        'transition-[opacity,translate,filter] duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100 blur-0' : '-translate-y-1 opacity-0 blur-[2px]',
        className,
      )}
    >
      {AFFIRMATIONS[index]}
    </p>
  )
}
