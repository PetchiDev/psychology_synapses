'use client'

import { useEffect, useRef } from 'react'

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  rotation: number
  color: string
}

const COLORS = ['#f3dfa0', '#f3c9a8', '#cdc3e3', '#fff6dc', '#e8bec0']
const MAX_SPARKS = 60
const EMIT_EVERY_PX = 14

const random = (min: number, max: number) => min + Math.random() * (max - min)

export function CursorSparkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const allowed = window.matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine) and (hover: hover)')
    if (!allowed.matches) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const sparks: Spark[] = []
    let frame = 0
    let running = false
    let last = performance.now()
    let lastX = -1
    let lastY = -1

    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawStar = (spark: Spark, alpha: number) => {
      const s = spark.size
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(spark.x, spark.y)
      ctx.rotate(spark.rotation)
      ctx.fillStyle = spark.color
      ctx.shadowColor = spark.color
      ctx.shadowBlur = 6
      ctx.beginPath()
      ctx.moveTo(0, -s)
      ctx.quadraticCurveTo(s * 0.18, -s * 0.18, s, 0)
      ctx.quadraticCurveTo(s * 0.18, s * 0.18, 0, s)
      ctx.quadraticCurveTo(-s * 0.18, s * 0.18, -s, 0)
      ctx.quadraticCurveTo(-s * 0.18, -s * 0.18, 0, -s)
      ctx.fill()
      ctx.restore()
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (let index = sparks.length - 1; index >= 0; index--) {
        const spark = sparks[index]
        spark.life += dt
        if (spark.life >= spark.maxLife) {
          sparks.splice(index, 1)
          continue
        }
        spark.x += spark.vx * dt
        spark.y += spark.vy * dt
        spark.vy += 14 * dt
        spark.rotation += dt * 0.8
        const progress = spark.life / spark.maxLife
        drawStar(spark, Math.sin(progress * Math.PI) * 0.9)
      }

      if (sparks.length) frame = requestAnimationFrame(tick)
      else running = false
    }

    const emit = (x: number, y: number) => {
      if (sparks.length >= MAX_SPARKS) sparks.shift()
      sparks.push({
        x: x + random(-6, 6),
        y: y + random(-6, 6),
        vx: random(-12, 12),
        vy: random(-18, 4),
        life: 0,
        maxLife: random(0.9, 1.5),
        size: random(2.5, 5),
        rotation: random(0, Math.PI),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
      if (!running) {
        running = true
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY)
      if (lastX >= 0 && distance < EMIT_EVERY_PX) return
      lastX = event.clientX
      lastY = event.clientY
      emit(event.clientX, event.clientY)
    }

    resize()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55]" />
}
