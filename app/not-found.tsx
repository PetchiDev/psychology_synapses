import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="container-editorial grid min-h-[70vh] content-center gap-6 pt-32 pb-16">
      <p className="type-hand text-3xl text-burgundy">this page wandered off</p>
      <h1 id="not-found-title" className="type-display max-w-[14ch]">
        We couldn’t find that page.
      </h1>
      <p className="type-lead max-w-xl text-shadow/80">The link may be outdated. Let’s get you back somewhere familiar.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            Back to home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/specialists">Meet our specialists</Link>
        </Button>
      </div>
    </section>
  )
}
