import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { workAreas } from '@/data/content'
import { cn } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo/metadata'
import { MotionController } from '@/components/animations/motion-controller'
import { FinalCta } from '@/components/sections/final-cta'
import { PageHero } from '@/components/sections/page-hero'
import { Process } from '@/components/sections/process'
import { LibraryGateway } from '@/components/sections/ways-to-work'
import { WorkWaysAside } from '@/components/sections/work-ways-aside'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = pageMetadata({
  title: 'Work With Me',
  description:
    'Individual counselling, programmes for organisations, schools and colleges, psychoeducation talks and workshops, and research collaborations.',
  path: '/work-with-me',
})

export default function WorkWithMePage() {
  return (
    <>
      <PageHero
        id="work-page-title"
        eyebrow="Work with me"
        crumb="Work With Me"
        title={
          <>
            Ways to work <em className="text-burgundy italic">with me</em>
          </>
        }
        aside={<WorkWaysAside />}
      >
        <p>
          Psychology can be useful in many different settings. You might be looking for individual support, planning something for a school or
          workplace, organising a talk, or exploring a research project together.
        </p>
        <p>
          Choose the area that fits what you have in mind. If you are unsure where your enquiry belongs, you can{' '}
          <Link href="/contact?enquiry=other#book" className="font-semibold text-burgundy underline underline-offset-4">
            get in touch
          </Link>{' '}
          and explain what you need.
        </p>
      </PageHero>

      <nav aria-label="Areas of work" className="sticky top-[5.25rem] z-30 border-y border-coffee/12 bg-paper/90 backdrop-blur-md">
        <ul className="container-editorial flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
          {workAreas.map((area) => (
            <li key={area.slug} className="shrink-0">
              <Link
                href={`#${area.slug}`}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.88rem] font-medium whitespace-nowrap text-shadow/80 transition-colors hover:bg-burgundy/8 hover:text-burgundy"
              >
                <span className="font-serif text-base text-burgundy">{area.number}</span>
                {area.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-editorial grid gap-24 py-20 lg:gap-32 lg:py-28">
        {workAreas.map((area, index) => {
          const Icon = area.icon
          const flip = index % 2 === 1
          return (
            <section key={area.slug} id={area.slug} aria-labelledby={`${area.slug}-title`} className="grid scroll-mt-40 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
              <div data-reveal className={cn('relative lg:col-span-6', flip && 'lg:order-2')}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] shadow-lifted">
                  <Image src={area.image.src} alt={area.image.alt} fill sizes="(min-width: 1024px) 40rem, 100vw" className="object-cover" />
                </div>
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute -bottom-6 inline-flex size-20 items-center justify-center rounded-full bg-burgundy font-serif text-3xl text-paper shadow-lifted ring-8 ring-paper',
                    flip ? '-left-2 sm:-left-6' : '-right-2 sm:-right-6',
                  )}
                >
                  {area.number}
                </span>
              </div>

              <div className={cn('grid content-start gap-6 lg:col-span-6', flip && 'lg:order-1')}>
                <p data-reveal className="type-eyebrow flex items-center gap-3 text-burgundy">
                  <Icon className="size-4" aria-hidden="true" />
                  {area.number} · Area of work
                </p>
                <h2 id={`${area.slug}-title`} data-reveal className="type-h2">
                  {area.title}
                </h2>
                <p data-reveal className="type-lead text-shadow/80">
                  {area.detail.intro}
                </p>
                <div data-reveal className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="type-eyebrow text-coffee">What it can involve</h3>
                    <ul className="mt-3 grid gap-2.5">
                      {area.detail.involves.map((item) => (
                        <li key={item} className="flex gap-3 text-[0.97rem] leading-relaxed text-shadow/85">
                          <Check className="mt-1 size-4 shrink-0 text-burgundy" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid content-start gap-5">
                    <div>
                      <h3 className="type-eyebrow text-coffee">Who it may suit</h3>
                      <p className="mt-3 text-[0.97rem] leading-relaxed text-shadow/85">{area.detail.suits}</p>
                    </div>
                    <div>
                      <h3 className="type-eyebrow text-coffee">How to enquire</h3>
                      <p className="mt-3 text-[0.97rem] leading-relaxed text-shadow/85">{area.detail.enquire}</p>
                    </div>
                  </div>
                </div>
                <div data-reveal>
                  <Button asChild size="lg" className="h-auto min-h-12 py-3 text-center whitespace-normal">
                    <Link href={`/contact?enquiry=${area.enquiry}#book`}>
                      {area.cta}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          )
        })}

        <LibraryGateway />
      </div>

      <Process />
      <FinalCta />
      <MotionController />
    </>
  )
}
