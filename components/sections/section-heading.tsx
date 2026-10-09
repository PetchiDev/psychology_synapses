import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { KineticText } from '@/components/animations/kinetic-text'
import { Ornament } from '@/components/library/ornament'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

export const chapter = (index: string) => ROMAN[Number(index) - 1] ?? index

interface SectionHeadingProps {
  id: string
  index: string
  eyebrow: string
  /** Plain text; wrap a word in *asterisks* to emphasise it. */
  title: string
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
    <header className={cn('grid gap-5', align === 'center' && 'justify-items-center text-center', className)}>
      <p data-reveal className={cn('type-eyebrow flex items-center gap-3', light ? 'text-gold' : 'text-coffee')}>
        <span className={cn('font-serif text-lg tracking-normal normal-case italic', light ? 'text-paper' : 'text-burgundy')}>
          Chapter {chapter(index)}
        </span>
        <span aria-hidden="true" className={cn('h-px w-10', light ? 'bg-gold/60' : 'bg-gilt/60')} />
        {eyebrow}
      </p>
      <h2 id={id} className={cn('type-h2 max-w-3xl', light && 'text-paper')}>
        <KineticText text={title} emphasisClassName={light ? 'text-[#f0b9a6] italic' : undefined} />
      </h2>
      <Ornament className={cn('-mt-1', light && 'text-gold')} />
      {description ? (
        <div data-reveal className={cn('type-lead max-w-2xl', light ? 'text-paper/80' : 'text-shadow/80')}>
          {description}
        </div>
      ) : null}
      {note ? (
        <p data-reveal aria-hidden="true" className={cn('type-hand -rotate-2 text-2xl', light ? 'text-gold' : 'text-burgundy')}>
          {note}
        </p>
      ) : null}
    </header>
  )
}
