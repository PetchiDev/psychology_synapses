import { cn } from '@/lib/utils'

const SPINES = ['#6b1e1e', '#7a2c22', '#2f4a3a', '#24364f', '#5a3b1f', '#8a5a2b', '#3d2a4a', '#4a1c24', '#2c3f33', '#7b5a2e', '#5e2a1a']
const WIDTH = 360
const HEIGHT = 1000
const SHELF_TOP = 70
const ROW = 132
const ROWS = 7
const INSET = 22

function seeded(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Spine {
  x: number
  y: number
  w: number
  h: number
  color: string
  tilt: number
  bands: boolean
}

function buildRows(seed: number) {
  const rand = seeded(seed)
  const spines: Spine[] = []
  for (let row = 0; row < ROWS; row++) {
    const floor = SHELF_TOP + (row + 1) * ROW - 10
    let x = INSET + 4
    while (x < WIDTH - INSET - 14) {
      if (rand() < 0.07) {
        x += 10 + rand() * 18
        continue
      }
      const w = Math.min(12 + rand() * 16, WIDTH - INSET - x - 2)
      const h = 78 + rand() * 38
      const lean = rand() < 0.06
      spines.push({
        x,
        y: floor - h,
        w,
        h,
        color: SPINES[Math.floor(rand() * SPINES.length)],
        tilt: lean ? 6 + rand() * 6 : 0,
        bands: rand() > 0.25,
      })
      x += w + (lean ? 8 : 1.2)
    }
  }
  return spines
}

interface BookshelfProps {
  side: 'left' | 'right'
  seed?: number
  className?: string
}

export function Bookshelf({ side, seed = 7, className }: BookshelfProps) {
  const spines = buildRows(seed)
  const lightId = `shelf-light-${side}-${seed}`
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio={side === 'left' ? 'xMaxYMax slice' : 'xMinYMax slice'}
      className={cn('h-full w-full', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={lightId} x1={side === 'left' ? '1' : '0'} x2={side === 'left' ? '0' : '1'} y1="0" y2="0">
          <stop offset="0" stopColor="#f8d98f" stopOpacity="0.16" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0.15" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="#3a2416" />
      <rect x={INSET} y={SHELF_TOP} width={WIDTH - INSET * 2} height={HEIGHT - SHELF_TOP} fill="#1b0f08" />
      <path d={`M0 0 H${WIDTH} V${SHELF_TOP - 18} H0Z`} fill="#4a2e1c" />
      <path d={`M0 ${SHELF_TOP - 18} H${WIDTH} V${SHELF_TOP} H0Z`} fill="#2b1a10" />
      <path d={`M0 ${SHELF_TOP - 26} H${WIDTH}`} stroke="#b8893b" strokeOpacity="0.35" strokeWidth="1.5" />

      {spines.map((spine, index) => (
        <g key={index} transform={spine.tilt ? `rotate(${spine.tilt} ${spine.x + spine.w} ${spine.y + spine.h})` : undefined}>
          <rect x={spine.x} y={spine.y} width={spine.w} height={spine.h} rx="1.5" fill={spine.color} />
          <rect x={spine.x} y={spine.y} width={spine.w * 0.28} height={spine.h} fill="#fff" opacity="0.06" />
          {spine.bands ? (
            <g fill="#d9b25e" opacity="0.7">
              <rect x={spine.x + 1.5} y={spine.y + 8} width={spine.w - 3} height="2" />
              <rect x={spine.x + 1.5} y={spine.y + 13} width={spine.w - 3} height="1" />
              <rect x={spine.x + 1.5} y={spine.y + spine.h - 12} width={spine.w - 3} height="2" />
            </g>
          ) : (
            <rect x={spine.x + 3} y={spine.y + spine.h * 0.3} width={Math.max(spine.w - 6, 2)} height={spine.h * 0.2} fill="#e9d6ae" opacity="0.35" />
          )}
        </g>
      ))}

      {Array.from({ length: ROWS }, (_, row) => {
        const y = SHELF_TOP + (row + 1) * ROW - 10
        return (
          <g key={row}>
            <rect x="0" y={y} width={WIDTH} height="14" fill="#4a2e1c" />
            <rect x="0" y={y} width={WIDTH} height="2" fill="#6b4528" />
            <rect x="0" y={y + 14} width={WIDTH} height="6" fill="#000" opacity="0.35" />
          </g>
        )
      })}

      <rect x="0" y="0" width={INSET} height={HEIGHT} fill="#432918" />
      <rect x={WIDTH - INSET} y="0" width={INSET} height={HEIGHT} fill="#432918" />
      <rect width={WIDTH} height={HEIGHT} fill={`url(#${lightId})`} />
    </svg>
  )
}
