import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { libraryCard, libraryChapters } from '@/data/content'
import { bookHref } from '@/lib/site'
import { pageMetadata } from '@/lib/seo/metadata'
import { AfterHero } from '@/components/animations/after-hero'
import { FairyParticles } from '@/components/animations/fairy-particles'
import { MotionController } from '@/components/animations/motion-controller'
import { CardCatalogue } from '@/components/library/card-catalogue'
import { ChapterBook } from '@/components/library/chapter-book'
import { StorybookHero } from '@/components/library/storybook-hero'
import { Ornament } from '@/components/library/ornament'
import { QuoteBand } from '@/components/library/quote-band'
import { ReadingRoom } from '@/components/library/reading-room'
import { TakeBreathButton } from '@/components/layout/take-breath-button'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = pageMetadata({
  title: 'The Library',
  description: libraryCard.summary,
  path: '/library',
})

export default function LibraryPage() {
  return (
    <div className="storybook-scope">
      <FairyParticles />
      <StorybookHero
        titleId="library-title"
        eyebrow="Paper Skin & Synapses · A place to read"
        titleLines={['Welcome to', <span key="library" className="gilt-text gilt-shift">the Library</span>]}
        lead={<p>{libraryCard.summary}</p>}
        actions={
          <>
            <Button asChild size="lg" variant="paper">
              <Link href="#chapters">
                Browse the chapters
                <ArrowDown aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/50 bg-mahogany/40 text-paper backdrop-blur-sm hover:border-paper hover:bg-paper hover:text-shadow"
            >
              <Link href="/">
                <ArrowLeft aria-hidden="true" />
                Back to the main site
              </Link>
            </Button>
          </>
        }
        caption="every story begins with a single page"
      />

      <div className="relative z-[35] pt-8 motion-safe:-mt-[100vh]">
        <AfterHero>
          <ReadingRoom />
        </AfterHero>
      </div>

      <section id="chapters" aria-labelledby="chapters-title" className="relative py-10">
        <h2 id="chapters-title" className="sr-only">
          Library chapters
        </h2>
        <ol className="sr-only">
          {libraryChapters.map((chapter) => (
            <li key={chapter.slug}>
              <h3>{chapter.title}</h3>
              <p>{chapter.summary}</p>
              <ul>
                {chapter.contents.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <ChapterBook />
      </section>

      <CardCatalogue />

      <QuoteBand />

      <section aria-labelledby="library-end-title" className="relative py-16 lg:py-20">
        <div className="container-editorial">
          <div className="ink-surface relative isolate grid justify-items-center gap-6 overflow-hidden rounded-[0.6rem] px-6 py-16 text-center sm:px-12">
            <FairyParticles contained density={0.5} />
            <p data-reveal className="type-hand text-2xl text-gold">to be continued</p>
            <h2 id="library-end-title" data-reveal className="type-h2 text-paper">
              More pages are being written
            </h2>
            <Ornament className="text-gold" />
            <p data-reveal className="type-lead max-w-2xl text-paper/80">
              The collection will grow over time. In the meantime, you can try the breathing exercise from the Practical Tools chapter, or get in
              touch if there is a topic you would like to read about.
            </p>
            <div data-reveal className="flex flex-col items-center gap-4 sm:flex-row">
              <TakeBreathButton />
              <Button asChild size="lg" variant="paper">
                <Link href={bookHref}>
                  Suggest a topic
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/50 text-paper hover:border-paper hover:bg-paper hover:text-shadow">
                <Link href="/">
                  <ArrowLeft aria-hidden="true" />
                  Main site
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <MotionController />
    </div>
  )
}
