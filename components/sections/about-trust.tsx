import { trustPoints } from '@/data/content'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'
import { SectionHeading } from './section-heading'

export function AboutTrust() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative pt-16 pb-14 lg:pt-24 lg:pb-20">
      <div className="container-editorial grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="about-title"
            index="01"
            eyebrow="About us"
            title="Care that feels *human*, from the very first hello."
            note="you are more than a diagnosis"
          />
        </div>

        <div className="page-settle relative lg:col-span-7">
          <div aria-hidden="true" className="latte-surface absolute inset-0 translate-x-2 translate-y-2 rotate-[0.6deg] rounded-[0.5rem]" />
          <div className="paper-surface relative grid gap-6 rounded-[0.5rem] border border-gilt/30 p-7 text-[1.08rem] leading-relaxed text-shadow/85 sm:p-10 md:grid-cols-2 md:gap-12">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-6 left-1/2 hidden w-10 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(110_78_51/0.16)_45%,rgb(110_78_51/0.22)_50%,rgb(110_78_51/0.16)_55%,transparent)] md:block"
            />
            <p className="drop-cap">
              <strong className="font-semibold text-shadow">{siteConfig.name}</strong> is a psychology and mental health hospital in{' '}
              {siteConfig.address.locality}, {siteConfig.address.countryName}. Since {siteConfig.foundingYear}, our psychologists have
              offered counselling, psychological assessment, child and adolescent psychology, couples counselling, trauma support and
              wellness programmes.
            </p>
            <div className="grid content-between gap-6">
              <p>
                We built this place to feel less like a clinic and more like a quiet old library: somewhere you can sit down, take a
                breath and talk without being rushed. Consultations are available in{' '}
                {siteConfig.languages.slice(0, -1).join(', ')} and {siteConfig.languages.at(-1)}.
              </p>
              <p aria-hidden="true" className="text-center font-serif text-sm tracking-[0.3em] text-coffee">
                — i —
              </p>
            </div>
          </div>
        </div>
      </div>

      <ul data-reveal-group className="container-editorial mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6" aria-label="Why people trust us">
        {trustPoints.map((point, index) => {
          const Icon = point.icon
          const leather = index === 0
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
                  'group relative flex h-full flex-col gap-5 overflow-hidden rounded-[0.5rem] p-7 sm:p-8',
                  leather ? 'leather-surface' : cn('border border-gilt/30', index % 2 === 0 ? 'latte-surface shadow-paper' : 'paper-surface'),
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      'inline-flex size-12 items-center justify-center rounded-full border',
                      leather ? 'border-gold/50 text-gold' : 'border-gilt/50 text-burgundy',
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span aria-hidden="true" className={cn('type-hand text-xl', leather ? 'text-gold' : 'text-burgundy')}>
                    {point.note}
                  </span>
                </div>
                <h3 className={cn('type-h3', leather && 'text-paper')}>{point.title}</h3>
                <p className={cn('text-[1rem] leading-relaxed', leather ? 'text-paper/85' : 'text-shadow/80')}>{point.description}</p>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
