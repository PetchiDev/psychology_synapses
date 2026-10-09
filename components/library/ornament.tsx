import { cn } from '@/lib/utils'

export function Ornament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 28"
      aria-hidden="true"
      focusable="false"
      className={cn('ornament-draw h-5 w-44 overflow-visible text-gilt', className)}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path data-draw pathLength={1} d="M104 14 H40 C30 14 24 8 28 4 C32 0 38 6 34 10 C28 16 14 16 4 14" />
        <path data-draw pathLength={1} d="M136 14 H200 C210 14 216 20 212 24 C208 28 202 22 206 18 C212 12 226 12 236 14" />
        <path data-draw pathLength={1} d="M100 8 C108 12 112 12 120 6 C128 12 132 12 140 8" />
        <path data-draw pathLength={1} d="M100 20 C108 16 112 16 120 22 C128 16 132 16 140 20" />
      </g>
      <path data-bloom d="M120 8 L126 14 L120 20 L114 14Z" fill="currentColor" />
    </svg>
  )
}
