import { processSteps } from '@/data/content'
import { SectionHeading } from './section-heading'

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative py-20 lg:py-32">
      <div className="container-editorial">
        <SectionHeading
          id="process-title"
          index="06"
          eyebrow="Your first steps"
          title="What to Expect"
          description="Reaching out is often the hardest part. Here is exactly what happens next, so there are no surprises."
          align="center"
          className="mx-auto"
        />

        <div data-timeline className="relative mt-16 lg:mt-24">
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[1.4rem] w-px bg-coffee/20 lg:top-[1.4rem] lg:right-[10%] lg:bottom-auto lg:left-[10%] lg:h-px lg:w-auto"
          >
            <div
              data-timeline-line
              className="h-full w-full origin-top scale-y-(--progress) bg-burgundy [--progress:1] lg:origin-left lg:scale-x-(--progress) lg:scale-y-100"
            />
          </div>

          <ol data-reveal-group className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((step, index) => (
              <li key={step.title} data-reveal-item className="relative grid grid-cols-[2.8rem_1fr] gap-5 lg:grid-cols-1 lg:justify-items-center lg:text-center">
                <span className="relative z-10 inline-flex size-[2.8rem] items-center justify-center rounded-full border border-burgundy bg-paper font-serif text-lg text-burgundy shadow-paper">
                  {index + 1}
                </span>
                <div className="grid gap-2 lg:mt-3">
                  <h3 className="type-h3">{step.title}</h3>
                  <p className="text-[0.96rem] leading-relaxed text-shadow/80 lg:mx-auto lg:max-w-[15rem]">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
