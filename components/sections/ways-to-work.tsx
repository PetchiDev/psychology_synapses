import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { libraryCard, workAreas } from '@/data/content'
import { WorkBook } from '@/components/library/work-book'
import { Button } from '@/components/ui/button'
import { SectionHeading } from './section-heading'

export function WaysToWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative pt-20 pb-12 lg:pt-28">
      <div className="container-editorial grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start lg:pt-6">
          <SectionHeading
            id="work-title"
            eyebrow="Work with me"
            title="Ways to work *with* *me*"
            description={
              <>
                <p className="text-[1.02rem]">
                  Psychology can be useful in many different settings. You might be looking for individual support, planning something for a
                  school or workplace, organising a talk, or exploring a research project together.
                </p>
                <p className="text-[1.02rem]">
                  Choose the area that fits what you have in mind. If you are unsure where your enquiry belongs, you can{' '}
                  <Link href="#book" className="font-semibold text-burgundy underline decoration-burgundy/30 underline-offset-4 hover:decoration-burgundy">
                    get in touch
                  </Link>{' '}
                  and explain what you need.
                </p>
              </>
            }
          />
          <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button asChild size="lg">
              <Link href="#book">
                Let’s Talk
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/work-with-me">All the details</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ol className="sr-only" aria-label="Ways to work with me">
            {workAreas.map((area) => (
              <li key={area.slug}>
                <h3>{area.title}</h3>
                <p>{area.summary}</p>
                <Link href={`/work-with-me#${area.slug}`}>{area.cta}</Link>
              </li>
            ))}
          </ol>
          <WorkBook />
        </div>
      </div>

      <div className="container-editorial">
        <LibraryGateway />
      </div>
    </section>
  )
}

export function LibraryGateway() {
  return (
    <article data-reveal className="group relative isolate mt-6 overflow-hidden rounded-[0.85rem] bg-mahogany text-paper">
      <div data-parallax="0.1" className="absolute inset-[-8%] -z-20">
        <Image
          src={libraryCard.image.src}
          alt={libraryCard.image.alt}
          fill
          sizes="(min-width: 1024px) 80rem, 100vw"
          className="object-cover object-[70%_center] transition-transform duration-[2.4s] ease-(--ease-paper) group-hover:scale-[1.04]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(20_10_5/0.94)_0%,rgb(20_10_5/0.78)_45%,rgb(20_10_5/0.15)_100%)] max-md:bg-[linear-gradient(180deg,rgb(20_10_5/0.55)_0%,rgb(20_10_5/0.92)_70%)]" />
      <div className="grid gap-5 px-7 pt-40 pb-10 sm:px-12 md:max-w-xl md:py-16 lg:py-20">
        <p className="type-eyebrow flex items-center gap-2 text-gold">
          <Sparkles className="size-3.5" aria-hidden="true" />
          05 · A separate destination
        </p>
        <h3 className="type-h2 text-paper">{libraryCard.title}</h3>
        <p className="text-[1.04rem] leading-relaxed text-paper/80">{libraryCard.summary}</p>
        <div>
          <Button asChild size="lg" variant="paper">
            <Link href="/library">
              {libraryCard.cta}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
