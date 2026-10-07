import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'ambient-motion'

type Listener = (paused: boolean) => void

let paused: boolean | null = null
const listeners = new Set<Listener>()

const read = () => {
  if (paused === null) {
    try {
      paused = window.localStorage.getItem(STORAGE_KEY) === 'paused'
    } catch {
      paused = false
    }
  }
  return paused
}

export const isAmbientPaused = () => (typeof window === 'undefined' ? false : read())

export function setAmbientPaused(value: boolean) {
  paused = value
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? 'paused' : 'playing')
  } catch {}
  document.documentElement.dataset.ambient = value ? 'paused' : 'playing'
  listeners.forEach((listener) => listener(value))
}

export function subscribeAmbient(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useAmbientPaused() {
  return useSyncExternalStore(
    (onChange) => subscribeAmbient(onChange),
    isAmbientPaused,
    () => false,
  )
}

interface Controllable {
  pause: () => unknown
  resume: () => unknown
}

export function controlAmbient(animations: Controllable[], target?: Element | null) {
  let visible = true
  const sync = () => {
    const run = visible && !isAmbientPaused()
    animations.forEach((animation) => (run ? animation.resume() : animation.pause()))
  }

  const unsubscribe = subscribeAmbient(sync)
  let observer: IntersectionObserver | undefined
  if (target) {
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(target)
  }
  sync()

  return () => {
    unsubscribe()
    observer?.disconnect()
  }
}
