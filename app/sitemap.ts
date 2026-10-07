import type { MetadataRoute } from 'next'
import { doctors } from '@/data/doctors'
import { absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/specialists'), changeFrequency: 'monthly', priority: 0.8 },
    ...doctors.map((doctor) => ({
      url: absoluteUrl(`/specialists/${doctor.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
