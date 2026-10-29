import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { psychologist } from '@/data/content'
import { bookHref, siteConfig } from '@/lib/site'
import { pageMetadata } from '@/lib/seo/metadata'
import { MotionController } from '@/components/animations/motion-controller'
import { AboutParallaxPortrait } from '@/components/sections/about-parallax-portrait'
import { AboutPath } from '@/components/sections/about-path'
import { FinalCta } from '@/components/sections/final-cta'
import { PageHero } from '@/components/sections/page-hero'
import { SectionHeading } from '@/components/sections/section-heading'
import { StoryChapters } from '@/components/sections/story-chapters'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = pageMetadata({
  title: 'About Me',
  description: `The story, qualifications, research and credentials of ${siteConfig.psychologist.name}, the ${siteConfig.psychologist.role.toLowerCase()} behind ${siteConfig.name}.`,
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <PageHero
        id="about-page-title"
        eyebrow="About the psychologist"
        crumb="About Me"
        title={
          <>
            Hi, I’m <em className="text-burgundy italic">{siteConfig.psychologist.name}</em>
          </>
        }
        aside={<AboutParallaxPortrait />}
      >
        {psychologist.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </PageHero>

      <AboutPath />

      <section id="story" aria-labelledby="story-title" className="relative scroll-mt-24 py-24 lg:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_0%,rgb(122_35_38/0.07),transparent_45%),radial-gradient(ellipse_at_10%_100%,rgb(196_149_74/0.12),transparent_40%)]"
        />
        <div className="container-editorial grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading id="story-title" eyebrow="My story" title="From a school subject to a *purpose*" />
              <p data-reveal className="mt-5 max-w-sm text-[1.02rem] leading-relaxed text-shadow/75">
                Six chapters of curiosity — scroll to watch the path fill and each chapter settle into place.
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
          <div className="min-w-0 lg:col-span-8">
            <StoryChapters />
          </div>
        </div>
      </section>

      <FinalCta />
      <MotionController />
    </>
  )
}
