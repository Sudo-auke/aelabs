import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface SolutionsPreviewProps {
  locale: string
}

export function SolutionsPreview({ locale }: SolutionsPreviewProps) {
  const t = useTranslations('home.solutions_preview')
  const items = t.raw('items') as Array<{ category: string; title: string; description: string }>

  return (
    <section className="section" style={{ background: '#0d0d14' }}>
      <div className="container">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className="text-3xl font-bold text-content-primary sm:text-4xl"
              style={{ letterSpacing: '-0.02em' }}
            >
              {t('title')}
            </h2>
            <p className="mt-3 text-base text-content-secondary">{t('subtitle')}</p>
          </div>
          <Link
            href={`/${locale}/solutions`}
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-primary transition-opacity hover:opacity-70"
          >
            {t('cta')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item, i) => (
            <Link
              key={i}
              href={`/${locale}/solutions`}
              className="group relative block overflow-hidden rounded-2xl p-8 transition-all duration-200 hover:bg-[#12121f]"
              style={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Cyan top line on hover */}
              <div
                className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(48,213,200,0.6), transparent)' }}
              />

              <span
                className="mb-5 inline-block rounded-md px-2.5 py-1 text-xs font-semibold text-accent-secondary"
                style={{ background: 'rgba(48,213,200,0.08)', border: '1px solid rgba(48,213,200,0.15)' }}
              >
                {item.category}
              </span>

              <h3
                className="mb-3 text-lg font-bold text-content-primary transition-colors group-hover:text-accent-primary"
                style={{ letterSpacing: '-0.01em' }}
              >
                {item.title}
              </h3>

              <p className="text-sm leading-relaxed text-content-secondary">{item.description}</p>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-accent-primary opacity-0 transition-all duration-200 group-hover:opacity-100">
                <span>En savoir plus</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
