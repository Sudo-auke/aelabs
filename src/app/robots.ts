import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://embdx.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/fr/client/', '/en/client/', '/de/client/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
