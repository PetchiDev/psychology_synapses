import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { Button } from '@/components/ui/button'

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="relative py-10 lg:py-14">
      <div className="container-editorial">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-burgundy px-6 py-16 text-center text-paper sm:px-12 lg:py-24">
          <div aria-hidden="true" className="absolute inset-0 bg-(image:--grain) opacity-35" />
          <svg
            aria-hidden="true"
            data-parallax="0.1"
            viewBox="0 0 800 300"
            className="absolute inset-x-0 -bottom-6 h-auto w-full text-paper/15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M0 220 C120 160 220 260 340 200 S560 120 680 190 780 210 800 180" />
            <path d="M0 250 C140 200 240 290 360 230 S580 160 700 220 790 240 800 210" />
          </svg>
          <div className="relative mx-auto grid max-w-3xl justify-items-center gap-6">
            <p data-reveal className="type-hand text-2xl text-latte">whenever you’re ready</p>
            <h2 id="final-cta-title" data-reveal className="type-h2 text-paper">
              You Don’t Have to Navigate It Alone
            </h2>
            <p data-reveal className="type-lead max-w-2xl text-paper/80">
              Whether you’re facing something new or something you’ve carried for a long time, our team is here to listen — gently,
              confidentially and without judgement.
            </p>
            <div data-reveal className="mt-3 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" variant="paper">
                <Link href="/#book">
                  Book an Appointment
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-paper/40 text-paper hover:bg-paper hover:text-burgundy">
                <a href={siteConfig.phoneHref} aria-label={`Contact Us by phone on ${siteConfig.phone}`}>
                  <Phone aria-hidden="true" />
                  Contact Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
