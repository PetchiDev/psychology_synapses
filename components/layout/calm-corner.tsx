'use client'

import Link from 'next/link'
import { Flower2 } from 'lucide-react'
import { setCalmOpen, useCalmOpen } from '@/lib/calm'
import { bookHref } from '@/lib/site'
import { BreathingOrb } from '@/components/animations/breathing-orb'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function CalmCorner() {
  const open = useCalmOpen()

  return (
    <Dialog open={open} onOpenChange={setCalmOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="calm-glow group fixed right-4 bottom-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-paper/90 p-2 text-sm font-semibold text-burgundy shadow-lifted ring-1 ring-lavender/70 backdrop-blur-md transition-[transform,background-color] duration-500 hover:-translate-y-0.5 hover:bg-paper active:scale-[0.98] sm:right-6 sm:bottom-6 sm:py-2 sm:pr-5 sm:pl-3"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fbf3e6_0%,var(--peach)_45%,var(--lavender)_100%)] text-burgundy transition-transform duration-700 group-hover:rotate-45">
            <Flower2 className="size-4" aria-hidden="true" />
          </span>
          <span className="sr-only sm:not-sr-only">Take a Breath</span>
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden border-paper/15 bg-dusk bg-[linear-gradient(160deg,#2a2238_0%,#3a2a3d_50%,#45262c_100%)] text-paper sm:max-w-md [&>[data-slot=dialog-close]]:border-paper/25 [&>[data-slot=dialog-close]]:text-paper [&>[data-slot=dialog-close]]:hover:bg-paper [&>[data-slot=dialog-close]]:hover:text-shadow">
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 -left-16 size-56 rounded-full bg-lavender/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -bottom-24 size-64 rounded-full bg-peach/15 blur-3xl" />
        <DialogHeader className="relative">
          <DialogTitle className="text-paper">A moment to pause</DialogTitle>
          <DialogDescription className="text-paper/80">Take a minute for yourself. There’s nothing else you need to do right now.</DialogDescription>
        </DialogHeader>

        <BreathingOrb className="relative py-2" />

        <div className="relative grid gap-3">
          <DialogClose asChild>
            <Button type="button" variant="paper" size="lg">
              I feel a little calmer
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Link href={bookHref} className="text-center text-sm text-paper/80 underline underline-offset-4 hover:text-paper">
              Would you like to talk something through? Get in touch
            </Link>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
