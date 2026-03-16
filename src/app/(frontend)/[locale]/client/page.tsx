import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'client.dashboard' })
  return { title: t('title') }
}

export default async function ClientDashboardPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'client.dashboard' })

  let downloadCount = 0
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'downloads',
      limit: 0,
    })
    downloadCount = result.totalDocs
  } catch {
    // ignore
  }

  return (
    <main className="min-h-screen pt-28">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="tracking-tightest text-3xl font-bold text-content-primary sm:text-4xl">
              {t('title')}
            </h1>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Downloads card */}
            <Link
              href={`/${locale}/client/downloads`}
              className="group flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-surface p-7 transition-all duration-200 hover:border-white/[0.14] hover:shadow-glow"
            >
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-primary/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-accent-primary">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-content-primary">{downloadCount}</div>
                <div className="mt-1 text-sm text-content-secondary">{t('downloads_label')}</div>
              </div>
              <div className="mt-6 flex items-center text-sm font-medium text-accent-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {t('downloads_cta')} →
              </div>
            </Link>

            {/* Contact card */}
            <Link
              href={`/${locale}/contact`}
              className="group flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-surface p-7 transition-all duration-200 hover:border-white/[0.14]"
            >
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-secondary/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-accent-secondary">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-semibold text-content-primary">Support</div>
                <div className="mt-1 text-sm text-content-secondary">contact@aelabs.com</div>
              </div>
              <div className="mt-6 flex items-center text-sm font-medium text-accent-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Contacter le support →
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
