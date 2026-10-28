import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="container-editorial grid min-h-[70vh] content-center gap-6 pt-32 pb-16">
      <p className="type-hand text-3xl text-burgundy">page not found</p>
      <h1 id="not-found-title" className="type-display max-w-[14ch]">
        This page isn’t here.
      </h1>
      <p className="type-lead max-w-xl text-shadow/80">The link may be outdated. Here are a few good places to continue.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            Back to home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/work-with-me">Ways to work with me</Link>
        </Button>
      </div>
    </section>
  )
}
