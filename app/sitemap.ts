import type { MetadataRoute } from 'next'
import { legalNav, absoluteUrl } from '@/lib/site'

export const dynamic = 'force-static'

// Pages are exported as folders (`trailingSlash`), so list the URLs that serve without a redirect.
const pageUrl = (path: string) => absoluteUrl(path.endsWith('/') ? path : `${path}/`)

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: pageUrl('/'), changeFrequency: 'monthly', priority: 1 },
    { url: pageUrl('/about'), changeFrequency: 'monthly', priority: 0.9 },
    { url: pageUrl('/work-with-me'), changeFrequency: 'monthly', priority: 0.9 },
    { url: pageUrl('/library'), changeFrequency: 'weekly', priority: 0.8 },
    { url: pageUrl('/contact'), changeFrequency: 'monthly', priority: 0.8 },
    ...legalNav.map((item) => ({ url: pageUrl(item.href), changeFrequency: 'yearly' as const, priority: 0.3 })),
  ]
}
