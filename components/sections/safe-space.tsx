import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { Button } from '@/components/ui/button'

const reassurances = [
  'You don’t need a diagnosis, a referral or the “right words”.',
  'You can talk about anything — big or small, new or long-standing.',
  'You set the pace. Nothing is shared without your consent.',
]

export function SafeSpace() {
  return (
    <section id="talk" aria-labelledby="talk-title" className="relative overflow-hidden py-14 lg:py-20">
      <div className="container-editorial">
        <div className="relative grid gap-12 overflow-hidden rounded-[2.5rem] bg-shadow px-6 py-14 text-paper sm:px-12 lg:grid-cols-12 lg:gap-10 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="absolute inset-0 bg-(image:--grain) opacity-30" />
          <div aria-hidden="true" data-parallax="0.15" className="absolute -right-20 -bottom-28 size-96 rounded-full border border-latte/20" />
          <div aria-hidden="true" data-parallax="0.25" className="absolute -right-6 -bottom-10 size-64 rounded-full bg-burgundy/40 blur-2xl" />

          <div className="relative lg:col-span-7">
            <p data-reveal className="type-eyebrow flex items-center gap-3 text-latte">
              <span className="font-serif text-base tracking-normal text-paper normal-case">No. 05</span>
              <span aria-hidden="true" className="h-px w-10 bg-latte/60" />
              How we help
            </p>
            <h2 id="talk-title" data-reveal className="type-h2 mt-5 text-paper">
              A Safe Space to <em className="text-latte">Be Heard</em>
            </h2>
            <div data-reveal className="type-lead mt-6 grid max-w-2xl gap-4 text-paper/80">
              <p>
                If you’ve been feeling overwhelmed, anxious, low, or simply not like yourself, you’re welcome to reach out. Many people
                come to us unsure whether their struggles are “serious enough”. They are. Feeling stuck is reason enough to talk.
              </p>
              <p>A first conversation is just that — a conversation. We’ll listen, help you make sense of what’s happening, and explore what might help next.</p>
            </div>
            <div data-reveal className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="paper">
                <Link href="#book">
                  Talk to Us
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-paper/35 text-paper hover:bg-paper hover:text-shadow">
                <a href={siteConfig.phoneHref}>
                  <Phone aria-hidden="true" />
                  Call {siteConfig.phone}
                </a>
              </Button>
            </div>
          </div>

          <ul className="relative grid content-center gap-4 lg:col-span-5" aria-label="What to know before reaching out">
            {reassurances.map((item, index) => (
              <li
                key={item}
                data-reveal
                className="relative rounded-2xl border border-paper/15 bg-paper/[0.06] p-6 backdrop-blur-sm"
                style={{ marginLeft: `${index * 1.25}rem` }}
              >
                <span aria-hidden="true" className="type-hand absolute -top-4 right-5 text-2xl text-latte">
                  {['breathe', 'speak', 'rest'][index]}
                </span>
                <p className="text-[1.02rem] leading-relaxed text-paper/90">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
