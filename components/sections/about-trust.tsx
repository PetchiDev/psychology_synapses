import { trustPoints } from '@/data/content'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'
import { SectionHeading } from './section-heading'

export function AboutTrust() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-20 lg:py-32">
      <div className="container-editorial grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            id="about-title"
            index="01"
            eyebrow="About us"
            title={
              <>
                Care that feels <em className="text-burgundy">human</em>, from the very first hello.
              </>
            }
            note="you are more than a diagnosis"
          />
        </div>
        <div data-reveal className="grid content-end gap-5 text-[1.05rem] leading-relaxed text-shadow/85 lg:col-span-6 lg:col-start-7">
          <p>
            <strong className="font-semibold text-shadow">{siteConfig.name}</strong> is a psychology and mental health hospital in{' '}
            {siteConfig.address.locality}, {siteConfig.address.countryName}. Since {siteConfig.foundingYear}, our psychologists have
            offered counselling, psychological assessment, child and adolescent psychology, couples counselling, trauma support and
            wellness programmes.
          </p>
          <p>
            We built this place to feel less like a clinic and more like a quiet study — somewhere you can sit down, take a breath and
            talk without being rushed. Consultations are available in {siteConfig.languages.slice(0, -1).join(', ')} and{' '}
            {siteConfig.languages.at(-1)}.
          </p>
        </div>
      </div>

      <ul data-reveal-group className="container-editorial mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-6" aria-label="Why people trust us">
        {trustPoints.map((point, index) => {
          const Icon = point.icon
          return (
            <li
              key={point.title}
              data-reveal-item
              className={cn(
                index < 2 ? 'lg:col-span-3' : 'lg:col-span-2',
                index === 1 && 'lg:mt-10',
                index === 3 && 'lg:mt-6',
              )}
            >
              <article
                data-hover-lift
                className={cn(
                  'group relative flex h-full flex-col gap-5 overflow-hidden rounded-[1.75rem] border border-coffee/15 p-7 shadow-paper sm:p-8',
                  index === 0 ? 'bg-shadow text-paper' : index % 2 === 0 ? 'latte-surface' : 'paper-surface',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      'inline-flex size-12 items-center justify-center rounded-full border',
                      index === 0 ? 'border-paper/30 text-latte' : 'border-coffee/25 text-burgundy',
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span aria-hidden="true" className={cn('type-hand text-xl', index === 0 ? 'text-latte' : 'text-burgundy')}>
                    {point.note}
                  </span>
                </div>
                <h3 className={cn('type-h3', index === 0 && 'text-paper')}>{point.title}</h3>
                <p className={cn('text-[0.98rem] leading-relaxed', index === 0 ? 'text-paper/80' : 'text-shadow/80')}>
                  {point.description}
                </p>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
