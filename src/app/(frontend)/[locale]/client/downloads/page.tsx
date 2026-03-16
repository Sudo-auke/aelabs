import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'client.downloads' })
  return { title: t('title') }
}

type SolutionDoc = {
  title?: string | null
  slug?: string | null
}

type DownloadDoc = {
  id: number | string
  name: string
  version: string
  url?: string | null
  filename?: string | null
  releaseDate?: string | null
  solution?: SolutionDoc | string | number | null
}

function formatDate(dateStr: string | null | undefined, locale: string): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}


export default async function DownloadsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'client.downloads' })

  let downloads: DownloadDoc[] = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'downloads',
      locale: locale as 'fr' | 'en' | 'de',
      depth: 1,
      limit: 100,
      sort: '-releaseDate',
    })
    downloads = result.docs as DownloadDoc[]
  } catch {
    // fall through to empty state
  }

  return (
    <main className="min-h-screen pt-28">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-3 flex items-center gap-3">
            <Link
              href={`/${locale}/client`}
              className="flex items-center gap-1.5 text-sm text-content-secondary transition-colors hover:text-content-primary"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Dashboard
            </Link>
          </div>

          <h1 className="tracking-tightest mb-2 text-3xl font-bold text-content-primary sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mb-10 text-base text-content-secondary">{t('subtitle')}</p>

          {downloads.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-surface p-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-content-secondary">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <p className="font-medium text-content-primary">{t('empty')}</p>
              <p className="mt-1 text-sm text-content-secondary">{t('empty_subtitle')}</p>
              <Link href={`/${locale}/contact`} className="btn-secondary mt-6 inline-flex">
                Contacter
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {downloads.map((dl) => {
                const fileUrl = dl.url ?? null
                const solution = dl.solution && typeof dl.solution === 'object'
                  ? (dl.solution as SolutionDoc)
                  : null

                return (
                  <div
                    key={dl.id}
                    className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-content-primary">{dl.name}</span>
                        <span className="rounded-md border border-white/[0.08] bg-background px-2 py-0.5 font-mono text-xs text-content-secondary">
                          v{dl.version}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-content-secondary">
                        {solution?.title && (
                          <span className="flex items-center gap-1">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                            {solution.title}
                          </span>
                        )}
                        {dl.releaseDate && (
                          <span className="flex items-center gap-1">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {formatDate(dl.releaseDate, locale)}
                          </span>
                        )}
                      </div>
                    </div>

                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="btn-accent inline-flex shrink-0 items-center gap-2 text-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        {t('download')}
                      </a>
                    ) : (
                      <span className="text-xs text-content-secondary">—</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
