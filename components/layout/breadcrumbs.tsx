import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from '@/lib/seo/json-ld'
import { breadcrumbSchema, graph } from '@/lib/seo/schemas'

interface Crumb {
  name: string
  path: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-coffee">
          {items.map((item, index) => {
            const last = index === items.length - 1
            return (
              <li key={item.path} className="inline-flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="font-medium text-shadow">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="hover:text-burgundy hover:underline hover:underline-offset-4">
                      {item.name}
                    </Link>
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd data={graph(breadcrumbSchema(items))} />
    </>
  )
}
