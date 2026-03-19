import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { LandingHero } from '@/components/sections/LandingHero'
import { ManifestoSection } from '@/components/sections/ManifestoSection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { BusFileReaderFeatures } from '@/components/sections/BusFileReaderFeatures'
import { PricingSection } from '@/components/sections/PricingSection'
import { DownloadSection } from '@/components/sections/DownloadSection'
import { CommunitySection } from '@/components/sections/CommunitySection'
import { NewsSection } from '@/components/sections/NewsSection'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return {
    title: t('title'),
    description: t('description'),
    other: {
      'script:ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'BusFileReader',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows, macOS',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: 'Read, explore and analyze DBC & CAN bus files. Free download.',
      }),
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayloadClient()

  const { docs: versions } = await payload.find({
    collection: 'software-versions',
    where: { isActive: { equals: true } },
    sort: '-releaseDate',
  })

  return (
    <main>
      {/* 1 — Hero with app mockup + download CTA */}
      <LandingHero locale={locale} />

      {/* 2 — Brand manifesto */}
      <ManifestoSection />

      {/* 3 — Three products overview */}
      <ProductsSection />

      {/* 4 — BusFileReader deep dive: bit layout + multi-format */}
      <BusFileReaderFeatures />

      {/* 5 — Pricing: Free vs Pro */}
      <PricingSection />

      {/* 6 — Download */}
      <DownloadSection versions={versions as Parameters<typeof DownloadSection>[0]['versions']} />

      {/* 7 — Discord community */}
      <CommunitySection />

      {/* 8 — Latest articles */}
      <NewsSection />
    </main>
  )
}
