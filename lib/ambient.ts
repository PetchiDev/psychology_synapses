interface Controllable {
  pause: () => unknown
  resume: () => unknown
}

export function controlAmbient(animations: Controllable[], target?: Element | null) {
  if (!target) return () => {}

  const observer = new IntersectionObserver(([entry]) => {
    animations.forEach((animation) => (entry.isIntersecting ? animation.resume() : animation.pause()))
  })
  observer.observe(target)

  return () => observer.disconnect()
}
