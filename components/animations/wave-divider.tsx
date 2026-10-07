import { cn } from '@/lib/utils'

const shapes = {
  wave: 'M0 46 C120 18 240 18 360 38 S600 70 720 50 960 12 1080 26 1320 62 1440 40 V80 H0 Z',
  cloud:
    'M0 64 C40 64 52 40 92 40 C120 18 168 18 190 42 C222 30 262 34 278 58 C318 46 352 52 366 66 C410 36 470 34 500 60 C536 28 600 26 628 56 C664 44 700 48 716 64 C760 30 826 30 852 60 C890 40 938 42 958 62 C1000 26 1070 26 1098 58 C1132 42 1176 44 1192 64 C1232 34 1296 32 1322 60 C1360 44 1408 48 1440 62 V80 H0 Z',
} as const

interface WaveDividerProps {
  variant?: keyof typeof shapes
  flip?: boolean
  className?: string
  drift?: number
}

export function WaveDivider({ variant = 'wave', flip, className, drift = 0.06 }: WaveDividerProps) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none relative h-12 w-full overflow-hidden sm:h-16 lg:h-20', flip && 'rotate-180', className)}>
      <svg
        data-parallax-x={drift}
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-y-0 -left-[5%] h-full w-[110%]"
        fill="currentColor"
      >
        <path d={shapes[variant]} />
      </svg>
    </div>
  )
}
