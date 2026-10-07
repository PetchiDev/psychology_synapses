import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { BreathingOrb } from '@/components/animations/breathing-orb'
import { Button } from '@/components/ui/button'

const reassurances = [
  { note: 'breathe', text: 'You don’t need a diagnosis, a referral or the “right words”.' },
  { note: 'speak', text: 'You can talk about anything — big or small, new or long-standing.' },
  { note: 'rest', text: 'You set the pace. Nothing is shared without your consent.' },
]

const stars = [
  [8, 12], [18, 30], [27, 8], [44, 18], [58, 6], [66, 24], [79, 10], [88, 28], [94, 14], [36, 34],
] as const

export function SafeSpace() {
  return (
    <section id="talk" aria-labelledby="talk-title" className="relative overflow-hidden py-14 lg:py-20">
      <div className="container-editorial">
        <div className="relative isolate grid gap-12 overflow-hidden rounded-[2.5rem] px-6 py-14 text-paper sm:px-12 lg:grid-cols-12 lg:gap-10 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,#2a2238_0%,#3a2a3d_45%,#2b1e1a_100%)]" />
          <div
            aria-hidden="true"
            className="ambient-dusk absolute inset-0 -z-10 bg-[linear-gradient(200deg,#2c3247_0%,#3b2a40_50%,#45262c_100%)]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-(image:--grain) opacity-25" />
          {stars.map(([x, y], index) => (
            <span
              key={`${x}-${y}`}
              aria-hidden="true"
              className="ambient-twinkle absolute -z-10 size-1 rounded-full bg-gold shadow-[0_0_8px_2px_rgb(243_223_160/0.6)]"
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${index * 0.7}s` }}
            />
          ))}
          <div aria-hidden="true" className="ambient-mist absolute -bottom-16 -left-24 -z-10 h-48 w-[70%] rounded-full bg-lavender/15 blur-3xl" />
          <div
            aria-hidden="true"
            className="ambient-mist absolute right-[-15%] bottom-10 -z-10 h-40 w-[60%] rounded-full bg-moonlight/12 blur-3xl"
            style={{ animationDelay: '-8s', animationDuration: '26s' }}
          />
          <div
            aria-hidden="true"
            className="ambient-mist absolute top-1/3 left-[20%] -z-10 h-32 w-[50%] rounded-full bg-peach/10 blur-3xl"
            style={{ animationDelay: '-14s', animationDuration: '30s' }}
          />

          <div className="relative lg:col-span-7">
            <p data-reveal className="type-eyebrow flex items-center gap-3 text-latte">
              <span className="font-serif text-base tracking-normal text-paper normal-case">No. 05</span>
              <span aria-hidden="true" className="h-px w-10 bg-latte/60" />
              How we help
            </p>
            <h2 id="talk-title" data-reveal className="type-h2 mt-5 text-paper">
              A Safe Space to <em className="text-peach">Be Heard</em>
            </h2>
            <div data-reveal className="type-lead mt-6 grid max-w-2xl gap-4 text-paper/85">
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

          <div data-reveal className="relative lg:col-span-5">
            <BreathingOrb />
          </div>

          <ul data-reveal-group className="relative grid gap-4 md:grid-cols-3 lg:col-span-12" aria-label="What to know before reaching out">
            {reassurances.map((item) => (
              <li key={item.note} data-reveal-item className="relative rounded-2xl border border-paper/15 bg-paper/[0.06] p-6 backdrop-blur-sm">
                <span aria-hidden="true" className="type-hand absolute -top-4 right-5 text-2xl text-peach">
                  {item.note}
                </span>
                <p className="text-[1.02rem] leading-relaxed text-paper/90">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
