import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background-alt">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="text-2xl font-bold tracking-tight">
              AE<span className="text-accent-primary">Labs</span>
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-content-secondary">
              {t('tagline')}
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-content-secondary">
              Navigation
            </p>
            <ul className="space-y-3">
              {(['solutions', 'about', 'contact'] as const).map((key) => (
                <li key={key}>
                  <Link
                    href={`/${locale}/${key}`}
                    className="text-sm text-content-secondary transition-colors hover:text-content-primary"
                  >
                    {t(`links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-content-secondary">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-content-secondary">
              <li>contact@aelabs.com</li>
              <li>+33 1 23 45 67 89</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-content-secondary">
            © {year} AE Labs. {t('rights')}.
          </p>
          <Link
            href={`/${locale}/legal`}
            className="text-xs text-content-secondary transition-colors hover:text-content-primary"
          >
            {t('links.legal')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
