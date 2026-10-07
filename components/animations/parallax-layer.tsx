import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ParallaxLayerProps {
  depth: number
  pointer?: boolean
  className?: string
  innerClassName?: string
  children: ReactNode
}

export function ParallaxLayer({ depth, pointer = true, className, innerClassName, children }: ParallaxLayerProps) {
  return (
    <div aria-hidden="true" data-scene-layer={depth} className={cn('pointer-events-none absolute will-change-transform', className)}>
      <div data-pointer-layer={pointer ? depth : undefined} className={cn('h-full w-full', innerClassName)}>
        {children}
      </div>
    </div>
  )
}
