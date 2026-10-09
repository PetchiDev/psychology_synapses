import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { services } from '@/data/content'
import { ServiceBook } from '@/components/library/service-book'
import { Button } from '@/components/ui/button'
import { chapter, SectionHeading } from './section-heading'

const INDEX = '02'

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative pt-14 pb-8 lg:pt-20">
      <div className="container-editorial grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start lg:pt-6">
          <SectionHeading
            id="services-title"
            index={INDEX}
            eyebrow="What we offer"
            title="Our Psychological *Services*"
            description="Every service begins with listening. Turn the pages of our little book: from one-to-one counselling to structured assessment, we shape support around your goals and your pace."
            note="one size never fits all"
          />
          <div data-reveal className="mt-8">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="#book">
                Book a consultation
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ol className="sr-only" aria-label="Psychological services">
            {services.map((service) => (
              <li key={service.slug}>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <p>Suitable for: {service.forWhom}</p>
              </li>
            ))}
          </ol>
          <ServiceBook chapter={chapter(INDEX)} />
        </div>
      </div>
    </section>
  )
}
