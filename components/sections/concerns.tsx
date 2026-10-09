import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { concerns } from '@/data/content'
import { WaveDivider } from '@/components/animations/wave-divider'
import { SectionHeading } from './section-heading'

export function Concerns() {
  return (
    <section id="concerns" aria-labelledby="concerns-title" className="relative py-14 lg:py-20">
      <div aria-hidden="true" className="absolute inset-0 -z-10 flex flex-col text-[#e6d1a7]">
        <WaveDivider variant="cloud" />
        <div className="-mt-px flex-1 bg-[#e6d1a7] bg-(image:--fibres)" />
        <WaveDivider variant="wave" flip className="-mt-px" />
      </div>
      <div className="container-editorial pt-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="concerns-title"
            index="02"
            eyebrow="Psychological concerns"
            title="Psychological Support for Different Life *Challenges*"
            className="lg:col-span-7"
          />
          <p data-reveal className="text-[1.02rem] leading-relaxed text-shadow/85 lg:col-span-5 lg:col-start-8">
            These are some of the areas where our psychologists may be able to offer support. Everyone’s experience is different — your
            first consultation helps us understand what kind of help would suit you.
          </p>
        </div>

        <ul data-reveal-group className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Areas of psychological support">
          {concerns.map((concern, index) => {
            const Icon = concern.icon
            const number = String(index + 1).padStart(2, '0')

            if (index === 0) {
              return (
                <li key={concern.slug} data-reveal-item className="sm:col-span-2 lg:col-span-1 xl:col-span-2 xl:row-span-2">
                  <article
                    data-hover-lift
                    className="group leather-surface relative flex h-full flex-col gap-4 overflow-hidden rounded-[0.5rem] p-7 xl:p-9"
                  >
                    <Icon
                      aria-hidden="true"
                      strokeWidth={0.9}
                      className="pointer-events-none absolute -top-6 -right-6 size-56 text-paper/10 transition-transform duration-700 ease-(--ease-paper) group-hover:-rotate-6 xl:size-72"
                    />
                    <div className="relative flex items-center justify-between">
                      <span className="inline-flex size-14 items-center justify-center rounded-full bg-paper text-burgundy ring-2 ring-gold/50 ring-offset-2 ring-offset-burgundy">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <span aria-hidden="true" className="font-serif text-sm text-latte tabular-nums">
                        {number}
                      </span>
                    </div>
                    <div className="relative mt-auto grid gap-4 pt-10">
                      <p aria-hidden="true" className="type-hand text-2xl text-gold">the most common reason people reach out</p>
                      <h3 className="font-serif text-[2.2rem] leading-none text-paper xl:text-[3.2rem]">{concern.title}</h3>
                      <p className="max-w-md text-[1.02rem] leading-relaxed text-paper/85 xl:text-lg">{concern.summary}</p>
                      <p className="max-w-md border-t border-paper/20 pt-4 text-[0.95rem] leading-relaxed text-paper/75">{concern.detail}</p>
                      <Link
                        href="#book"
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-burgundy transition-colors hover:bg-white"
                      >
                        Ask about {concern.title.toLowerCase()} support
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </li>
              )
            }

            return (
              <li key={concern.slug} data-reveal-item>
                <article
                  data-hover-lift
                  className="group catalogue-card relative flex h-full min-h-[15.5rem] flex-col overflow-hidden rounded-[0.35rem] border border-gilt/35 p-6 pb-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex size-12 items-center justify-center rounded-full border border-gilt/40 bg-paper text-burgundy transition-colors duration-500 group-hover:bg-burgundy group-hover:text-paper">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span aria-hidden="true" className="font-ui text-[0.65rem] tracking-[0.2em] text-burgundy">
                      Nº {number}
                    </span>
                  </div>
                  <h3 className="mt-7 font-serif text-[1.45rem] leading-tight">{concern.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-shadow/80">{concern.summary}</p>
                  <p aria-hidden="true" className="hover-hint mt-auto items-center gap-1.5 pt-4 text-xs font-semibold tracking-wide text-coffee uppercase">
                    Hover to learn more
                  </p>

                  <div className="hover-panel hover-panel-dark mt-4 grid content-end gap-3 border-t border-dashed border-coffee/30 pt-4 hover-panel-cover">
                    <div aria-hidden="true" className="hover-panel-only">
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-paper/10 text-latte">
                        <Icon className="size-5" />
                      </span>
                      <p className="mt-4 font-serif text-[1.3rem] leading-tight text-paper">{concern.title}</p>
                    </div>
                    <p className="text-[0.92rem] leading-relaxed text-(--panel-fg)">{concern.detail}</p>
                    <Link
                      href="#book"
                      className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-(--panel-accent) underline-offset-4 hover:underline"
                    >
                      Ask about {concern.title.toLowerCase()} support
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
          <li data-reveal-item className="xl:col-span-3">
            <div className="ink-surface relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[0.5rem] p-7 sm:flex-row sm:items-end xl:p-9">
              <div className="grid gap-3">
                <p aria-hidden="true" className="type-hand text-2xl text-gold">not sure where you fit?</p>
                <h3 className="font-serif text-[1.6rem] leading-tight text-paper xl:text-[2rem]">That’s completely okay.</h3>
                <p className="max-w-lg text-[0.95rem] leading-relaxed text-paper/80">
                  You don’t need a label to reach out. Tell us what’s been happening in your own words, and we’ll help you find the right
                  support.
                </p>
              </div>
              <Link
                href="#book"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-burgundy transition-colors hover:bg-white"
              >
                Talk to a psychologist
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </li>
        </ul>

        <p data-reveal className="mt-10 max-w-3xl text-sm leading-relaxed text-coffee-deep">
          Our psychologists provide psychological assessment and therapy. Where medical evaluation or medication may help, we will
          discuss referral options with you openly.
        </p>
      </div>
    </section>
  )
}
