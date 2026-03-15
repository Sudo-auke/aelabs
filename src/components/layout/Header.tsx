import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav')

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-content-primary">
            AE<span className="text-accent-primary">Labs</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href={`/${locale}/solutions`}
            className="text-sm text-content-secondary transition-colors hover:text-content-primary"
          >
            {t('solutions')}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="text-sm text-content-secondary transition-colors hover:text-content-primary"
          >
            {t('about')}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="text-sm text-content-secondary transition-colors hover:text-content-primary"
          >
            {t('contact')}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} />
          <Link href={`/${locale}/contact`} className="btn-primary hidden text-sm md:inline-flex">
            {t('contact')}
          </Link>
        </div>
      </div>
    </header>
  )
}
