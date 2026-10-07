import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { heroHighlights } from '@/data/content'
import { siteConfig } from '@/lib/site'
import { HeroVisual } from '@/components/animations/hero-visual'
import { Button } from '@/components/ui/button'

const stagger = (index: number) => ({ '--i': index }) as CSSProperties

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 size-[34rem] rounded-full bg-latte/45 blur-3xl"
        data-parallax="0.2"
      />
      <div className="container-editorial relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p data-hero-item style={stagger(0)} className="type-eyebrow flex items-start gap-3 leading-snug text-coffee">
            <span className="mt-[0.2rem] inline-block size-2 shrink-0 rounded-full bg-burgundy" aria-hidden="true" />
            Psychology &amp; Mental Health Hospital · {siteConfig.address.locality}
          </p>

          <h1 id="hero-title" className="type-display mt-6 max-w-[14ch]">
            <span data-hero-item style={stagger(1)} className="block">A quieter mind</span>
            <span data-hero-item style={stagger(2)} className="block">
              begins with being <em className="underline-hand font-serif text-burgundy italic">heard.</em>
            </span>
          </h1>

          <p data-hero-item style={stagger(3)} className="type-lead mt-7 max-w-xl text-shadow/80">
            {siteConfig.name} offers confidential, evidence-based psychological care for anxiety, stress, low mood, relationships,
            trauma and more — for adults, children, couples and families. Unhurried conversations with experienced psychologists,
            in person or online.
          </p>

          <div data-hero-item style={stagger(4)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="#book">
                Book an Appointment
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#services">
                Explore Our Services
                <ArrowDown aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <dl data-hero-item style={stagger(5)} className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-coffee/20 pt-6">
            {heroHighlights.map((item) => (
              <div key={item.label} className="grid gap-1">
                <dt className="order-2 text-xs font-medium tracking-wide text-coffee uppercase">{item.label}</dt>
                <dd className="order-1 font-serif text-3xl text-shadow sm:text-4xl">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] lg:col-span-5 lg:max-w-none">
          <div aria-hidden="true" data-parallax="0.08" className="latte-surface organic-edge absolute inset-x-6 top-6 bottom-0 rotate-3" />
          <div data-hero-item style={stagger(6)} className="paper-surface organic-edge-alt relative -rotate-1 overflow-hidden p-4 sm:p-6">
            <HeroVisual />
          </div>
          <div
            data-hero-item
            style={stagger(7)}
            className="paper-surface absolute -bottom-8 -left-2 max-w-[15rem] rotate-[-4deg] rounded-xl p-4 sm:-left-8 sm:p-5"
          >
            <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-2 bg-latte/80" />
            <p className="type-hand text-[1.45rem] text-burgundy">You don’t have to have it all figured out.</p>
            <p className="mt-2 text-xs text-coffee">— a note from our team</p>
          </div>
        </div>
      </div>
    </section>
  )
}
