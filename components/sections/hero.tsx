import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { SynapseField } from '@/components/animations/synapse-field'
import { ScrollPaper } from '@/components/paper/scroll-paper'
import { Button } from '@/components/ui/button'

const stagger = (index: number) => ({ '--i': index }) as CSSProperties
const line = (index: number) => ({ '--l': index }) as CSSProperties

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:flex lg:min-h-svh lg:items-center lg:pt-36 lg:pb-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgb(226_174_134/0.28),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgb(122_35_38/0.1),transparent_50%)]" />
        <SynapseField className="absolute inset-0 opacity-80 [mask-image:linear-gradient(90deg,transparent_0%,#000_45%,#000_100%)] max-lg:[mask-image:linear-gradient(180deg,transparent_10%,#000_70%)]" />
      </div>

      <div className="container-editorial grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p data-hero-item style={stagger(0)} className="type-eyebrow flex items-center gap-3 text-burgundy">
            <span aria-hidden="true" className="pulse-dot size-2 rounded-full bg-burgundy" />
            {siteConfig.name}
          </p>
          <ul
            data-hero-item
            style={stagger(1)}
            aria-label="Areas of work"
            className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-[0.82rem] font-medium text-coffee sm:text-[0.9rem]"
          >
            {siteConfig.disciplines.map((item, index) => (
              <li key={item} className="flex items-center gap-3">
                {index > 0 ? <span aria-hidden="true" className="size-1 rounded-full bg-gilt" /> : null}
                {item}
              </li>
            ))}
          </ul>

          <h1 id="hero-title" className="type-display mt-6 max-w-[13ch] text-shadow sm:mt-7">
            <span data-line style={line(0)}>
              Every mind has
            </span>
            <span data-line style={line(1)}>
              <em className="text-burgundy italic">more than one</em> story
            </span>
          </h1>

          <div data-hero-item style={stagger(4)} className="mt-9 grid gap-3 sm:flex sm:items-center">
            <Button asChild size="lg">
              <Link href="#book">
                Let’s Talk
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#work">
                Explore my work
                <ArrowDown aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div data-hero-item style={stagger(3)} className="lg:col-span-5">
          <div data-parallax="0.06">
            <ScrollPaper float tilt={1.4} seed={7} contentClassName="px-[12%] py-12 sm:py-14">
              <p className="drop-cap text-[1.05rem] leading-[1.75] text-shadow/90">
                Psychology extends far beyond any one setting. At {siteConfig.name}, this spans clinical practice, individual counselling,
                organisational consulting, psychoeducation, workshops, and research collaborations.
              </p>
              <p className="mt-4 text-[1.05rem] leading-[1.75] text-shadow/90">
                {siteConfig.name} brings these interests together, along with a library of reading and resources for readers who want to learn
                more about psychology and its place in everyday life in their own time.
              </p>
            </ScrollPaper>
          </div>
        </div>
      </div>
    </section>
  )
}
