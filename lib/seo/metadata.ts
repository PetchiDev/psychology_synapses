import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site'

interface PageMetadataInput {
  title?: string
  description?: string
  path: string
  type?: 'website' | 'profile'
  images?: { url: string; alt: string; width?: number; height?: number }[]
}

const defaultImages = [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${siteConfig.name} — psychology and mental health hospital` }]

export function pageMetadata({
  title,
  description = siteConfig.description,
  path,
  type = 'website',
  images = defaultImages,
}: PageMetadataInput): Metadata {
  const ogTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} — Psychology & Mental Health Hospital in ${siteConfig.address.locality}`
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: ogTitle,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: images.map((image) => image.url),
    },
  }
}
