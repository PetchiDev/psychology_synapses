import Link from 'next/link'
import { ArrowRight, Mail, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { BreathingOrb } from '@/components/animations/breathing-orb'
import { CalmerButton } from '@/components/animations/calmer-button'
import { KineticText } from '@/components/animations/kinetic-text'
import { Button } from '@/components/ui/button'

export function SafeSpace({ talkHref = '#book' }: { talkHref?: string }) {
  return (
    <section id="pause" aria-labelledby="pause-title" className="relative overflow-hidden py-16 lg:py-24">
      <div className="container-editorial">
        <div className="relative isolate grid gap-12 overflow-hidden rounded-[0.9rem] px-6 py-14 text-paper sm:px-12 lg:grid-cols-12 lg:gap-10 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,#24150d_0%,#3a2416_50%,#2a1a10_100%)]" />
          <div
            aria-hidden="true"
            className="ambient-dusk absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_40%,rgb(248_217_143/0.18),transparent_55%),linear-gradient(200deg,#2b1a10_0%,#3d2618_50%,#4a1c24_100%)]"
          />
          <div aria-hidden="true" className="ambient-mist absolute -bottom-16 -left-24 -z-10 h-48 w-[70%] rounded-full bg-lavender/15 blur-3xl" />
          <div
            aria-hidden="true"
            className="ambient-mist absolute right-[-15%] bottom-10 -z-10 h-40 w-[60%] rounded-full bg-moonlight/12 blur-3xl"
            style={{ animationDelay: '-8s', animationDuration: '26s' }}
          />

          <div className="relative lg:col-span-7">
            <p data-reveal className="type-eyebrow flex items-center gap-3 text-gold">
              <span aria-hidden="true" className="rule-grow h-px w-8 bg-gold/70" />
              Get in touch
            </p>
            <h2 id="pause-title" className="type-h2 mt-5 text-paper">
              <KineticText text="A moment to *pause*" emphasisClassName="text-[#f0b9a6] italic" />
            </h2>
            <div data-reveal className="type-lead mt-6 grid max-w-2xl gap-4 text-paper/85">
              <p>
                Sometimes you know exactly what you need. Sometimes you only know that you have a question, an idea or something you would like
                to talk through.
              </p>
              <p>
                Whether you’re looking for individual support, planning a programme, exploring a collaboration or simply trying to work out
                where to begin, you’re welcome to get in touch.
              </p>
              <p>Tell me a little about what you have in mind, and we can discuss the next step.</p>
            </div>
            <div data-reveal className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" variant="paper">
                <Link href={talkHref}>
                  Talk to Me
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-paper/35 text-paper hover:bg-paper hover:text-shadow">
                <a href={`mailto:${siteConfig.email}`}>
                  <Mail aria-hidden="true" />
                  Email me
                </a>
              </Button>
            </div>
            <dl data-reveal className="mt-8 grid gap-3 text-[0.95rem] text-paper/80 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <dt className="sr-only">Email</dt>
                <Mail className="size-4 shrink-0 text-gold" aria-hidden="true" />
                <dd>
                  <a href={`mailto:${siteConfig.email}`} className="break-all hover:text-paper hover:underline hover:underline-offset-4">
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="sr-only">Phone</dt>
                <Phone className="size-4 shrink-0 text-gold" aria-hidden="true" />
                <dd>
                  <a href={siteConfig.phoneHref} className="hover:text-paper hover:underline hover:underline-offset-4">
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div data-reveal className="relative grid content-center gap-6 lg:col-span-5">
            <BreathingOrb />
            <CalmerButton />
            <p className="text-center text-xs leading-relaxed text-paper/55">
              A breathing exercise is simply a tool you can choose to use. It is not a treatment and may not suit everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
