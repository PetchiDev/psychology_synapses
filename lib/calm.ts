import { useSyncExternalStore } from 'react'

let open = false
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((listener) => listener())

export const setCalmOpen = (value: boolean) => {
  open = value
  emit()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useCalmOpen = () => useSyncExternalStore(subscribe, () => open, () => false)
