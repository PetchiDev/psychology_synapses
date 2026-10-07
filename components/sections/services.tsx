import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { services } from '@/data/content'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SectionHeading } from './section-heading'

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative py-20 lg:py-32">
      <div className="container-editorial grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
          <SectionHeading
            id="services-title"
            index="03"
            eyebrow="What we offer"
            title="Our Psychological Services"
            description="Every service begins with listening. From one-to-one counselling to structured assessment, we shape support around your goals and your pace."
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

        <ol data-reveal-group className="grid gap-6 sm:grid-cols-2 lg:col-span-8 lg:gap-x-8 lg:gap-y-10" aria-label="Psychological services">
          {services.map((service, index) => {
            const Icon = service.icon
            const offset = index % 2 === 1
            return (
              <li key={service.slug} data-reveal-item className={cn(offset && 'sm:mt-16')}>
                <article
                  data-hover-lift
                  className={cn(
                    'group relative flex h-full flex-col gap-5 rounded-[1.75rem] border border-coffee/15 p-7 shadow-paper sm:p-8',
                    index % 4 === 0 || index % 4 === 3 ? 'paper-surface' : 'latte-surface',
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      aria-hidden="true"
                      className="font-serif text-[3.25rem] leading-none text-transparent [-webkit-text-stroke:1px_var(--coffee)] transition-colors duration-500 group-hover:text-burgundy/10"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-shadow text-paper transition-colors duration-500 group-hover:bg-burgundy">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="type-h3">{service.title}</h3>
                  <p className="text-[0.98rem] leading-relaxed text-shadow/80">{service.summary}</p>
                  <p className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-coffee/25 px-3 py-1 text-xs font-semibold text-coffee-deep">
                    <span className="sr-only">Suitable for:</span>
                    {service.forWhom}
                  </p>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
