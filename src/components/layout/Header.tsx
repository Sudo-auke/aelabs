'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10, 10, 15, 0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
      }}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-1 group">
          <span className="text-lg font-bold tracking-tight text-content-primary">
            AE<span className="text-accent-primary">Labs</span>
          </span>
        </Link>

        {/* Nav centre */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { key: 'solutions', href: `/${locale}/solutions` },
            { key: 'about', href: `/${locale}/about` },
            { key: 'contact', href: `/${locale}/contact` },
          ].map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="relative rounded-md px-3 py-2 text-sm text-content-secondary transition-colors hover:text-content-primary"
            >
              {t(key as 'solutions' | 'about' | 'contact')}
            </Link>
          ))}
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <Link
            href={`/${locale}/contact`}
            className="btn-primary hidden text-sm md:inline-flex"
          >
            {t('contact')}
          </Link>
        </div>
      </div>
    </header>
  )
}
