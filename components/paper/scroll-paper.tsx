import { useId, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollPaperProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  seed?: number
  tilt?: number
  float?: boolean
  stain?: boolean
}

/**
 * A wrinkled, coffee-stained sheet with a lightly burnt, irregular edge. The edge is drawn in pixel
 * space, so the roughness stays the same at any size instead of stretching with the box.
 */
export function ScrollPaper({ children, className, contentClassName, seed = 3, tilt = -1.2, float = false, stain = true }: ScrollPaperProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const rough = `${id}-rough`
  const char = `${id}-char`
  const cut = `${id}-cut`

  return (
    <div
      className={cn('relative isolate', float ? 'paper-float' : 'sm:[rotate:var(--tilt)]', className)}
      style={{ '--tilt': `${tilt}deg` } as CSSProperties}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 -z-10 size-full overflow-visible drop-shadow-[0_26px_30px_rgb(42_26_16/0.28)]"
      >
        <defs>
          <filter id={rough} x="-4%" y="-4%" width="108%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves="4" seed={seed} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id={char} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves="4" seed={seed} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" result="shape" />
            <feGaussianBlur in="shape" stdDeviation="2.2" />
          </filter>
          <mask id={cut} maskUnits="userSpaceOnUse">
            <rect x="1.6%" y="2%" width="96.8%" height="96%" rx="6" fill="#fff" filter={`url(#${rough})`} />
          </mask>
        </defs>
        <rect x="0.6%" y="0.8%" width="98.8%" height="98.4%" rx="8" fill="#3b2011" opacity="0.9" filter={`url(#${char})`} />
        <rect x="1%" y="1.4%" width="98%" height="97.2%" rx="8" fill="#7a4a24" opacity="0.75" filter={`url(#${rough})`} />
        <g mask={`url(#${cut})`}>
          <rect width="100%" height="100%" fill="#efe0bd" />
          <image href="/images/textures/scroll-paper.jpg" width="100%" height="100%" preserveAspectRatio="none" />
          {stain ? (
            <>
              <circle cx="86%" cy="16%" r="34" fill="none" stroke="#8a5528" strokeOpacity="0.16" strokeWidth="5" filter={`url(#${rough})`} />
              <circle cx="12%" cy="88%" r="18" fill="#8a5528" fillOpacity="0.07" filter={`url(#${rough})`} />
            </>
          ) : null}
        </g>
      </svg>
      <div className={cn('relative', contentClassName)}>{children}</div>
    </div>
  )
}
