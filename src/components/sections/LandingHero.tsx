'use client'

import { useTranslations } from 'next-intl'
import { HeroBackground } from './HeroBackground'
import { HeroCarousel } from './HeroCarousel'

interface LandingHeroProps {
  locale: string
}

export function LandingHero({ locale }: LandingHeroProps) {
  const t = useTranslations('landing.hero')

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <HeroBackground />

      <div className="relative" style={{ zIndex: 2 }}>
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: 'rgba(99,102,241,0.10)',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--accent-primary)' }}
            />
            {t('badge')}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mx-auto mb-5 max-w-3xl text-center text-5xl font-bold md:text-6xl lg:text-7xl"
          style={{
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
          }}
        >
          BusFileReader
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto mb-3 max-w-xl text-center text-lg leading-relaxed md:text-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('subtitle')}
        </p>

        {/* Tagline */}
        <p
          className="mx-auto mb-8 max-w-lg text-center text-sm"
          style={{
            color: 'var(--text-secondary)',
            opacity: 0.55,
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '0.01em',
          }}
        >
          {t('tagline')}
        </p>

        {/* CTA */}
        <div className="mb-14 flex justify-center">
          <a href="#download" className="btn-primary px-8 py-3.5 text-base">
            {t('cta_download')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </div>

        {/* Carousel */}
        <HeroCarousel />
      </div>
    </section>
  )
}
