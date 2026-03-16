import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LoginForm } from './LoginForm'
import Link from 'next/link'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ redirect?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'client.login' })
  return { title: t('title') }
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { redirect } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'client.login' })

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-24">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-accent-primary/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href={`/${locale}`} className="inline-flex text-xl font-bold tracking-tight text-content-primary">
            AE<span className="text-accent-primary">Labs</span>
          </Link>
          <h1 className="tracking-tightest mt-6 text-2xl font-bold text-content-primary">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm text-content-secondary">{t('subtitle')}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-surface p-8">
          <LoginForm locale={locale} redirectTo={redirect} />
        </div>

        <div className="mt-6 space-y-3 text-center">
          <p className="text-sm text-content-secondary">
            Pas encore de compte ?{' '}
            <Link
              href={`/${locale}/contact`}
              className="text-accent-primary transition-colors hover:text-accent-primary/80"
            >
              Contactez-nous
            </Link>
          </p>
          <Link
            href={`/${locale}`}
            className="block text-sm text-content-secondary/60 transition-colors hover:text-content-secondary"
          >
            ← {t('back')}
          </Link>
        </div>
      </div>
    </main>
  )
}
