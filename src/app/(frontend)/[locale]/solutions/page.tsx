import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'solutions' })
  return { title: t('title') }
}

const categoryColors: Record<string, string> = {
  'embedded-software': 'text-accent-primary border-accent-primary/20 bg-accent-primary/10',
  'engineering-tools': 'text-accent-secondary border-accent-secondary/20 bg-accent-secondary/10',
  hardware: 'text-purple-400 border-purple-400/20 bg-purple-400/10',
}

type MediaDoc = {
  url?: string | null
  filename?: string | null
  width?: number | null
  height?: number | null
  sizes?: { card?: { url?: string | null }; thumbnail?: { url?: string | null } }
}

type SolutionDoc = {
  id: number | string
  title: string
  slug: string
  category?: string | null
  description?: unknown
  image?: MediaDoc | string | number | null
  certifications?: Array<{ name?: string | null }>
}

function extractText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as Record<string, unknown>
  if (n.text && typeof n.text === 'string') return n.text
  const children = n.children as unknown[] | undefined
  if (!children) return ''
  return children.map(extractText).join('')
}

function getImageUrl(image: MediaDoc | string | number | null | undefined): string | null {
  if (!image || typeof image !== 'object') return null
  const m = image as MediaDoc
  // Prefer original URL; fall back to card size if available
  return m.url ?? m.sizes?.card?.url ?? null
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'solutions' })

  let solutions: SolutionDoc[] = []
  let fromCMS = false

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'solutions',
      where: { published: { equals: true } },
      locale: locale as 'fr' | 'en' | 'de',
      depth: 1,
      limit: 100,
    })
    if (result.docs.length > 0) {
      solutions = result.docs as SolutionDoc[]
      fromCMS = true
    }
  } catch {
    // fall through to static data
  }

  // Static fallback from translations
  const staticItems = !fromCMS
    ? (t.raw('items') as Array<{
        category: string
        title: string
        description: string
        tags: string[]
      }>)
    : []

  return (
    <main className="min-h-screen pt-24">
      {/* Hero */}
      <section className="section pb-0">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="tracking-tightest text-4xl font-bold text-content-primary sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-content-secondary">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fromCMS
              ? solutions.map((sol) => {
                  const imgUrl = getImageUrl(sol.image)
                  const description = extractText(
                    (sol.description as { root?: unknown } | null)?.root,
                  ).slice(0, 160)
                  const tags = (sol.certifications ?? [])
                    .map((c) => c.name)
                    .filter(Boolean) as string[]

                  return (
                    <Link
                      key={sol.id}
                      href={`/${locale}/solutions/${sol.slug}`}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-surface transition-all duration-200 hover:border-white/[0.12] hover:scale-[1.02] hover:shadow-glow"
                    >
                      {/* Image */}
                      {imgUrl && (
                        <div className="relative h-44 w-full overflow-hidden">
                          <Image
                            src={imgUrl}
                            alt={sol.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-6">
                        {/* Top accent line on hover */}
                        {!imgUrl && (
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        )}

                        {/* Category badge */}
                        <span
                          className={`mb-4 inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${categoryColors[sol.category ?? ''] ?? 'text-content-secondary border-white/10 bg-white/5'}`}
                        >
                          {t(`categories.${sol.category}`)}
                        </span>

                        <h3
                          className="mb-3 text-xl font-bold text-content-primary transition-colors group-hover:text-accent-primary"
                          style={{ letterSpacing: '-0.02em' }}
                        >
                          {sol.title}
                        </h3>

                        {description && (
                          <p className="flex-1 text-sm leading-relaxed text-content-secondary">
                            {description}
                            {description.length === 160 ? '…' : ''}
                          </p>
                        )}

                        {tags.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md border border-white/[0.07] bg-background px-2 py-0.5 text-xs font-mono text-content-secondary/70"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-5 flex items-center text-xs font-medium text-accent-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          Voir la solution →
                        </div>
                      </div>
                    </Link>
                  )
                })
              : staticItems.map((item) => (
                  <div
                    key={item.title}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-surface p-8 transition-all duration-200 hover:border-white/[0.12] hover:scale-[1.02] hover:shadow-glow"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span
                      className={`mb-5 inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${categoryColors[item.category] ?? 'text-content-secondary border-white/10 bg-white/5'}`}
                    >
                      {t(`categories.${item.category}`)}
                    </span>
                    <h3
                      className="mb-3 text-xl font-bold text-content-primary transition-colors group-hover:text-accent-primary"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      {item.title}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-content-secondary">
                      {item.description}
                    </p>
                    {item.tags?.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-white/[0.07] bg-background px-2 py-0.5 text-xs font-mono text-content-secondary/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section pt-0">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/[0.07] bg-surface p-10 text-center">
            <h2 className="tracking-tightest text-2xl font-bold text-content-primary sm:text-3xl">
              {t('cta_title')}
            </h2>
            <p className="mt-3 text-base text-content-secondary">{t('cta_subtitle')}</p>
            <Link href={`/${locale}/contact`} className="btn-accent mt-8 inline-flex">
              {t('cta_button')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
