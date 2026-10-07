'use client'

import { gsap, ScrollTrigger, useGSAP } from './gsap'

const toArray = (selector: string) => gsap.utils.toArray<HTMLElement>(selector)

const SHADOW_REST = '0px 1px 0px 0px rgba(43,30,26,0.04), 0px 12px 30px -18px rgba(43,30,26,0.35)'
const SHADOW_LIFT = '0px 2px 0px 0px rgba(43,30,26,0.05), 0px 26px 50px -28px rgba(43,30,26,0.45)'

function bindHover(el: HTMLElement) {
  const media = el.querySelector<HTMLElement>('[data-hover-media]')
  const tilt = Number(el.dataset.hoverTilt ?? 0)
  const enter = () => {
    gsap.to(el, { y: -8, rotate: tilt, boxShadow: SHADOW_LIFT, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    if (media) gsap.to(media, { scale: 1.05, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
  }
  const leave = () => {
    gsap.to(el, { y: 0, rotate: 0, boxShadow: SHADOW_REST, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
    if (media) gsap.to(media, { scale: 1, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
  }
  el.addEventListener('pointerenter', enter)
  el.addEventListener('pointerleave', leave)
  el.addEventListener('focusin', enter)
  el.addEventListener('focusout', leave)
  return () => {
    el.removeEventListener('pointerenter', enter)
    el.removeEventListener('pointerleave', leave)
    el.removeEventListener('focusin', enter)
    el.removeEventListener('focusout', leave)
  }
}

export function MotionController() {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 44,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      toArray('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]')
        if (!items.length) return
        gsap.from(items, {
          autoAlpha: 0,
          y: 48,
          rotate: (index: number) => (index % 2 === 0 ? -1.2 : 1.2),
          duration: 1,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: 'top 82%', once: true },
        })
      })

      toArray('[data-reveal-image]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(18% 10% 18% 10% round 2rem)', scale: 1.06 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0rem)',
            scale: 1,
            duration: 1.4,
            ease: 'power4.out',
            clearProps: 'clipPath',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          },
        )
      })

      toArray('[data-parallax]').forEach((el) => {
        const speed = Number(el.dataset.parallax ?? 0.12)
        gsap.to(el, {
          yPercent: speed * -100,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })

      toArray('[data-timeline]').forEach((timeline) => {
        const line = timeline.querySelector<HTMLElement>('[data-timeline-line]')
        if (!line) return
        gsap.fromTo(
          line,
          { '--progress': 0 },
          {
            '--progress': 1,
            ease: 'none',
            scrollTrigger: { trigger: timeline, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
          },
        )
      })

      const unbind = toArray('[data-hover-lift]').map(bindHover)
      return () => unbind.forEach((fn) => fn())
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      toArray('[data-timeline-line]').forEach((line) => line.style.setProperty('--progress', '1'))
    })

    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)

    return () => mm.revert()
  })

  return null
}
