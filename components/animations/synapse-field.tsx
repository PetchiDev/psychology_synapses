'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

interface Pulse {
  from: number
  to: number
  t: number
  speed: number
}

const PALETTE = {
  dark: { line: '110, 78, 51', node: '122, 35, 38', pulse: '184, 137, 59' },
  light: { line: '226, 194, 122', node: '243, 223, 160', pulse: '248, 217, 143' },
}

interface SynapseFieldProps {
  className?: string
  tone?: keyof typeof PALETTE
  density?: number
  reach?: number
}

/** A slow, drifting network of neurons with signals travelling along the links. */
export function SynapseField({ className, tone = 'dark', density = 1, reach = 150 }: SynapseFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const colors = PALETTE[tone]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = 0
    let height = 0
    let nodes: Node[] = []
    let pulses: Pulse[] = []
    let frame = 0
    let visible = false
    let last = performance.now()
    let spawn = 0
    const pointer = { x: -9999, y: -9999 }

    const seed = () => {
      const count = Math.round(Math.min(70, Math.max(18, (width * height) / 16000)) * density)
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.5) * 9,
        r: 1.2 + Math.random() * 1.8,
      }))
      pulses = []
    }

    const resize = () => {
      const box = canvas.getBoundingClientRect()
      width = box.width
      height = box.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      draw(0)
    }

    const linked = (a: Node, b: Node) => Math.hypot(a.x - b.x, a.y - b.y) < reach

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height)
      for (const node of nodes) {
        node.x += node.vx * dt
        node.y += node.vy * dt
        if (node.x < -20 || node.x > width + 20) node.vx *= -1
        if (node.y < -20 || node.y > height + 20) node.vy *= -1
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const distance = Math.hypot(a.x - b.x, a.y - b.y)
          if (distance > reach) continue
          const near = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - pointer.x, (a.y + b.y) / 2 - pointer.y) / 220)
          ctx.strokeStyle = `rgba(${colors.line}, ${(1 - distance / reach) * (0.22 + near * 0.4)})`
          ctx.lineWidth = 0.8 + near * 0.6
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      for (const node of nodes) {
        const near = Math.max(0, 1 - Math.hypot(node.x - pointer.x, node.y - pointer.y) / 180)
        ctx.fillStyle = `rgba(${colors.node}, ${0.35 + near * 0.55})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r + near * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let index = pulses.length - 1; index >= 0; index--) {
        const pulse = pulses[index]
        const a = nodes[pulse.from]
        const b = nodes[pulse.to]
        pulse.t += pulse.speed * dt
        if (!a || !b || pulse.t >= 1 || !linked(a, b)) {
          if (a && b && pulse.t >= 1 && Math.random() < 0.55) {
            const next = nodes.findIndex((n, k) => k !== pulse.from && k !== pulse.to && linked(b, n))
            if (next >= 0) pulses.push({ from: pulse.to, to: next, t: 0, speed: pulse.speed })
          }
          pulses.splice(index, 1)
          continue
        }
        const x = a.x + (b.x - a.x) * pulse.t
        const y = a.y + (b.y - a.y) * pulse.t
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 9)
        glow.addColorStop(0, `rgba(${colors.pulse}, 0.95)`)
        glow.addColorStop(1, `rgba(${colors.pulse}, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, 9, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const fire = () => {
      if (pulses.length > 10 || nodes.length < 2) return
      const from = Math.floor(Math.random() * nodes.length)
      const to = nodes.findIndex((n, k) => k !== from && linked(nodes[from], n))
      if (to >= 0) pulses.push({ from, to, t: 0, speed: 0.5 + Math.random() * 0.5 })
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      spawn += dt
      if (spawn > 0.7) {
        spawn = 0
        fire()
      }
      draw(dt)
      if (visible) frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (reduce || visible) return
      visible = true
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const stop = () => {
      visible = false
      cancelAnimationFrame(frame)
    }

    let inView = false
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView && !document.hidden) start()
      else stop()
    })
    const onVisibility = () => {
      if (document.hidden) stop()
      else if (inView) start()
    }
    const onMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect()
      pointer.x = event.clientX - box.left
      pointer.y = event.clientY - box.top
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    resize()
    observer.observe(canvas)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [tone, density, reach])

  return <canvas ref={canvasRef} aria-hidden="true" className={cn('pointer-events-none size-full', className)} />
}
