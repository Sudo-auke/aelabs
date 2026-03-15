'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export function Hero({ locale }: { locale: string }) {
  const t = useTranslations('home.hero')
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    import('gsap').then(({ gsap }) => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('[data-hero="badge"]',    { opacity: 0, y: 12, duration: 0.5 })
          .from('[data-hero="title"]',    { opacity: 0, y: 40, duration: 0.8 }, '-=0.2')
          .from('[data-hero="subtitle"]', { opacity: 0, y: 24, duration: 0.7 }, '-=0.5')
          .from('[data-hero="cta"]',      { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
          .from('[data-hero="logos"]',    { opacity: 0, duration: 0.6 }, '-=0.2')
      }, heroRef)

      return () => ctx.revert()
    })
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16"
    >
      {/* Grille visible */}
      <div className="bg-grid pointer-events-none absolute inset-0" />

      {/* Fondu radial pour masquer les bords de la grille */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, transparent 30%, #0A0A0F 100%)',
        }}
      />

      {/* Halo bleu central */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 900,
          height: 600,
          background:
            'radial-gradient(ellipse at center, rgba(10,132,255,0.11) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div
          data-hero="badge"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary/8 px-4 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
          <span className="text-xs font-semibold tracking-wide text-accent-primary">
            {t('badge')}
          </span>
        </div>

        {/* Titre — grand, serré */}
        <h1
          data-hero="title"
          className="tracking-hero text-5xl font-bold leading-[1.08] text-content-primary sm:text-6xl lg:text-[5rem]"
        >
          {t('title')}
        </h1>

        {/* Sous-titre */}
        <p
          data-hero="subtitle"
          className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-content-secondary"
        >
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div
          data-hero="cta"
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link href={`/${locale}/solutions`} className="btn-primary px-8 py-3">
            {t('cta_primary')}
          </Link>
          <Link href={`/${locale}/contact`} className="btn-secondary px-8 py-3">
            {t('cta_secondary')}
          </Link>
        </div>

        {/* Logos partenaires */}
        <div data-hero="logos" className="mt-20">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.14em] text-content-secondary/40">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-30">
            {['Stellantis', 'Bosch', 'Continental', 'Forvia', 'Valeo'].map((name) => (
              <span key={name} className="text-sm font-bold tracking-widest text-content-secondary">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Indicateur scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/10 p-1.5">
          <div className="h-1.5 w-0.5 animate-bounce rounded-full bg-content-secondary/40" />
        </div>
      </div>
    </section>
  )
}
