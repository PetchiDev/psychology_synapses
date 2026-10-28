import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { psychologist } from '@/data/content'
import { Button } from '@/components/ui/button'
import { PsychologistTabs } from './psychologist-tabs'
import { SectionHeading } from './section-heading'

export function Portrait({ priority = false }: { priority?: boolean }) {
  return (
    <figure data-reveal className="relative mx-auto w-full max-w-[26rem]">
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-2 translate-y-3 rounded-[1.1rem] border border-gilt/50 sm:-inset-3 sm:translate-x-4 sm:translate-y-4"
      />
      <div className="paper-float relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-latte shadow-lifted">
        <Image
          src={psychologist.portrait.src}
          alt={psychologist.portrait.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 26rem, 90vw"
          className="object-cover object-[50%_32%] transition-transform duration-[1.2s] ease-out hover:scale-[1.03]"
        />
      </div>
      <figcaption className="surface-card absolute -bottom-6 left-1/2 flex w-[min(92%,22rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-coffee/12 px-4 py-2.5 text-[0.82rem] text-shadow/85">
        <BadgeCheck className="size-5 shrink-0 text-burgundy" aria-hidden="true" />
        {psychologist.registrations.map((item) => `${item.credential} (${item.region})`).join(' · ')}
      </figcaption>
    </figure>
  )
}

export function Psychologist() {
  return (
    <section id="psychologist" aria-labelledby="psychologist-title" className="relative bg-paper-deep/50 py-20 lg:py-28">
      <div className="container-editorial grid gap-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Portrait />
          </div>
        </div>
        <div className="grid content-start gap-10 lg:col-span-7">
          <SectionHeading
            id="psychologist-title"
            eyebrow="About me"
            title="About the *psychologist*"
            description={psychologist.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-[1.04rem]">
                {paragraph}
              </p>
            ))}
          />
          <div data-reveal>
            <PsychologistTabs />
          </div>
          <div data-reveal>
            <Button asChild size="lg" variant="outline">
              <Link href="/about#story">
                Read my story
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
