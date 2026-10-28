import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { KineticText } from '@/components/animations/kinetic-text'

interface SectionHeadingProps {
  id: string
  eyebrow?: string
  /** Plain text; wrap a word in *asterisks* to emphasise it. */
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({ id, eyebrow, title, description, align = 'left', tone = 'dark', as: Heading = 'h2', className }: SectionHeadingProps) {
  const light = tone === 'light'
  return (
    <header className={cn('grid gap-5', align === 'center' && 'justify-items-center text-center', className)}>
      {eyebrow ? (
        <p data-reveal className={cn('type-eyebrow flex items-center gap-3', light ? 'text-gold' : 'text-burgundy')}>
          <span aria-hidden="true" className={cn('rule-grow h-px w-8', light ? 'bg-gold/70' : 'bg-burgundy/60')} />
          {eyebrow}
        </p>
      ) : null}
      <Heading id={id} className={cn(Heading === 'h1' ? 'type-display max-w-[16ch]' : 'type-h2 max-w-3xl', light && 'text-paper')}>
        <KineticText text={title} emphasisClassName={light ? 'text-[#f0b9a6] italic' : undefined} />
      </Heading>
      {description ? (
        <div data-reveal className={cn('type-lead grid max-w-2xl gap-4', light ? 'text-paper/80' : 'text-shadow/80')}>
          {description}
        </div>
      ) : null}
    </header>
  )
}
