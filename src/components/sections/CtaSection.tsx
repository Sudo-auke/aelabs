import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface CtaSectionProps {
  locale: string
}

export function CtaSection({ locale }: CtaSectionProps) {
  const t = useTranslations('home.cta_section')

  return (
    <section className="section bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-accent-primary/20 bg-surface p-12 text-center md:p-20">
          {/* Background glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary/8 blur-[80px]" />

          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-content-primary sm:text-4xl lg:text-5xl">
              {t('title')}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-content-secondary">{t('subtitle')}</p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href={`/${locale}/contact`} className="btn-primary px-10 py-4 text-base">
                {t('cta_primary')}
              </Link>
              <Link href={`/${locale}/solutions`} className="btn-secondary px-10 py-4 text-base">
                {t('cta_secondary')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
