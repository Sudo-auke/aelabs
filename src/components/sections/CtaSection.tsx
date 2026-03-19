import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function CtaSection({ locale }: { locale: string }) {
  const t = useTranslations('home.cta_section')

  return (
    <section className="section bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface px-8 py-20 text-center">
          {/* Halo bleu en haut */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: 700,
              height: 280,
              background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 70%)',
            }}
          />
          {/* Ligne supérieure */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent" />

          <div className="relative z-10">
            <h2
              className="tracking-hero mx-auto max-w-2xl text-3xl font-bold text-content-primary sm:text-4xl lg:text-5xl"
            >
              {t('title')}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base text-content-secondary">{t('subtitle')}</p>

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
