'use client'

import Spline from '@splinetool/react-spline'

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad: () => void
}

export default function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  return <Spline scene={scene} onLoad={onLoad} className={className} />
}
