import type { ComponentPropsWithoutRef, ElementType } from 'react'

type ScrollRevealProps<T extends ElementType> = {
  as?: T
  group?: boolean
} & ComponentPropsWithoutRef<T>

export function ScrollReveal<T extends ElementType = 'div'>({ as, group, ...props }: ScrollRevealProps<T>) {
  const Component: ElementType = as ?? 'div'
  return <Component {...(group ? { 'data-reveal-group': '' } : { 'data-reveal': '' })} {...props} />
}

export function RevealItem<T extends ElementType = 'div'>({ as, ...props }: { as?: T } & ComponentPropsWithoutRef<T>) {
  const Component: ElementType = as ?? 'div'
  return <Component data-reveal-item="" {...props} />
}
