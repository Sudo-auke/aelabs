import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface SolutionsPreviewProps {
  locale: string
}

export function SolutionsPreview({ locale }: SolutionsPreviewProps) {
  const t = useTranslations('home.solutions_preview')
  const items = t.raw('items') as Array<{ category: string; title: string; description: string }>

  return (
    <section className="section bg-background-alt">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-content-primary sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-base text-content-secondary">{t('subtitle')}</p>
          </div>
          <Link
            href={`/${locale}/solutions`}
            className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-accent-primary hover:underline"
          >
            {t('cta')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <Link
              key={i}
              href={`/${locale}/solutions`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:border-accent-secondary/40"
            >
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-secondary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="mb-4 inline-block rounded-full border border-accent-secondary/30 bg-accent-secondary/10 px-3 py-1 text-xs font-medium text-accent-secondary">
                {item.category}
              </span>
              <h3 className="mb-3 text-xl font-bold text-content-primary transition-colors group-hover:text-accent-primary">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-content-secondary">{item.description}</p>

              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-accent-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                <span>En savoir plus</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
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
