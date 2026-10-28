import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Award, BadgeCheck, GraduationCap } from 'lucide-react'
import { psychologist } from '@/data/content'
import { bookHref } from '@/lib/site'
import { pageMetadata } from '@/lib/seo/metadata'
import { MotionController } from '@/components/animations/motion-controller'
import { FinalCta } from '@/components/sections/final-cta'
import { PageHero } from '@/components/sections/page-hero'
import { Portrait } from '@/components/sections/psychologist'
import { SectionHeading } from '@/components/sections/section-heading'
import { StoryLeaves } from '@/components/sections/story-leaves'
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

      <section aria-labelledby="credentials-title" className="relative overflow-hidden bg-paper-deep/50 py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_10%_0%,rgb(122_35_38/0.08),transparent_45%),radial-gradient(ellipse_at_90%_100%,rgb(196_149_74/0.12),transparent_40%)]"
        />
        <div className="container-editorial">
          <SectionHeading id="credentials-title" eyebrow="Qualifications & experience" title="The path so *far*" />

          <ol data-reveal-group className="mt-12 grid gap-5 md:grid-cols-3">
            {psychologist.degrees.map((degree, index) => (
              <li
                key={degree.award}
                data-reveal-item
                className="surface-card group relative overflow-hidden rounded-[0.8rem] border border-coffee/12 p-7 transition-[transform,box-shadow] duration-700 ease-out hover:-translate-y-1 hover:shadow-lifted"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-6 -bottom-8 font-serif text-[7rem] leading-none text-burgundy/[0.06] transition-transform duration-700 group-hover:scale-110"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span aria-hidden="true" className="font-serif text-4xl text-coffee/25">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <GraduationCap className="absolute top-7 right-7 size-5 text-burgundy" aria-hidden="true" />
                <p className="relative mt-4 font-serif text-[1.45rem] leading-snug font-semibold text-shadow">{degree.award}</p>
                <p className="relative mt-2 text-[0.95rem] text-coffee">{degree.place}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-10">
            {psychologist.sections.map((section) => {
              const Icon = section.icon
              return (
                <article key={section.id} data-reveal className="grid content-start gap-4">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-burgundy text-paper shadow-[0_10px_24px_-8px_rgb(122_35_38/0.55)]">
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
                  <li
                    key={item}
                    className="rounded-full border border-burgundy/25 bg-burgundy/5 px-4 py-2 text-[0.92rem] font-medium text-burgundy transition-colors duration-500 hover:border-burgundy/50 hover:bg-burgundy/10"
                  >
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

      <section id="story" aria-labelledby="story-title" className="relative scroll-mt-24 py-24 lg:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_20%,rgb(226_174_134/0.22),transparent_50%),radial-gradient(ellipse_at_20%_90%,rgb(122_35_38/0.06),transparent_45%)]"
        />
        <div className="container-editorial grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading id="story-title" eyebrow="My story" title="From a school subject to a *purpose*" />
              <p data-reveal className="mt-5 max-w-sm text-[1.02rem] leading-relaxed text-shadow/75">
                Each leaf turns on its own — a chapter of curiosity, study and the work that grew from them.
              </p>
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
          <div className="min-w-0 overflow-x-clip lg:col-span-8">
            <StoryLeaves />
          </div>
        </div>
      </section>

      <FinalCta />
      <MotionController />
    </>
  )
}
