import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { SynapseField } from '@/components/animations/synapse-field'

const stagger = (index: number) => ({ '--i': index }) as CSSProperties

interface PageHeroProps {
  id: string
  eyebrow: string
  title: ReactNode
  crumb: string
  children?: ReactNode
  aside?: ReactNode
}

export function PageHero({ id, eyebrow, title, crumb, children, aside }: PageHeroProps) {
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgb(226_174_134/0.25),transparent_55%)]" />
        <SynapseField density={0.6} className="absolute inset-0 opacity-60 [mask-image:linear-gradient(90deg,transparent_20%,#000_80%)]" />
      </div>
      <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className={aside ? 'lg:col-span-7' : 'lg:col-span-9'}>
          <nav data-hero-item style={stagger(0)} aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-coffee">
              <li className="inline-flex items-center gap-1.5">
                <Link href="/" className="hover:text-burgundy hover:underline hover:underline-offset-4">
                  Home
                </Link>
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </li>
              <li aria-current="page" className="font-medium text-shadow">
                {crumb}
              </li>
            </ol>
          </nav>
          <p data-hero-item style={stagger(1)} className="type-eyebrow mt-8 flex items-center gap-3 text-burgundy">
            <span aria-hidden="true" className="h-px w-8 bg-burgundy/60" />
            {eyebrow}
          </p>
          <h1 id={id} data-hero-item style={stagger(2)} className="type-display mt-5 max-w-[15ch]">
            {title}
          </h1>
          {children ? (
            <div data-hero-item style={stagger(3)} className="type-lead mt-7 grid max-w-2xl gap-4 text-shadow/80">
              {children}
            </div>
          ) : null}
        </div>
        {aside ? (
          <div data-hero-item style={stagger(3)} className="lg:col-span-5">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  )
}
