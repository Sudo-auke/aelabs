'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'

interface HeaderProps {
  locale: string
  isAuthenticated: boolean
}

export function Header({ locale, isAuthenticated }: HeaderProps) {
  const t = useTranslations('nav')
  const tc = useTranslations('client.nav')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = `/${locale}`
  }

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
        <Link href={`/${locale}`} className="flex items-center gap-1">
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

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-surface px-3 py-1.5 text-sm text-content-secondary transition-colors hover:border-white/[0.15] hover:text-content-primary"
              >
                {/* User icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <span className="hidden sm:inline">{tc('account')}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-surface shadow-glow">
                  <Link
                    href={`/${locale}/client`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-content-secondary transition-colors hover:bg-white/5 hover:text-content-primary"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    href={`/${locale}/client/downloads`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-content-secondary transition-colors hover:bg-white/5 hover:text-content-primary"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Téléchargements
                  </Link>
                  <div className="mx-4 border-t border-white/[0.06]" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-content-secondary transition-colors hover:bg-white/5 hover:text-red-400"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    {tc('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={`/${locale}/client/login`}
              className="hidden items-center gap-1.5 rounded-lg border border-white/[0.08] bg-surface px-3 py-1.5 text-sm text-content-secondary transition-colors hover:border-white/[0.15] hover:text-content-primary md:flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              {tc('client')}
            </Link>
          )}

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
