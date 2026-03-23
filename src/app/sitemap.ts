import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://embdx.com'
const LOCALES = ['fr', 'en', 'de'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Pages statiques actives
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: locale === 'fr' ? 1.0 : 0.9,
    })
  }

  // Fiches solutions (pages dynamiques actives)
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'solutions',
      where: { published: { equals: true } },
      limit: 100,
      depth: 0,
      select: { slug: true, updatedAt: true },
    })

    for (const solution of result.docs) {
      const sol = solution as unknown as { slug: string; updatedAt: string }
      for (const locale of LOCALES) {
        entries.push({
          url: `${BASE_URL}/${locale}/solutions/${sol.slug}`,
          lastModified: new Date(sol.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  } catch {
    // DB inaccessible au build — on continue sans les solutions
  }

  return entries
}
