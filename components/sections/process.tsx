import { processSteps } from '@/data/content'
import { StoryPath } from '@/components/animations/story-path'
import { SectionHeading } from './section-heading'

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative py-14 lg:py-20">
      <div className="container-editorial">
        <SectionHeading
          id="process-title"
          index="06"
          eyebrow="Your first steps"
          title="What to *Expect*"
          description="Reaching out is often the hardest part. Here is exactly what happens next, so there are no surprises."
          note="one gentle step at a time"
          align="center"
          className="mx-auto"
        />
        <StoryPath steps={processSteps} />
      </div>
    </section>
  )
}
