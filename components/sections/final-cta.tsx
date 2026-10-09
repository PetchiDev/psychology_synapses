import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { NightSky } from '@/components/animations/night-sky'
import { Ornament } from '@/components/library/ornament'
import { Button } from '@/components/ui/button'

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="relative py-10 lg:py-14">
      <div className="container-editorial">
        <div className="relative isolate overflow-hidden rounded-[0.6rem] px-6 pt-24 pb-28 text-center text-paper shadow-[inset_0_0_0_1px_rgb(226_194_122/0.4),inset_0_0_0_9px_rgb(26_18_30),inset_0_0_0_10px_rgb(226_194_122/0.22)] sm:px-12 lg:pt-32 lg:pb-40">
          <NightSky />
          <div className="relative mx-auto grid max-w-3xl justify-items-center gap-6">
            <p data-reveal className="type-hand text-2xl text-gold">and so, a new chapter begins, whenever you’re ready</p>
            <Ornament className="text-gold" />
            <h2 id="final-cta-title" data-reveal className="type-h2 text-paper">
              You Don’t Have to Navigate It <span data-highlight data-tone="light" className="magic-highlight">Alone</span>
            </h2>
            <p data-reveal className="type-lead max-w-2xl text-paper/85">
              Whether you’re facing something new or something you’ve carried for a long time, there is a warm light on and a kind
              voice waiting. Our team is here to listen — gently, confidentially and without judgement.
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
