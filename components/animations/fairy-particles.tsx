'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Firefly {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  phase: number
  speed: number
  sprite: HTMLCanvasElement
}

interface Petal {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  rotation: number
  spin: number
  sway: number
  phase: number
  flip: number
  flipSpeed: number
  color: string
}

interface Orb {
  x: number
  y: number
  vx: number
  vy: number
  phase: number
  sprite: HTMLCanvasElement
}

const GLOW_COLORS = ['248, 217, 143', '242, 190, 110', '255, 236, 190', '226, 194, 122']
const PETAL_COLORS = ['rgba(165, 33, 44, 0.55)', 'rgba(196, 70, 80, 0.5)', 'rgba(226, 194, 122, 0.55)', 'rgba(243, 230, 200, 0.7)']
const ORB_COLORS = ['248, 217, 143', '226, 174, 120', '214, 160, 130', '226, 194, 122']

const random = (min: number, max: number) => min + Math.random() * (max - min)

function makeSprite(rgb: string, radius: number) {
  const size = Math.ceil(radius * 8)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, `rgba(${rgb}, 1)`)
  gradient.addColorStop(0.18, `rgba(${rgb}, 0.85)`)
  gradient.addColorStop(0.45, `rgba(${rgb}, 0.25)`)
  gradient.addColorStop(1, `rgba(${rgb}, 0)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return canvas
}

function makeOrb(rgb: string, radius: number) {
  const size = Math.ceil(radius * 2)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, `rgba(${rgb}, 0.55)`)
  gradient.addColorStop(0.55, `rgba(${rgb}, 0.22)`)
  gradient.addColorStop(1, `rgba(${rgb}, 0)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return canvas
}

interface FairyParticlesProps {
  contained?: boolean
  density?: number
  className?: string
}

export function FairyParticles({ contained = false, density = 1, className }: FairyParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = 0
    let height = 0
    let fireflies: Firefly[] = []
    let petals: Petal[] = []
    let orbs: Orb[] = []
    let frame = 0
    let last = performance.now()
    let running = false
    let inView = true

    const spawnPetal = (initial = false): Petal => ({
      x: random(-0.1, 1) * width,
      y: initial ? random(0, height) : random(-60, -20),
      size: random(5, 9),
      vx: random(6, 16),
      vy: random(10, 20),
      rotation: random(0, Math.PI * 2),
      spin: random(-0.4, 0.4),
      sway: random(10, 26),
      phase: random(0, Math.PI * 2),
      flip: random(0, Math.PI * 2),
      flipSpeed: random(0.6, 1.4),
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    })

    const setup = () => {
      const box = contained ? canvas.parentElement?.getBoundingClientRect() : undefined
      width = box ? box.width : window.innerWidth
      height = box ? box.height : window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const mobile = window.innerWidth < 768
      const fireflyCount = Math.round((mobile ? 10 : 26) * density)
      const petalCount = Math.round((mobile ? 4 : 9) * density)
      const orbCount = Math.round((mobile ? 3 : 6) * density)
      fireflies = Array.from({ length: fireflyCount }, () => {
        const r = random(1.2, 2.6)
        return {
          x: random(0, width),
          y: random(0, height),
          r,
          vx: random(-6, 6),
          vy: random(-8, -2),
          phase: random(0, Math.PI * 2),
          speed: random(0.4, 0.9),
          sprite: makeSprite(GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)], r),
        }
      })
      petals = Array.from({ length: petalCount }, () => spawnPetal(true))
      orbs = Array.from({ length: orbCount }, (_, index) => ({
        x: random(0, width),
        y: random(0, height),
        vx: random(-5, 5),
        vy: random(-4, 4),
        phase: random(0, Math.PI * 2),
        sprite: makeOrb(ORB_COLORS[index % ORB_COLORS.length], random(mobile ? 60 : 90, mobile ? 120 : 190)),
      }))
    }

    const drawPetal = (petal: Petal) => {
      ctx.save()
      ctx.translate(petal.x, petal.y)
      ctx.rotate(petal.rotation)
      ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(petal.flip)))
      const s = petal.size
      ctx.fillStyle = petal.color
      ctx.beginPath()
      ctx.moveTo(0, s)
      ctx.bezierCurveTo(s, s * 0.4, s * 0.85, -s * 0.75, s * 0.2, -s)
      ctx.lineTo(0, -s * 0.72)
      ctx.lineTo(-s * 0.2, -s)
      ctx.bezierCurveTo(-s * 0.85, -s * 0.75, -s, s * 0.4, 0, s)
      ctx.fill()
      ctx.restore()
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = now / 1000
      ctx.clearRect(0, 0, width, height)

      for (const orb of orbs) {
        orb.x += (orb.vx + Math.sin(t * 0.08 + orb.phase) * 4) * dt
        orb.y += (orb.vy + Math.cos(t * 0.07 + orb.phase) * 3) * dt
        const half = orb.sprite.width / 2
        if (orb.x < -half) orb.x = width + half
        if (orb.x > width + half) orb.x = -half
        if (orb.y < -half) orb.y = height + half
        if (orb.y > height + half) orb.y = -half
        ctx.globalAlpha = 0.55 + 0.35 * Math.sin(t * 0.25 + orb.phase)
        ctx.drawImage(orb.sprite, orb.x - half, orb.y - half)
      }

      for (const fly of fireflies) {
        fly.x += (fly.vx + Math.sin(t * 0.3 + fly.phase) * 10) * dt
        fly.y += (fly.vy + Math.cos(t * 0.25 + fly.phase) * 6) * dt
        if (fly.y < -20) fly.y = height + 20
        if (fly.x < -20) fly.x = width + 20
        if (fly.x > width + 20) fly.x = -20
        const twinkle = 0.2 + 0.7 * (0.5 + 0.5 * Math.sin(t * fly.speed * 1.6 + fly.phase))
        ctx.globalAlpha = twinkle
        const size = fly.sprite.width
        ctx.drawImage(fly.sprite, fly.x - size / 2, fly.y - size / 2)
      }

      ctx.globalAlpha = 1
      for (const petal of petals) {
        petal.x += (petal.vx + Math.sin(t * 0.6 + petal.phase) * petal.sway) * dt
        petal.y += petal.vy * dt
        petal.rotation += petal.spin * dt
        petal.flip += petal.flipSpeed * dt
        if (petal.y > height + 30 || petal.x > width + 30) Object.assign(petal, spawnPetal())
        drawPetal(petal)
      }

      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running || !inView || document.hidden) return
      running = true
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const onVisibility = () => (document.hidden ? stop() : start())

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(setup, 200)
    }

    const onMotionChange = () => {
      if (reduceMotion.matches) {
        stop()
        ctx.clearRect(0, 0, width, height)
      } else start()
    }

    setup()
    start()
    let observer: IntersectionObserver | undefined
    let resizeObserver: ResizeObserver | undefined
    if (contained && canvas.parentElement) {
      observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting
        if (inView) start()
        else stop()
      })
      observer.observe(canvas.parentElement)
      resizeObserver = new ResizeObserver(onResize)
      resizeObserver.observe(canvas.parentElement)
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', onResize)
    reduceMotion.addEventListener('change', onMotionChange)

    return () => {
      stop()
      observer?.disconnect()
      resizeObserver?.disconnect()
      window.clearTimeout(resizeTimer)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      reduceMotion.removeEventListener('change', onMotionChange)
    }
  }, [contained, density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none inset-0', contained ? 'absolute' : 'fixed z-0', className)}
    />
  )
}
