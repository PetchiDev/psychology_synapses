import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { libraryCard, libraryChapters } from '@/data/content'
import { bookHref } from '@/lib/site'
import { pageMetadata } from '@/lib/seo/metadata'
import { AfterHero } from '@/components/animations/after-hero'
import { FairyParticles } from '@/components/animations/fairy-particles'
import { MotionController } from '@/components/animations/motion-controller'
import { ChapterBook } from '@/components/library/chapter-book'
import { ChapterShelf } from '@/components/library/chapter-shelf'
import { StorybookHero } from '@/components/library/storybook-hero'
import { Ornament } from '@/components/library/ornament'
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
              <Link href="#shelf">
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

      <section aria-labelledby="once-title" className="relative z-[35] overflow-x-clip pb-16 motion-safe:-mt-[100vh] lg:pb-20">
        <span id="shelf" aria-hidden="true" className="absolute top-24 left-0" />
        <AfterHero>
          <div className="container-editorial grid justify-items-center gap-6 pt-28 text-center lg:pt-32">
            <p data-reveal className="font-ui text-[0.7rem] tracking-[0.3em] text-coffee uppercase">
              Chapter I
            </p>
            <h2 id="once-title" data-reveal className="type-h2 max-w-3xl">
              A gentle <em className="text-burgundy italic">beginning</em>
            </h2>
            <Ornament className="text-gilt" />
            <div data-reveal className="paper-surface relative max-w-2xl rounded-[0.5rem] border border-gilt/30 px-7 py-9 text-left sm:px-12">
              <p className="drop-cap type-lead text-shadow/85">
                Once upon a time, someone grew curious about why people think, feel and behave the way they do. They found that every answer
                opened another question, and that the questions were worth sharing.
              </p>
              <p className="type-lead mt-4 text-shadow/85">
                This library is where those questions are kept: articles, stories, explainers, reflections, awareness pieces and practical tools.
                Take a book from the shelf, turn the pages and read at your own pace.
              </p>
            </div>
            <p data-reveal className="type-hand text-2xl text-burgundy">choose a chapter</p>
            <div data-reveal className="mt-2 w-full">
              <ChapterShelf />
            </div>
          </div>
        </AfterHero>
      </section>

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
