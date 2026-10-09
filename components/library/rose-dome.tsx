import { useId } from 'react'
import { cn } from '@/lib/utils'

const sparkles = [
  [70, 120, 3],
  [196, 104, 2.4],
  [92, 214, 2],
  [178, 196, 2.8],
  [130, 92, 2],
] as const

export function RoseDome({ className }: { className?: string }) {
  const id = useId()
  const glass = `${id}-glass`
  const wood = `${id}-wood`
  const petal = `${id}-petal`
  const glow = `${id}-glow`

  return (
    <div aria-hidden="true" className={cn('relative', className)}>
      <span className="candle-halo absolute top-[30%] left-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_190_170/0.4)_0%,rgb(248_217_143/0.18)_40%,transparent_70%)]" />
      <svg viewBox="0 0 260 380" className="relative w-full overflow-visible">
        <defs>
          <linearGradient id={glass} x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.3" stopColor="#fff" stopOpacity="0.04" />
            <stop offset="0.8" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={wood} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#6b4528" />
            <stop offset="1" stopColor="#2b1a10" />
          </linearGradient>
          <radialGradient id={petal} cx="0.5" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#e04a52" />
            <stop offset="0.6" stopColor="#a5212c" />
            <stop offset="1" stopColor="#5e0f18" />
          </radialGradient>
          <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd9b0" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffd9b0" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="130" cy="150" rx="80" ry="80" fill={`url(#${glow})`} />

        <path d="M130 300 C128 260 134 220 130 170" stroke="#3f5a35" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M131 250 C150 236 170 236 180 244 C164 256 146 258 131 250Z" fill="#4e6e40" />
        <path d="M129 214 C110 200 92 202 82 210 C98 222 116 222 129 214Z" fill="#4e6e40" />
        <path d="M130 270 l-5 -6 M131 230 l6 -5" stroke="#3f5a35" strokeWidth="2" strokeLinecap="round" />

        <g>
          <path d="M130 120 C104 118 96 142 104 160 C112 176 148 176 156 160 C164 142 156 118 130 120Z" fill={`url(#${petal})`} />
          <path d="M108 136 C100 152 110 170 130 172 C116 162 112 150 118 136Z" fill="#7a1622" />
          <path d="M152 136 C160 152 150 170 130 172 C144 162 148 150 142 136Z" fill="#8b1a26" />
          <path d="M112 128 C116 116 144 112 150 128 C146 140 118 142 112 128Z" fill="#b82a37" />
          <path
            d="M131 122 C141 121 145 131 137 135 C129 139 121 133 125 127 C128 123 135 125 134 129"
            stroke="#5e0f18"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M114 130 C112 142 118 152 128 156" stroke="#5e0f18" strokeOpacity="0.55" strokeWidth="1.2" fill="none" />
          <path d="M148 130 C150 142 144 152 134 156" stroke="#5e0f18" strokeOpacity="0.55" strokeWidth="1.2" fill="none" />
        </g>

        <path className="petal-fall" d="M150 184 C156 180 162 184 160 190 C156 194 150 192 150 184Z" fill="#a5212c" />

        <g fill="#f8d98f">
          {sparkles.map(([x, y, r], index) => (
            <circle key={index} className="ambient-twinkle" style={{ animationDelay: `${-index * 0.9}s` }} cx={x} cy={y} r={r} />
          ))}
        </g>

        <path d="M54 312 V130 C54 70 88 38 130 38 C172 38 206 70 206 130 V312" fill={`url(#${glass})`} stroke="#f3e6c8" strokeOpacity="0.45" strokeWidth="2" />
        <path className="glass-shine" d="M72 290 V136 C72 92 94 64 118 56" stroke="#fff" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M186 140 C186 116 178 98 166 86" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="130" cy="34" r="7" fill="#c9a24a" />

        <path d="M40 312 H220 L210 334 H50Z" fill={`url(#${wood})`} />
        <path d="M40 312 H220" stroke="#d9b25e" strokeOpacity="0.6" strokeWidth="1.5" />
        <path d="M70 334 H190 L180 364 H80Z" fill="#2b1a10" />
        <ellipse cx="130" cy="370" rx="80" ry="8" fill="#000" opacity="0.35" />
      </svg>
    </div>
  )
}
