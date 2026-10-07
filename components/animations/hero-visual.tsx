'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import { SynapseVisual } from './synapse-visual'

const SplineScene = dynamic(() => import('./spline-scene'), { ssr: false })

const sceneUrl = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL

interface NavigatorWithConnection extends Navigator {
  connection?: { saveData?: boolean }
}

export function HeroVisual({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!sceneUrl) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smallScreen = window.matchMedia('(max-width: 767px)').matches
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData
    if (reduceMotion || smallScreen || saveData) return

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setEnabled(true), { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(() => setEnabled(true), 1500)
    return () => clearTimeout(id)
  }, [])

  return (
    <figure className={cn('relative', className)}>
      <div className="relative aspect-[15/16] w-full">
        <SynapseVisual muted={loaded} className="absolute inset-0" />
        {enabled && sceneUrl ? (
          <div className={cn('absolute inset-0 transition-opacity duration-1000', loaded ? 'opacity-100' : 'opacity-0')}>
            <SplineScene scene={sceneUrl} onLoad={() => setLoaded(true)} className="h-full w-full" />
          </div>
        ) : null}
      </div>
      <figcaption className="sr-only">
        An abstract illustration of a calm mind: soft nodes connected by gently pulsing lines, representing thoughts, feelings and
        connection.
      </figcaption>
    </figure>
  )
}
