import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'solutions',
      where: { slug: { equals: slug } },
      locale: locale as 'fr' | 'en' | 'de',
      limit: 1,
      depth: 0,
    })
    if (result.docs[0]) {
      const sol = result.docs[0] as unknown as { title: string }
      return { title: `${sol.title} — EMBDX` }
    }
  } catch {
    // fall through
  }
  return { title: 'EMBDX' }
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
  sizes?: {
    thumbnail?: { url?: string | null }
    card?: { url?: string | null }
    hero?: { url?: string | null }
  }
}

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  format?: number
  children?: LexicalNode[]
  listType?: string
  url?: string
  fields?: { url?: string; newTab?: boolean }
}

type SolutionDoc = {
  id: number | string
  title: string
  slug: string
  category?: string | null
  description?: { root?: LexicalNode } | null
  specifications?: Array<{ label?: string | null; value?: string | null }>
  features?: Array<{ icon?: string | null; title?: string | null; description?: string | null }>
  image?: MediaDoc | string | number | null
  datasheet?: MediaDoc | string | number | null
  certifications?: Array<{ name?: string | null }>
}

function getMediaUrl(
  media: MediaDoc | string | number | null | undefined,
): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as MediaDoc
  // Use original URL — resized variants may not exist if sharp didn't run
  return m.url ?? m.sizes?.hero?.url ?? m.sizes?.card?.url ?? null
}

function renderTextNode(node: LexicalNode): React.ReactNode {
  const text = node.text ?? ''
  if (!text) return null
  const format = node.format ?? 0
  let el: React.ReactNode = text
  if (format & 1) el = <strong key="b">{el}</strong>
  if (format & 2) el = <em key="i">{el}</em>
  if (format & 16) el = <code key="c" className="rounded bg-surface px-1 font-mono text-sm text-accent-secondary">{el}</code>
  return el
}

function renderNode(node: LexicalNode, idx: number): React.ReactNode {
  switch (node.type) {
    case 'text':
      return <span key={idx}>{renderTextNode(node)}</span>

    case 'linebreak':
      return <br key={idx} />

    case 'paragraph': {
      const children = (node.children ?? []).map((c, i) => renderNode(c, i))
      return (
        <p key={idx} className="mb-4 text-base leading-relaxed text-content-secondary last:mb-0">
          {children}
        </p>
      )
    }

    case 'heading': {
      const children = (node.children ?? []).map((c, i) => renderNode(c, i))
      const tag = node.tag ?? 'h2'
      const cls =
        tag === 'h2'
          ? 'mb-3 mt-6 text-xl font-bold text-content-primary'
          : 'mb-2 mt-4 text-lg font-semibold text-content-primary'
      return (
        <div key={idx} className={cls}>
          {children}
        </div>
      )
    }

    case 'list': {
      const items = (node.children ?? []).map((c, i) => renderNode(c, i))
      const isOrdered = node.listType === 'number'
      const Comp = isOrdered ? 'ol' : 'ul'
      return (
        <Comp
          key={idx}
          className={`mb-4 space-y-1 pl-5 text-content-secondary ${isOrdered ? 'list-decimal' : 'list-disc'}`}
        >
          {items}
        </Comp>
      )
    }

    case 'listitem': {
      const children = (node.children ?? []).map((c, i) => renderNode(c, i))
      return <li key={idx}>{children}</li>
    }

    case 'link': {
      const href = node.fields?.url ?? '#'
      const children = (node.children ?? []).map((c, i) => renderNode(c, i))
      return (
        <a key={idx} href={href} className="text-accent-primary underline hover:text-accent-secondary" target={node.fields?.newTab ? '_blank' : undefined} rel="noreferrer">
          {children}
        </a>
      )
    }

    default: {
      // pass-through for unknown nodes with children
      if (node.children) {
        return <span key={idx}>{node.children.map((c, i) => renderNode(c, i))}</span>
      }
      return null
    }
  }
}

function RichText({ root }: { root: LexicalNode | null | undefined }) {
  if (!root?.children) return null
  return <>{root.children.map((node, i) => renderNode(node, i))}</>
}

export default async function SolutionDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'solutions' })

  let solution: SolutionDoc | null = null

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'solutions',
      where: { slug: { equals: slug } },
      locale: locale as 'fr' | 'en' | 'de',
      depth: 1,
      limit: 1,
    })
    if (result.docs[0]) {
      solution = result.docs[0] as SolutionDoc
    }
  } catch {
    // fall through to 404
  }

  if (!solution) notFound()

  const heroUrl = getMediaUrl(solution.image)
  const datasheetUrl = getMediaUrl(solution.datasheet)
  const specs = (solution.specifications ?? []).filter((s) => s.label && s.value)
  const features = (solution.features ?? []).filter((f) => f.title)
  const certifications = (solution.certifications ?? []).map((c) => c.name).filter(Boolean) as string[]

  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-72 w-full overflow-hidden sm:h-96 lg:h-[460px]">
        {heroUrl && (
          <>
            <Image
              src={heroUrl}
              alt={solution.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
          </>
        )}
        {!heroUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-background-alt to-background" />
        )}

        {/* Title overlay — absolute positioned inside the hero */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container pb-8">
            <Link
              href={`/${locale}/solutions`}
              className="mb-5 inline-flex items-center gap-1.5 text-sm text-content-secondary transition-colors hover:text-content-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              {t('detail.back')}
            </Link>

            <span
              className={`mb-3 inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${categoryColors[solution.category ?? ''] ?? 'text-content-secondary border-white/10 bg-white/5'}`}
            >
              {t(`categories.${solution.category}`)}
            </span>

            <h1
              className="tracking-tightest mt-3 text-3xl font-bold text-content-primary sm:text-4xl lg:text-5xl"
            >
              {solution.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section pt-0">
        <div className="container">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              {solution.description?.root && (
                <div>
                  <RichText root={solution.description.root} />
                </div>
              )}

              {/* Features */}
              {features.length > 0 && (
                <div>
                  <h2 className="tracking-tightest mb-6 text-xl font-bold text-content-primary">
                    {t('detail.features')}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {features.map((feature, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/[0.07] bg-surface p-5"
                      >
                        {feature.icon && (
                          <div className="mb-3 text-xl">{feature.icon}</div>
                        )}
                        <h3 className="mb-1.5 font-semibold text-content-primary">
                          {feature.title}
                        </h3>
                        {feature.description && (
                          <p className="text-sm leading-relaxed text-content-secondary">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {specs.length > 0 && (
                <div>
                  <h2 className="tracking-tightest mb-6 text-xl font-bold text-content-primary">
                    {t('detail.specifications')}
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-white/[0.07]">
                    <table className="w-full text-sm">
                      <tbody>
                        {specs.map((spec, i) => (
                          <tr
                            key={i}
                            className={i % 2 === 0 ? 'bg-surface' : 'bg-background-alt'}
                          >
                            <td className="w-1/3 px-5 py-3.5 font-medium text-content-primary">
                              {spec.label}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-content-secondary">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Datasheet */}
              {datasheetUrl && (
                <div className="rounded-xl border border-white/[0.07] bg-surface p-6">
                  <a
                    href={datasheetUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="btn-accent inline-flex w-full justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {t('detail.datasheet')}
                  </a>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div className="rounded-xl border border-white/[0.07] bg-surface p-6">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-content-secondary">
                    {t('detail.certifications')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert) => (
                      <span
                        key={cert}
                        className="rounded-md border border-accent-secondary/20 bg-accent-secondary/10 px-2.5 py-1 text-xs font-medium text-accent-secondary"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact CTA */}
              <div className="rounded-xl border border-white/[0.07] bg-surface p-6 text-center">
                <p className="mb-1 font-semibold text-content-primary">{t('detail.contact_cta')}</p>
                <p className="mb-5 text-sm text-content-secondary">{t('detail.contact_subtitle')}</p>
                <Link href={`/${locale}/contact`} className="btn-secondary inline-flex w-full justify-center">
                  {t('cta_button')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
