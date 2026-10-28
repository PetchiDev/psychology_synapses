import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { workAreas } from '@/data/content'
import { siteConfig } from '@/lib/site'

export function PracticeBand() {
  const items = [...siteConfig.disciplines, ...siteConfig.disciplines]

  return (
    <section aria-labelledby="practice-title" className="espresso-surface relative overflow-hidden py-16 lg:py-20">
      <div className="container-editorial grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <p data-reveal className="type-eyebrow flex items-center gap-3 text-gold">
            <span aria-hidden="true" className="rule-grow h-px w-8 bg-gold/70" />
            Psychology since {siteConfig.foundingYear}
          </p>
          <h2 id="practice-title" data-reveal className="type-h2 mt-5 text-paper">
            Four areas of work, <em className="text-[#f0b9a6] italic">one</em> psychology practice
          </h2>
        </div>
        <ol data-reveal-group className="grid gap-px overflow-hidden rounded-[0.6rem] bg-paper/10 sm:grid-cols-2 lg:col-span-6">
          {workAreas.map((area) => (
            <li key={area.slug} data-reveal-item className="bg-[#1f130c]">
              <Link
                href={`/work-with-me#${area.slug}`}
                className="group flex h-full items-start justify-between gap-4 p-5 transition-colors duration-500 hover:bg-paper/[0.06]"
              >
                <span className="grid gap-1">
                  <span className="font-serif text-2xl text-gold/80">{area.number}</span>
                  <span className="text-[0.95rem] leading-snug text-paper/90">{area.title}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-gold/60 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <div aria-hidden="true" className="marquee mt-14 border-y border-paper/10 py-5">
        <div className="marquee-track">
          {items.map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-8 pr-8 font-serif text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] whitespace-nowrap text-paper/80 italic">
              {item}
              <span className="size-1.5 rounded-full bg-gold/70" />
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">{siteConfig.disciplines.join(', ')}</p>
    </section>
  )
}
