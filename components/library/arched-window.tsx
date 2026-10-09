import { cn } from '@/lib/utils'

const stars = [
  [60, 120], [110, 80], [180, 110], [230, 70], [90, 190], [205, 170], [150, 150], [250, 220], [70, 260], [130, 240],
] as const

export function ArchedWindow({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('relative', className)}>
      <svg viewBox="0 0 300 520" className="h-full w-full" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="window-night" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#141b33" />
            <stop offset="0.6" stopColor="#26304f" />
            <stop offset="1" stopColor="#3d3a52" />
          </linearGradient>
          <radialGradient id="window-moon" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="0.5" stopColor="#f3e6c8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f3e6c8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M20 520 V170 C20 80 80 16 150 16 C220 16 280 80 280 170 V520Z" fill="#2b1a10" />
        <path d="M36 520 V172 C36 92 88 34 150 34 C212 34 264 92 264 172 V520Z" fill="url(#window-night)" />
        <circle cx="200" cy="120" r="46" fill="url(#window-moon)" />
        <circle cx="200" cy="120" r="20" fill="#fbf3dc" />
        <g fill="#f3e6c8">
          {stars.map(([x, y], index) => (
            <circle key={`${x}-${y}`} className="ambient-twinkle" style={{ animationDelay: `${-index * 0.6}s` }} cx={x} cy={y} r={index % 3 === 0 ? 1.8 : 1.2} />
          ))}
        </g>
        <g stroke="#3a2416" strokeWidth="7" fill="none">
          <path d="M150 34 V520" />
          <path d="M36 250 H264" />
          <path d="M36 380 H264" />
          <path d="M70 172 C70 110 104 70 150 70 C196 70 230 110 230 172" />
        </g>
        <circle cx="150" cy="150" r="22" fill="none" stroke="#3a2416" strokeWidth="6" />
        <path d="M20 520 V170 C20 80 80 16 150 16 C220 16 280 80 280 170 V520" fill="none" stroke="#b8893b" strokeOpacity="0.35" strokeWidth="2" />
      </svg>
      <div className="pointer-events-none absolute top-[30%] left-1/2 h-[120%] w-[160%] -translate-x-1/2 bg-[linear-gradient(180deg,rgb(200_210_235/0.16),transparent_75%)] [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]" />
    </div>
  )
}
