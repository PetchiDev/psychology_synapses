import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface BookingFieldProps {
  id: string
  label: string
  hint?: ReactNode
  error?: string
  optional?: boolean
  labelAddon?: ReactNode
  className?: string
  children: (aria: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode
}

export function BookingField({ id, label, hint, error, optional, labelAddon, className, children }: BookingFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('grid gap-2.5', className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-[0.95rem] font-semibold text-shadow">
          {label}
          {optional ? <span className="font-normal text-coffee"> (optional)</span> : null}
        </Label>
        {labelAddon}
      </div>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {hint ? (
        <p id={hintId} className="text-sm leading-relaxed text-coffee">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-start gap-2 text-sm font-medium text-destructive">
          <span aria-hidden="true" className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-destructive" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
