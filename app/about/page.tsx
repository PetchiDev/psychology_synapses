import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Award, BadgeCheck, GraduationCap } from 'lucide-react'
import { psychologist } from '@/data/content'
import { bookHref, siteConfig } from '@/lib/site'
import { pageMetadata } from '@/lib/seo/metadata'
import { MotionController } from '@/components/animations/motion-controller'
import { ScrollPaper } from '@/components/paper/scroll-paper'
import { FinalCta } from '@/components/sections/final-cta'
import { PageHero } from '@/components/sections/page-hero'
import { Portrait } from '@/components/sections/psychologist'
import { SectionHeading } from '@/components/sections/section-heading'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = pageMetadata({
  title: 'About Me',
  description: 'The story, qualifications, research and credentials of the psychologist behind Paper Skin & Synapses.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <PageHero
        id="about-page-title"
        eyebrow="About me"
        crumb="About Me"
        title={
          <>
            About the <em className="text-burgundy italic">psychologist</em>
          </>
        }
        aside={<Portrait priority />}
      >
        {psychologist.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </PageHero>

      <section aria-labelledby="credentials-title" className="relative bg-paper-deep/50 py-20 lg:py-28">
        <div className="container-editorial">
          <SectionHeading id="credentials-title" eyebrow="Qualifications & experience" title="The path so *far*" />

          <ol data-reveal-group className="mt-12 grid gap-5 md:grid-cols-3">
            {psychologist.degrees.map((degree, index) => (
              <li key={degree.award} data-reveal-item className="surface-card relative rounded-[0.8rem] border border-coffee/12 p-7">
                <span aria-hidden="true" className="font-serif text-4xl text-coffee/25">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <GraduationCap className="absolute top-7 right-7 size-5 text-burgundy" aria-hidden="true" />
                <p className="mt-4 font-serif text-[1.45rem] leading-snug font-semibold text-shadow">{degree.award}</p>
                <p className="mt-2 text-[0.95rem] text-coffee">{degree.place}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-10">
            {psychologist.sections.map((section) => {
              const Icon = section.icon
              return (
                <article key={section.id} data-reveal className="grid content-start gap-4">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-burgundy text-paper">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="type-h3">{section.title}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)} className="text-[1rem] leading-[1.8] text-shadow/80">
                      {paragraph}
                    </p>
                  ))}
                  {section.id === 'research' ? (
                    <p className="inline-flex w-fit items-center gap-2 rounded-full bg-gold/25 px-4 py-1.5 text-sm font-semibold text-coffee-deep">
                      <Award className="size-4 text-burgundy" aria-hidden="true" />
                      Best Paper Awards
                    </p>
                  ) : null}
                </article>
              )
            })}
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2">
            <div data-reveal className="surface-card rounded-[0.8rem] border border-coffee/12 p-7 sm:p-9">
              <h2 className="type-h3">Training & certifications</h2>
              <p className="mt-2 text-[0.98rem] text-shadow/75">Additional training in therapeutic approaches.</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {psychologist.training.map((item) => (
                  <li key={item} className="rounded-full border border-burgundy/25 bg-burgundy/5 px-4 py-2 text-[0.92rem] font-medium text-burgundy">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="surface-card rounded-[0.8rem] border border-coffee/12 p-7 sm:p-9">
              <h2 className="type-h3">Registration & professional credentials</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {psychologist.registrations.map((item) => (
                  <li key={item.region} className="flex items-start gap-3 rounded-[0.6rem] bg-paper/60 p-4">
                    <BadgeCheck className="mt-0.5 size-5 shrink-0 text-burgundy" aria-hidden="true" />
                    <span>
                      <span className="type-eyebrow block text-[0.62rem] text-coffee">{item.region}</span>
                      <span className="mt-1 block font-serif text-xl font-semibold text-shadow">{item.credential}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="story" aria-labelledby="story-title" className="relative scroll-mt-24 py-20 lg:py-28">
        <div className="container-editorial grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading id="story-title" eyebrow="My story" title="From a school subject to a *purpose*" />
              <div data-reveal className="mt-8">
                <Button asChild size="lg">
                  <Link href={bookHref}>
                    Let’s Talk
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div data-reveal className="lg:col-span-8">
            <ScrollPaper tilt={-0.6} seed={21} contentClassName="grid gap-5 px-[11%] py-14 text-[1.06rem] leading-[1.85] text-shadow/90 sm:py-16">
              {psychologist.story.map((paragraph, index) => (
                <p key={paragraph.slice(0, 24)} className={index === 0 ? 'drop-cap' : undefined}>
                  {paragraph}
                </p>
              ))}
              <p className="type-hand mt-2 text-right text-2xl text-burgundy">{siteConfig.name}</p>
            </ScrollPaper>
          </div>
        </div>
      </section>

      <FinalCta />
      <MotionController />
    </>
  )
}
