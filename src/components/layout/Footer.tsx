import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#0d0d14', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="text-lg font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              AE<span className="text-accent-primary">Labs</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-content-secondary">
              {t('tagline')}
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-content-secondary/50">
              Navigation
            </p>
            <ul className="space-y-2.5">
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

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-content-secondary/50">
              Contact
            </p>
            <ul className="space-y-2.5 text-sm text-content-secondary">
              <li>contact@aelabs.com</li>
              <li>+33 1 23 45 67 89</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 pt-8 sm:flex-row"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-xs text-content-secondary/50">
            © {year} AE Labs. {t('rights')}.
          </p>
          <Link
            href={`/${locale}/legal`}
            className="text-xs text-content-secondary/50 transition-colors hover:text-content-secondary"
          >
            {t('links.legal')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
