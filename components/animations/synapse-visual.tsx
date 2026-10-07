'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from './gsap'

const nodes = [
  [300, 118], [222, 146], [380, 150], [160, 214], [262, 210], [345, 226], [438, 218],
  [128, 300], [214, 286], [302, 300], [392, 296], [470, 304], [170, 378], [258, 372],
  [350, 380], [438, 372], [226, 446], [318, 452], [400, 440], [300, 520],
] as const

const links = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [4, 5], [3, 7], [3, 8], [4, 9], [5, 9],
  [5, 10], [6, 10], [6, 11], [7, 12], [8, 9], [8, 13], [9, 14], [10, 14], [10, 15], [11, 15],
  [12, 13], [13, 16], [14, 17], [15, 18], [16, 17], [17, 18], [17, 19], [12, 16], [18, 19],
] as const

const curve = (a: readonly [number, number], b: readonly [number, number], index: number) => {
  const mx = (a[0] + b[0]) / 2
  const my = (a[1] + b[1]) / 2
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const bend = (index % 2 === 0 ? 1 : -1) * 0.22
  return `M${a[0]} ${a[1]} Q${(mx - dy * bend).toFixed(1)} ${(my + dx * bend).toFixed(1)} ${b[0]} ${b[1]}`
}

const paths = links.map(([a, b], index) => curve(nodes[a], nodes[b], index))
const pulsing = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27]
const hubs = new Set([0, 4, 9, 10, 14, 17])

interface SynapseVisualProps {
  className?: string
  muted?: boolean
}

export function SynapseVisual({ className, muted }: SynapseVisualProps) {
  const root = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } })

        tl.from('[data-link]', { strokeDashoffset: 1, duration: 2.4, stagger: 0.035, ease: 'power2.out' }, 0)
        tl.from('[data-node]', { scale: 0, transformOrigin: 'center', duration: 0.9, stagger: 0.03, ease: 'back.out(2)' }, 0.3)
        tl.from('[data-note]', { autoAlpha: 0, y: 8, duration: 1, stagger: 0.25 }, 1.4)

        const loops = [
          gsap.to('[data-breathe]', { scale: 1.025, transformOrigin: '50% 50%', duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
          gsap.to('[data-hub]', { scale: 1.45, opacity: 0.25, transformOrigin: 'center', duration: 2.6, repeat: -1, yoyo: true, stagger: { each: 0.45, from: 'random' } }),
          gsap.fromTo(
            '[data-pulse]',
            { strokeDashoffset: 0.12 },
            { strokeDashoffset: -1, duration: 3.2, repeat: -1, ease: 'none', stagger: { each: 0.6, repeat: -1 }, delay: 2 },
          ),
          gsap.to('[data-drift]', { y: -10, x: 6, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
        ]

        const observer = new IntersectionObserver(([entry]) => {
          loops.forEach((loop) => (entry.isIntersecting ? loop.resume() : loop.pause()))
        })
        if (root.current) observer.observe(root.current)
        return () => observer.disconnect()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <svg
      ref={root}
      viewBox="0 0 600 640"
      className={cn('h-full w-full overflow-visible transition-opacity duration-1000', muted && 'opacity-0', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="synapse-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fbf5e9" />
          <stop offset="70%" stopColor="#efe2c9" />
          <stop offset="100%" stopColor="#d7c1a7" />
        </radialGradient>
        <filter id="synapse-paper" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
        </filter>
      </defs>

      <g data-drift>
        <path
          d="M300 60c124 0 230 84 236 214 6 138-80 300-236 318C142 610 52 476 62 318 70 168 170 60 300 60Z"
          fill="url(#synapse-glow)"
          filter="url(#synapse-paper)"
        />
        <path
          d="M300 60c124 0 230 84 236 214 6 138-80 300-236 318C142 610 52 476 62 318 70 168 170 60 300 60Z"
          fill="none"
          stroke="#6b4f3a"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="2 7"
          transform="translate(14 10) rotate(-3 300 330)"
        />
      </g>

      <g data-breathe>
        {paths.map((d, index) => (
          <path
            key={`link-${index}`}
            data-link
            d={d}
            pathLength={1}
            strokeDasharray="1"
            fill="none"
            stroke="#6b4f3a"
            strokeOpacity={0.55}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        ))}
        {pulsing.map((index) => (
          <path
            key={`pulse-${index}`}
            data-pulse
            d={paths[index]}
            pathLength={1}
            strokeDasharray="0.12 2"
            strokeDashoffset={0.12}
            fill="none"
            stroke="#6a1f26"
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}
        {nodes.map(([cx, cy], index) => (
          <g key={`node-${index}`}>
            {hubs.has(index) ? <circle data-hub cx={cx} cy={cy} r={14} fill="#6a1f26" opacity={0.12} /> : null}
            <circle
              data-node
              cx={cx}
              cy={cy}
              r={hubs.has(index) ? 7 : 4.5}
              fill={hubs.has(index) ? '#6a1f26' : '#2b1e1a'}
              stroke="#f7eedc"
              strokeWidth={2}
            />
          </g>
        ))}
      </g>

      <g data-note fill="#6a1f26" style={{ fontFamily: 'var(--font-hand), cursive' }} fontSize="26">
        <text x="452" y="96">feelings</text>
        <path d="M470 104c-12 22-30 40-52 62" fill="none" stroke="#6a1f26" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <g data-note fill="#6a1f26" style={{ fontFamily: 'var(--font-hand), cursive' }} fontSize="26">
        <text x="0" y="470">thoughts</text>
        <path d="M60 478c34 16 70 4 104-32" fill="none" stroke="#6a1f26" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <g data-note fill="#6a1f26" style={{ fontFamily: 'var(--font-hand), cursive' }} fontSize="26">
        <text x="410" y="560">connection</text>
        <path d="M424 538c-8-26-4-50 2-70" fill="none" stroke="#6a1f26" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  )
}
