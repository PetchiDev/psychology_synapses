import { features } from '@/data/content'
import { siteConfig } from '@/lib/site'
import { AfterHero } from '@/components/animations/after-hero'
import { ScrollPaper } from '@/components/paper/scroll-paper'
import { SectionHeading } from './section-heading'

export function AboutPractice() {
  return (
    <section aria-labelledby="about-title" className="relative z-[35] pb-20 motion-safe:-mt-[100vh] lg:pb-28">
      <span id="about" aria-hidden="true" className="absolute top-24 left-0" />
      <AfterHero>
        <div className="container-editorial grid gap-12 pt-28 lg:grid-cols-12 lg:items-center lg:gap-14 lg:pt-32">
          <div className="lg:col-span-5">
            <SectionHeading id="about-title" eyebrow="About the practice" title="A little about the *practice*" />
          </div>
          <div data-reveal className="lg:col-span-7">
            <ScrollPaper tilt={-0.8} seed={12} contentClassName="grid gap-5 px-[11%] py-12 text-[1.06rem] leading-[1.8] text-shadow/90 sm:py-14">
              <p className="drop-cap">
                {siteConfig.name} brings together my work across different areas of psychology. This includes clinical work and individual
                counselling, consulting with organisations, developing mental health programmes, conducting workshops and talks, and
                collaborating on research and publications.
              </p>
              <p>
                The website also has a library of articles, stories and practical resources for anyone interested in understanding psychology
                and using what they learn in everyday life. The aim is to make room for both professional work and the simple curiosity to learn
                more about people and how we think, feel and behave.
              </p>
            </ScrollPaper>
          </div>
        </div>

        <ul data-reveal-group aria-label="What makes the practice different" className="container-editorial mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <li key={feature.title} data-reveal-item>
                <article
                  data-hover-lift
                  className="surface-card group relative flex h-full flex-col gap-5 overflow-hidden rounded-[0.75rem] border border-coffee/12 p-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-burgundy transition-transform duration-700 ease-(--ease-paper) group-hover:scale-x-100"
                  />
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-burgundy/8 text-burgundy transition-[background-color,color,transform] duration-500 group-hover:rotate-[-6deg] group-hover:bg-burgundy group-hover:text-paper">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span aria-hidden="true" className="font-serif text-3xl text-coffee/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="type-h3 text-[1.45rem]">{feature.title}</h3>
                  <p className="text-[0.98rem] leading-relaxed text-shadow/75">{feature.description}</p>
                </article>
              </li>
            )
          })}
        </ul>
      </AfterHero>
    </section>
  )
}
