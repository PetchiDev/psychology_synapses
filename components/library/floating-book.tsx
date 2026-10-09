import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface FloatingBookProps {
  className?: string
  cover?: string
  delay?: number
}

const lines = [28, 38, 48, 58, 68, 78]

export function FloatingBook({ className, cover = '#6b1e1e', delay = 0 }: FloatingBookProps) {
  const timing = { animationDelay: `${-delay}s` } as CSSProperties
  return (
    <div aria-hidden="true" className={cn('ambient-float relative', className)} style={timing}>
      <svg viewBox="0 0 200 120" className="w-full overflow-visible drop-shadow-[0_18px_18px_rgb(0_0_0/0.45)]">
        <path d="M6 22 L100 30 L194 22 L194 104 L100 112 L6 104Z" fill={cover} />
        <path d="M6 22 L100 30 L194 22" fill="none" stroke="#d9b25e" strokeOpacity="0.6" strokeWidth="1.2" />
        <g className="page-flutter-left" style={timing}>
          <path d="M12 18 C40 8 76 12 100 26 V106 C76 94 40 92 12 100Z" fill="#f3e6c8" />
          {lines.map((y) => (
            <path key={y} d={`M24 ${y - 4} C46 ${y - 10} 70 ${y - 8} 90 ${y}`} stroke="#6e4e33" strokeOpacity="0.28" strokeWidth="1.2" fill="none" />
          ))}
        </g>
        <g className="page-flutter" style={timing}>
          <path d="M100 26 C124 12 160 8 188 18 V100 C160 92 124 94 100 106Z" fill="#f8eed6" />
          {lines.map((y) => (
            <path key={y} d={`M110 ${y} C130 ${y - 8} 154 ${y - 10} 176 ${y - 4}`} stroke="#6e4e33" strokeOpacity="0.28" strokeWidth="1.2" fill="none" />
          ))}
        </g>
        <path d="M100 26 V106" stroke="#b89a6c" strokeWidth="1.2" />
      </svg>
      <span className="absolute inset-x-[20%] -bottom-6 h-10 rounded-full bg-[radial-gradient(ellipse,rgb(248_217_143/0.35),transparent_70%)]" />
    </div>
  )
}
