import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface HeroProps {
  locale: string
}

export function Hero({ locale }: HeroProps) {
  const t = useTranslations('home.hero')

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(44, 44, 62, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(44, 44, 62, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-primary/10 px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
          <span className="text-xs font-medium tracking-wide text-accent-primary">{t('badge')}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-content-primary sm:text-6xl lg:text-7xl">
          {t('title')}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-content-secondary">
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href={`/${locale}/contact`} className="btn-primary px-10 py-4 text-base">
            {t('cta_primary')}
          </Link>
          <Link href={`/${locale}/solutions`} className="btn-secondary px-10 py-4 text-base">
            {t('cta_secondary')}
          </Link>
        </div>

        {/* Trusted by strip */}
        <div className="mt-20">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-content-secondary/60">
            Trusted by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {['Stellantis', 'Bosch', 'Continental', 'Forvia', 'Valeo'].map((name) => (
              <span key={name} className="text-sm font-semibold tracking-wider text-content-secondary">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-content-secondary" />
        </div>
      </div>
    </section>
  )
}
