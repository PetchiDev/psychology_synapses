'use client'

import { useRef, useState, type MouseEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Mail, Menu, Phone } from 'lucide-react'
import { samePageHash, scrollToHash } from '@/lib/hash-scroll'
import { bookHref, mainNav, siteConfig } from '@/lib/site'
import { gsap, ScrollTrigger, useGSAP } from '@/components/animations/gsap'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SiteLogo } from './site-logo'

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const bar = barRef.current
      if (!bar) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const duration = reduce ? 0 : 0.5
      const solid = () =>
        gsap.to(bar, {
          backgroundColor: 'rgba(243, 230, 200, 0.95)',
          borderColor: 'rgba(184, 137, 59, 0.5)',
          boxShadow: '0 14px 30px -20px rgba(36, 21, 13, 0.7)',
          paddingTop: 10,
          paddingBottom: 10,
          duration,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      const clear = () =>
        gsap.to(bar, {
          backgroundColor: 'rgba(243, 230, 200, 0.86)',
          borderColor: 'rgba(184, 137, 59, 0.35)',
          boxShadow: '0 10px 30px -22px rgba(36, 21, 13, 0.6)',
          paddingTop: 18,
          paddingBottom: 18,
          duration,
          ease: 'power3.out',
          overwrite: 'auto',
        })

      const trigger = ScrollTrigger.create({
        start: 48,
        end: 'max',
        onEnter: solid,
        onLeaveBack: clear,
      })
      if (window.scrollY > 48) solid()

      return () => trigger.kill()
    },
    { scope: headerRef },
  )

  const onMenuLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false)
    const hash = samePageHash(href)
    if (!hash) return
    event.preventDefault()
    window.setTimeout(() => scrollToHash(hash), 320)
  }

  const isActive = (href: string) => (href.includes('#') || href === '/' ? false : pathname.startsWith(href))

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-40 px-2 pt-2 sm:px-4 sm:pt-3">
      <div
        ref={barRef}
        className="mx-auto flex max-w-[84rem] items-center justify-between gap-2 rounded-full border border-gilt/35 bg-paper/85 px-3 py-[18px] sm:gap-4 shadow-[0_10px_30px_-22px_rgb(36_21_13/0.6)] backdrop-blur-md sm:px-6"
      >
        <SiteLogo />

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="group relative rounded-full px-2.5 py-2 text-[0.9rem] font-medium whitespace-nowrap text-shadow/85 transition-colors hover:text-burgundy aria-[current=page]:text-burgundy xl:px-3 xl:text-[0.92rem]"
                >
                  {item.shortLabel ? (
                    <>
                      <span className="xl:hidden">{item.shortLabel}</span>
                      <span className="hidden xl:inline">{item.label}</span>
                    </>
                  ) : (
                    item.label
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2.5 bottom-1 h-px origin-left scale-x-0 bg-burgundy transition-transform duration-500 ease-(--ease-paper) group-hover:scale-x-100 group-aria-[current=page]:scale-x-100 xl:inset-x-3"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href={bookHref}>
                  Book Me
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-56 text-center">
              Choose what you’d like to discuss, then select a time that works for you.
            </TooltipContent>
          </Tooltip>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader className="px-6 pt-6">
                <SheetTitle className="font-serif text-2xl font-normal">Menu</SheetTitle>
                <SheetDescription className="text-coffee">Find your way around, or get in touch when you’re ready.</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="px-6">
                <ul className="grid">
                  {mainNav.map((item, index) => (
                    <li key={item.href} className="border-b border-coffee/15">
                      <Link
                        href={item.href}
                        onClick={(event) => onMenuLink(event, item.href)}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className="flex items-baseline gap-4 py-4 font-serif text-2xl text-shadow transition-colors hover:text-burgundy aria-[current=page]:text-burgundy"
                      >
                        <span className="font-sans text-xs text-coffee tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto grid gap-4 px-6 pb-8">
                <div className="grid gap-2">
                  <Button asChild size="lg">
                    <Link href={bookHref} onClick={(event) => onMenuLink(event, bookHref)}>
                      Book Me
                    </Link>
                  </Button>
                  <p className="text-center text-sm text-coffee">Choose what you’d like to discuss, then select a time that works for you.</p>
                </div>
                <Button asChild variant="outline" size="lg">
                  <a href={`mailto:${siteConfig.email}`}>
                    <Mail aria-hidden="true" />
                    Email me
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={siteConfig.phoneHref}>
                    <Phone aria-hidden="true" />
                    Call {siteConfig.phone}
                  </a>
                </Button>
                <Separator className="bg-coffee/15" />
                <p className="text-sm text-coffee">
                  {siteConfig.hoursLabel} · {siteConfig.mode}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
