'use client'

import { gsap, ScrollTrigger, useGSAP } from './gsap'

const toArray = (selector: string) => gsap.utils.toArray<HTMLElement>(selector)

const SHADOW_REST = '0px 1px 0px 0px rgba(43,30,26,0.04), 0px 12px 30px -18px rgba(43,30,26,0.35), 0px 0px 0px 0px rgba(243,201,168,0)'
const SHADOW_LIFT = '0px 2px 0px 0px rgba(43,30,26,0.04), 0px 24px 44px -26px rgba(43,30,26,0.4), 0px 0px 36px 2px rgba(243,201,168,0.45)'

const REVEAL_FROM = { autoAlpha: 0, y: 40, filter: 'blur(8px)' }
const REVEAL_TO = { autoAlpha: 1, y: 0, filter: 'blur(0px)', clearProps: 'filter' }

function bindHover(el: HTMLElement) {
  const media = el.querySelector<HTMLElement>('[data-hover-media]')
  const enter = () => {
    gsap.to(el, { y: -5, boxShadow: SHADOW_LIFT, duration: 0.9, ease: 'power2.out', overwrite: 'auto' })
    if (media) gsap.to(media, { scale: 1.03, duration: 1.4, ease: 'power2.out', overwrite: 'auto' })
  }
  const leave = () => {
    gsap.to(el, { y: 0, boxShadow: SHADOW_REST, duration: 1.1, ease: 'power2.out', overwrite: 'auto' })
    if (media) gsap.to(media, { scale: 1, duration: 1.4, ease: 'power2.out', overwrite: 'auto' })
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
        gsap.fromTo(el, REVEAL_FROM, {
          ...REVEAL_TO,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        })
      })

      toArray('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]')
        if (!items.length) return
        gsap.fromTo(items, REVEAL_FROM, {
          ...REVEAL_TO,
          duration: 1.3,
          ease: 'power2.out',
          stagger: 0.13,
          scrollTrigger: { trigger: group, start: 'top 80%', once: true },
        })
      })

      toArray('[data-parallax]').forEach((el) => {
        const speed = Number(el.dataset.parallax ?? 0.12)
        gsap.to(el, {
          yPercent: speed * -100,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
        })
      })

      toArray('[data-parallax-x]').forEach((el) => {
        const drift = Number(el.dataset.parallaxX ?? 0.06)
        gsap.fromTo(
          el,
          { xPercent: -drift * 50 },
          {
            xPercent: drift * 50,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          },
        )
      })

      const unbind = toArray('[data-hover-lift]').map(bindHover)
      return () => unbind.forEach((fn) => fn())
    })

    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)

    return () => mm.revert()
  })

  return null
}
