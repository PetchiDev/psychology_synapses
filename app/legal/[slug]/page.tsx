import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLegalPage, legalPages } from '@/data/legal'
import { legalNav } from '@/lib/site'
import { pageMetadata } from '@/lib/seo/metadata'
import { PageHero } from '@/components/sections/page-hero'

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: PageProps<'/legal/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const page = getLegalPage(slug)
  if (!page) return {}
  return pageMetadata({ title: page.title, description: page.summary, path: `/legal/${page.slug}` })
}

export default function LegalPage({ params }: PageProps<'/legal/[slug]'>) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <LegalContent params={params} />
    </Suspense>
  )
}

async function LegalContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getLegalPage(slug)
  if (!page) notFound()

  return (
    <>
      <PageHero id="legal-title" eyebrow="Policies" crumb={page.title} title={page.title}>
        <p>{page.summary}</p>
      </PageHero>
      <div className="container-editorial grid gap-12 pb-12 lg:grid-cols-12">
        <nav aria-label="Policies" className="lg:col-span-3">
          <ul className="grid gap-1 lg:sticky lg:top-32">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={item.href === `/legal/${page.slug}` ? 'page' : undefined}
                  className="block rounded-[0.5rem] px-3 py-2 text-[0.95rem] text-shadow/75 transition-colors hover:bg-burgundy/5 hover:text-burgundy aria-[current=page]:bg-burgundy aria-[current=page]:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="grid max-w-3xl gap-10 lg:col-span-8 lg:col-start-5">
          {page.sections.map((section) => (
            <section key={section.heading} className="grid gap-3">
              <h2 className="type-h3">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-[1.02rem] leading-[1.8] text-shadow/85">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </>
  )
}
