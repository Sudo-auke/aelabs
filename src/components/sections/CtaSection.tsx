import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface CtaSectionProps {
  locale: string
}

export function CtaSection({ locale }: CtaSectionProps) {
  const t = useTranslations('home.cta_section')

  return (
    <section className="section" style={{ background: '#0d0d14' }}>
      <div className="container">
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-16 text-center md:py-24"
          style={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Background glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: '600px',
              height: '300px',
              background: 'radial-gradient(ellipse at top, rgba(10,132,255,0.1) 0%, transparent 70%)',
            }}
          />

          {/* Top border gradient */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(10,132,255,0.4), transparent)' }}
          />

          <div className="relative z-10">
            <h2
              className="mx-auto max-w-2xl text-3xl font-bold text-content-primary sm:text-4xl lg:text-5xl"
              style={{ letterSpacing: '-0.02em' }}
            >
              {t('title')}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-content-secondary">{t('subtitle')}</p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href={`/${locale}/contact`} className="btn-primary px-8 py-3">
                {t('cta_primary')}
              </Link>
              <Link href={`/${locale}/solutions`} className="btn-secondary px-8 py-3">
                {t('cta_secondary')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
