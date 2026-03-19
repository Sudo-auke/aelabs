import { useTranslations } from 'next-intl'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
}

interface BlogPreviewProps {
  posts: BlogPost[]
  locale: string
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return null
  }
}

export function BlogPreview({ posts, locale: _locale }: BlogPreviewProps) {
  const t = useTranslations('landing.blog')

  if (posts.length === 0) return null

  return (
    <section
      className="section"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="container max-w-3xl">
        <div className="mb-8">
          <h2
            className="text-2xl font-bold"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            {t('title')}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <div
              key={post.id}
              className="overflow-hidden rounded-xl p-5"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
              }}
            >
              {formatDate(post.publishedAt) && (
                <p className="mb-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(post.publishedAt)}
                </p>
              )}
              <h3
                className="mb-1.5 text-base font-semibold leading-snug"
                style={{ color: 'var(--text-primary)' }}
              >
                {post.title}
              </h3>
              {post.excerpt && (
                <p
                  className="line-clamp-2 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {post.excerpt}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
