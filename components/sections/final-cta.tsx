import Link from 'next/link'
import { ArrowRight, Compass } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { SynapseField } from '@/components/animations/synapse-field'
import { Button } from '@/components/ui/button'

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="relative py-12 lg:py-16">
      <div className="container-editorial">
        <div className="espresso-surface relative isolate overflow-hidden rounded-[1rem] px-6 py-20 text-center sm:px-12 lg:py-28">
          <SynapseField tone="light" density={0.7} className="absolute inset-0 -z-10 opacity-60" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_50%,rgb(31_19_12/0.85)_20%,transparent_75%)]" />
          <div className="relative mx-auto grid max-w-3xl justify-items-center gap-6">
            <p data-reveal className="type-eyebrow flex items-center gap-3 text-gold">
              <span aria-hidden="true" className="rule-grow h-px w-8 bg-gold/70" />
              Next step
              <span aria-hidden="true" className="rule-grow h-px w-8 bg-gold/70" />
            </p>
            <h2 id="final-cta-title" data-reveal className="type-h2 text-paper">
              Where would you like to <span data-highlight data-tone="light" className="magic-highlight italic">begin?</span>
            </h2>
            <p data-reveal className="type-lead max-w-2xl text-paper/85">
              Psychology can take many forms, from individual work to organisational programmes, talks and research. Whatever brings you to{' '}
              {siteConfig.name}, you can find out more about my work and choose the direction that fits your interests.
            </p>
            <div data-reveal className="mt-3 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" variant="paper">
                <Link href="/#work">
                  <Compass aria-hidden="true" />
                  Find Your Way
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-paper/40 text-paper hover:bg-paper hover:text-burgundy">
                <Link href="/contact">
                  Let’s Talk
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
