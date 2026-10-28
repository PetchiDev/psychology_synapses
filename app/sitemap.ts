import type { MetadataRoute } from 'next'
import { legalNav, absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/work-with-me'), changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/library'), changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.8 },
    ...legalNav.map((item) => ({ url: absoluteUrl(item.href), changeFrequency: 'yearly' as const, priority: 0.3 })),
  ]
}
