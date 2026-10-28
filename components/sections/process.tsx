import { processSteps } from '@/data/content'
import { StoryPath } from '@/components/animations/story-path'
import { SectionHeading } from './section-heading'

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative py-20 lg:py-28">
      <div className="container-editorial">
        <SectionHeading
          id="process-title"
          eyebrow="From your first enquiry to the next step"
          title="Getting *started*"
          description={<p>Here is how the process works.</p>}
          align="center"
          className="mx-auto"
        />
        <StoryPath steps={processSteps} />
      </div>
    </section>
  )
}
