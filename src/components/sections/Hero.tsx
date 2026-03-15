'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

interface HeroProps {
  locale: string
}

export function Hero({ locale }: HeroProps) {
  const t = useTranslations('home.hero')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let gsapModule: typeof import('gsap') | null = null

    import('gsap').then(({ gsap }) => {
      gsapModule = { gsap } as unknown as typeof import('gsap')
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from(badgeRef.current, { opacity: 0, y: 16, duration: 0.6 })
          .from(titleRef.current, { opacity: 0, y: 32, duration: 0.9 }, '-=0.3')
          .from(subtitleRef.current, { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
          .from(ctaRef.current, { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
      })

      return () => ctx.revert()
    })
  }, [])

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
      {/* Grid background */}
      <div className="bg-grid pointer-events-none absolute inset-0" />

      {/* Gradient fade edges */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #0a0a0f 100%)',
        }}
      />

      {/* Glow radial bleu */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(10,132,255,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: 'rgba(10,132,255,0.08)',
            border: '1px solid rgba(10,132,255,0.2)',
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
          <span className="text-xs font-medium tracking-wide text-accent-primary">{t('badge')}</span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-5xl font-bold leading-[1.1] tracking-tight text-content-primary sm:text-6xl lg:text-7xl"
          style={{ letterSpacing: '-0.02em' }}
        >
          {t('title')}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-content-secondary"
        >
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href={`/${locale}/solutions`} className="btn-primary px-8 py-3 text-sm">
            {t('cta_primary')}
          </Link>
          <Link href={`/${locale}/contact`} className="btn-secondary px-8 py-3 text-sm">
            {t('cta_secondary')}
          </Link>
        </div>

        {/* Trusted by */}
        <div className="mt-20">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.15em] text-content-secondary/40">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {['Stellantis', 'Bosch', 'Continental', 'Forvia', 'Valeo'].map((name) => (
              <span
                key={name}
                className="text-sm font-semibold tracking-wider"
                style={{ color: 'rgba(142,142,147,0.35)' }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div
          className="flex h-9 w-5 items-start justify-center rounded-full p-1"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="h-1.5 w-0.5 animate-bounce rounded-full bg-content-secondary/50" />
        </div>
      </div>
    </section>
  )
}
