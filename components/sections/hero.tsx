import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { StorybookHero } from '@/components/library/storybook-hero'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <StorybookHero
      titleId="hero-title"
      eyebrow={siteConfig.name}
      kicker={
        <ul aria-label="Areas of work" className="flex flex-wrap gap-x-2.5 gap-y-1 text-[0.78rem] text-paper/75 sm:text-[0.88rem]">
          {siteConfig.disciplines.map((item, index) => (
            <li key={item} className="flex items-center gap-2.5">
              {index > 0 ? <span aria-hidden="true" className="size-1 rounded-full bg-gold/70" /> : null}
              {item}
            </li>
          ))}
        </ul>
      }
      titleLines={[
        <span key="a" className="gilt-text gilt-shift">
          Every mind has
        </span>,
        <span key="b">
          more than one <em className="text-[#f0b9a6] italic">story</em>
        </span>,
      ]}
      lead={
        <>
          <p className="sm:hidden">
            Psychology extends far beyond any one setting. {siteConfig.name} brings clinical practice, counselling, consulting, talks and
            research together, with a library of resources to explore in your own time.
          </p>
          <p className="hidden sm:block">
            Psychology extends far beyond any one setting. At {siteConfig.name}, this spans clinical practice, individual counselling,
            organisational consulting, psychoeducation, workshops and research collaborations, along with a library of reading and resources for
            readers who want to learn more about psychology and its place in everyday life, in their own time.
          </p>
        </>
      }
      actions={
        <>
          <Button asChild size="lg">
            <Link href="#book">
              Let’s Talk
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-gold/50 bg-mahogany/40 text-paper backdrop-blur-sm hover:border-paper hover:bg-paper hover:text-shadow"
          >
            <Link href="#work">
              Explore my work
              <ArrowDown aria-hidden="true" />
            </Link>
          </Button>
        </>
      }
      caption="every mind has more than one story"
      book={{
        coverSubtitle: `Psychology since ${siteConfig.foundingYear}`,
        pageLabel: siteConfig.name,
        pageTitle: 'Four areas of work, one practice',
        pageBody: 'Individual counselling, organisations, schools and colleges, talks and workshops, and research collaborations, gathered in one place.',
      }}
    />
  )
}
