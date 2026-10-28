import Link from 'next/link'
import { faqs } from '@/data/content'
import { bookHref } from '@/lib/site'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SectionHeading } from './section-heading'

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-20 lg:py-28">
      <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
          <SectionHeading
            id="faq-title"
            eyebrow="Questions"
            title="Frequently Asked *Questions*"
            description={
              <p>
                Answers to the questions people ask most often. Can’t find what you need?{' '}
                <Link href={bookHref} className="font-semibold text-burgundy underline underline-offset-4">
                  Get in touch
                </Link>
                .
              </p>
            }
          />
        </div>
        <div data-reveal className="lg:col-span-7 lg:col-start-6">
          <Accordion type="single" collapsible defaultValue="faq-0" className="border-t border-coffee/20">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>
                  <span className="flex gap-4">
                    <span aria-hidden="true" className="mt-1 font-sans text-sm text-coffee/70 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent forceMount>
                  <div className="grid gap-3 pl-9">
                    {faq.answer.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
