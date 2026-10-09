import Link from 'next/link'
import { faqs } from '@/data/content'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SectionHeading } from './section-heading'

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-14 lg:py-20">
      <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
          <SectionHeading
            id="faq-title"
            index="07"
            eyebrow="Questions"
            title="Frequently Asked *Questions*"
            description={
              <p>
                Clear answers to what people most often ask before their first visit. Still unsure?{' '}
                <Link href="#book" className="font-semibold text-burgundy underline underline-offset-4">
                  Send us a message
                </Link>
                .
              </p>
            }
            note="no question is too small"
          />
        </div>
        <div data-reveal className="lg:col-span-7 lg:col-start-6">
          <Accordion type="single" collapsible defaultValue="faq-0" className="border-t border-coffee/20">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent forceMount>
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
