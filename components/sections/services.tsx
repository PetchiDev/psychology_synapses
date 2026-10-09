import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { services } from '@/data/content'
import { StackedPages } from '@/components/animations/stacked-pages'
import { Button } from '@/components/ui/button'
import { SectionHeading } from './section-heading'

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative py-14 lg:py-20">
      <div className="container-editorial grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
          <SectionHeading
            id="services-title"
            index="03"
            eyebrow="What we offer"
            title="Our Psychological *Services*"
            description="Every service begins with listening. Turn the pages: from one-to-one counselling to structured assessment, we shape support around your goals and your pace."
            note="one size never fits all"
          />
          <div data-reveal className="mt-8">
            <Button asChild size="lg">
              <Link href="#book">
                Book a consultation
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <StackedPages label="Psychological services">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <article
                  key={service.slug}
                  data-hover-lift
                  className="group paper-surface relative grid min-h-[17rem] gap-6 rounded-[0.5rem] border border-gilt/35 p-7 sm:p-9 md:grid-cols-[8.5rem_1fr] md:gap-10"
                >
                  <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 rounded-[0.3rem] border border-gilt/25" />
                  <div className="flex items-center gap-4 md:flex-col md:items-start md:justify-between">
                    <span aria-hidden="true" className="font-serif text-[3.6rem] leading-none text-burgundy/85 md:text-[4.6rem]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="leather-surface inline-flex size-14 items-center justify-center rounded-full text-gold transition-transform duration-700 ease-(--ease-paper) group-hover:rotate-[-8deg]">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="grid content-start gap-4">
                    <p aria-hidden="true" className="font-ui text-[0.62rem] tracking-[0.28em] text-coffee uppercase">
                      Page {index + 1} of {services.length}
                    </p>
                    <h3 className="type-h3">{service.title}</h3>
                    <p className="drop-cap text-[1.05rem] leading-relaxed text-shadow/80">{service.summary}</p>
                    <p className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-gilt/40 bg-paper/60 px-3.5 py-1 text-sm font-semibold text-coffee-deep">
                      <span className="sr-only">Suitable for:</span>
                      {service.forWhom}
                    </p>
                  </div>
                </article>
              )
            })}
          </StackedPages>
        </div>
      </div>
    </section>
  )
}
