import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  note?: string
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
}

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  description,
  note,
  align = 'left',
  tone = 'dark',
  className,
}: SectionHeadingProps) {
  const light = tone === 'light'
  return (
    <header data-reveal className={cn('grid gap-5', align === 'center' && 'justify-items-center text-center', className)}>
      <p className={cn('type-eyebrow flex items-center gap-3', light ? 'text-latte' : 'text-coffee')}>
        <span className={cn('font-serif text-base tracking-normal normal-case', light ? 'text-paper' : 'text-burgundy')}>No. {index}</span>
        <span aria-hidden="true" className={cn('h-px w-10', light ? 'bg-latte/60' : 'bg-coffee/40')} />
        {eyebrow}
      </p>
      <h2 id={id} className={cn('type-h2 max-w-3xl', light && 'text-paper')}>
        {title}
      </h2>
      {description ? (
        <div className={cn('type-lead max-w-2xl', light ? 'text-paper/80' : 'text-shadow/80')}>{description}</div>
      ) : null}
      {note ? (
        <p aria-hidden="true" className={cn('type-hand -rotate-2 text-2xl', light ? 'text-latte' : 'text-burgundy')}>
          {note}
        </p>
      ) : null}
    </header>
  )
}
