import { useId, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface CandleProps {
  className?: string
  height?: number
  delay?: number
}

export function Candle({ className, height = 1, delay = 0 }: CandleProps) {
  const waxTop = 40 + (1 - height) * 50
  const timing = { animationDelay: `${-delay}s` } as CSSProperties
  const id = useId()
  const waxId = `${id}-wax`
  const flameId = `${id}-flame`
  return (
    <div aria-hidden="true" className={cn('relative w-8', className)}>
      <span
        className="candle-halo pointer-events-none absolute left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(248_217_143/0.55)_0%,rgb(240_170_80/0.22)_35%,transparent_70%)]"
        style={{ top: `${((waxTop - 14) / 130) * 100}%`, ...timing }}
      />
      <svg viewBox="0 0 40 130" className="relative w-full overflow-visible">
        <defs>
          <linearGradient id={waxId} x1="0" x2="1">
            <stop offset="0" stopColor="#cdb48a" />
            <stop offset="0.45" stopColor="#f3e6c8" />
            <stop offset="1" stopColor="#b89a6c" />
          </linearGradient>
          <radialGradient id={flameId} cx="0.5" cy="0.7" r="0.6">
            <stop offset="0" stopColor="#fffbe8" />
            <stop offset="0.35" stopColor="#ffe08a" />
            <stop offset="0.75" stopColor="#f2a33a" />
            <stop offset="1" stopColor="#d9601c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          className="flame"
          style={timing}
          d={`M20 ${waxTop - 30} C26 ${waxTop - 20} 27 ${waxTop - 12} 20 ${waxTop - 5} C13 ${waxTop - 12} 14 ${waxTop - 20} 20 ${waxTop - 30}Z`}
          fill={`url(#${flameId})`}
        />
        <path d={`M20 ${waxTop - 6} V${waxTop + 1}`} stroke="#2a1a10" strokeWidth="1.4" strokeLinecap="round" />
        <path
          d={`M8 ${waxTop + 2} C12 ${waxTop - 1} 28 ${waxTop - 1} 32 ${waxTop + 2} V122 H8Z`}
          fill={`url(#${waxId})`}
        />
        <path d={`M27 ${waxTop + 2} C29 ${waxTop + 12} 26 ${waxTop + 18} 28 ${waxTop + 26}`} stroke="#efe2c4" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="20" cy="124" rx="18" ry="5" fill="#8a6a3a" />
        <ellipse cx="20" cy="122" rx="16" ry="3.5" fill="#c9a24a" />
      </svg>
    </div>
  )
}
