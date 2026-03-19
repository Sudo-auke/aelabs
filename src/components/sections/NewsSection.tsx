import { useTranslations } from 'next-intl'

// ── Static article data — replace with CMS content when blog is re-enabled ───
const ARTICLES = [
  {
    id: 'can-dbc-arxml',
    tag: 'landing.news.article1.tag',
    title: 'landing.news.article1.title',
    excerpt: 'landing.news.article1.excerpt',
    date: 'landing.news.article1.date',
    readTime: 'landing.news.article1.read_time',
    accent: '#6366F1',
  },
  {
    id: 'can-ids-explained',
    tag: 'landing.news.article2.tag',
    title: 'landing.news.article2.title',
    excerpt: 'landing.news.article2.excerpt',
    date: 'landing.news.article2.date',
    readTime: 'landing.news.article2.read_time',
    accent: '#22D3EE',
  },
]

export function NewsSection() {
  const t = useTranslations()

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container max-w-3xl">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p
              className="mb-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent-primary)' }}
            >
              {t('landing.news.eyebrow')}
            </p>
            <h2
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              {t('landing.news.title')}
            </h2>
          </div>
        </div>

        {/* Article cards */}
        <div className="flex flex-col gap-5">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${article.accent}`,
              }}
            >
              {/* Tag + date row */}
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    background: `${article.accent}18`,
                    color: article.accent,
                    border: `1px solid ${article.accent}30`,
                  }}
                >
                  {t(article.tag)}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {t(article.date)}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  · {t(article.readTime)} {t('landing.news.min_read')}
                </span>
              </div>

              {/* Title */}
              <h3
                className="mb-2 text-base font-semibold leading-snug"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
              >
                {t(article.title)}
              </h3>

              {/* Excerpt */}
              <p
                className="line-clamp-3 text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t(article.excerpt)}
              </p>

              {/* "Coming soon" pill — blog pages not yet active */}
              <div className="mt-4">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: article.accent }}
                  />
                  {t('landing.news.coming_soon')}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
