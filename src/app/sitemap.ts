import type { MetadataRoute } from 'next'

import { getPublicSiteData } from '@/cms'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ab-couvreur-sud.fr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services, zones } = await getPublicSiteData()
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/realisations`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const zoneRoutes: MetadataRoute.Sitemap = zones.map((z) => ({
    url: `${SITE_URL}/zones/${z.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...serviceRoutes, ...zoneRoutes]
}
