'use client'

import { Flower2 } from 'lucide-react'
import { setCalmOpen } from '@/lib/calm'

export function TakeBreathButton() {
  return (
    <button
      type="button"
      onClick={() => setCalmOpen(true)}
      className="group inline-flex w-fit cursor-pointer items-center gap-3 rounded-full border border-gold/40 py-1.5 pr-5 pl-1.5 text-sm font-semibold text-paper transition-[background-color,border-color] duration-500 hover:border-gold hover:bg-paper/5"
    >
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fbf3e6_0%,var(--peach)_45%,var(--lavender)_100%)] text-burgundy transition-transform duration-700 group-hover:rotate-45">
        <Flower2 className="size-4" aria-hidden="true" />
      </span>
      Take a Breath
    </button>
  )
}
