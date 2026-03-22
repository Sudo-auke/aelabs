'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useTheme } from './ThemeProvider'

interface HeaderProps {
  locale: string
}

// ── SVG flags (emoji flags don't render on Windows) ──────────────────────────
function FlagFR({ size = 20 }: { size?: number }) {
  const h = Math.round(size * 0.7)
  return (
    <svg width={size} height={h} viewBox="0 0 20 14" style={{ borderRadius: 2, display: 'block', flexShrink: 0 }}>
      <rect x="0"  y="0" width="7"  height="14" fill="#002395" />
      <rect x="7"  y="0" width="6"  height="14" fill="#EDEDED" />
      <rect x="13" y="0" width="7"  height="14" fill="#ED2939" />
    </svg>
  )
}

function FlagGB({ size = 20 }: { size?: number }) {
  const h = Math.round(size * 0.7)
  return (
    <svg width={size} height={h} viewBox="0 0 20 14" style={{ borderRadius: 2, display: 'block', flexShrink: 0 }}>
      <rect width="20" height="14" fill="#012169" />
      {/* Diagonal white stripes */}
      <path d="M0,0 L20,14 M20,0 L0,14" stroke="white" strokeWidth="3.5" />
      {/* Diagonal red stripes */}
      <path d="M0,0 L20,14 M20,0 L0,14" stroke="#C8102E" strokeWidth="1.8" />
      {/* White cross */}
      <rect x="8.5" y="0" width="3" height="14" fill="white" />
      <rect x="0" y="5.5" width="20" height="3" fill="white" />
      {/* Red cross */}
      <rect x="9.25" y="0" width="1.5" height="14" fill="#C8102E" />
      <rect x="0" y="6.25" width="20" height="1.5" fill="#C8102E" />
    </svg>
  )
}

function FlagDE({ size = 20 }: { size?: number }) {
  const h = Math.round(size * 0.7)
  return (
    <svg width={size} height={h} viewBox="0 0 20 14" style={{ borderRadius: 2, display: 'block', flexShrink: 0 }}>
      <rect x="0" y="0"    width="20" height="4.67" fill="#000000" />
      <rect x="0" y="4.67" width="20" height="4.66" fill="#DD0000" />
      <rect x="0" y="9.33" width="20" height="4.67" fill="#FFCE00" />
    </svg>
  )
}

const LOCALES = [
  { code: 'fr', label: 'FR', Flag: FlagFR },
  { code: 'en', label: 'EN', Flag: FlagGB },
  { code: 'de', label: 'DE', Flag: FlagDE },
] as const

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav')
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    segments[1] = next
    router.replace(segments.join('/'))
    setLangOpen(false)
    setMenuOpen(false)
  }

  const isDark = theme === 'dark'
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]
  const others = LOCALES.filter((l) => l.code !== locale)

  const headerBg = scrolled
    ? isDark ? 'rgba(10,10,15,0.88)' : 'rgba(255,255,255,0.88)'
    : 'transparent'
  const borderColor = scrolled
    ? isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
    : 'transparent'

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
      }}
    >
      <div className="container flex h-16 items-center gap-4">

        {/* Logo — left col */}
        <div className="flex-1 flex items-center">
          <Link href={`/${locale}`} className="flex items-center gap-1 shrink-0">
            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              EM<span style={{ color: 'var(--accent-primary)' }}>BDX</span>
            </span>
          </Link>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {[
            { key: 'products',  href: `/${locale}#products`   },
            { key: 'features',  href: `/${locale}#features`   },
            { key: 'pricing',   href: `/${locale}#pricing`    },
            { key: 'community', href: `/${locale}#community`  },
            { key: 'download',  href: `/${locale}#download`   },
          ].map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
            >
              {t(key as 'products' | 'features' | 'pricing' | 'community' | 'download')}
            </a>
          ))}
        </nav>

        {/* Right actions — right col */}
        <div className="flex-1 flex items-center justify-end gap-1">

          {/* Burger — mobile only */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ color: 'var(--text-secondary)' }}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          {/* Discord button */}
          <a
            href="#community"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
            style={{
              background: 'rgba(99,102,241,0.10)',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'rgba(99,102,241,0.18)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'rgba(99,102,241,0.10)'
            }}
          >
            <svg width="14" height="11" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
              <path d="M13.5 1C12.5 0.5 11.4 0.2 10.3 0c-.2.3-.3.6-.5.9C8.8.8 7.2.8 6.2.9 6 .6 5.9.3 5.7 0 4.6.2 3.5.5 2.5 1 .4 4.2-.2 7.2.1 10.2c1.2.9 2.3 1.4 3.4 1.8.3-.4.5-.8.7-1.2-.4-.1-.8-.3-1.1-.5.1-.1.2-.2.3-.2 2.2 1 4.6 1 6.8 0 .1.1.2.2.3.2-.4.2-.7.4-1.1.5.2.4.5.8.7 1.2 1.1-.3 2.2-.9 3.4-1.8.3-3.4-.5-6.3-2.6-7.2zM5.3 8.4c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.6 0 1.1.6 1.1 1.3S5.9 8.4 5.3 8.4zm5.4 0c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.6 0 1.1.6 1.1 1.3S11.3 8.4 10.7 8.4z"/>
            </svg>
            {t('discord')}
          </a>

          {/* Dark / light toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isDark ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Language switcher with SVG flags */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              aria-label={`Language: ${current.label}`}
              aria-expanded={langOpen}
              className="flex h-9 items-center gap-2 rounded-lg px-2.5 transition-colors"
              style={{
                background: langOpen ? 'var(--bg-secondary)' : 'transparent',
                border: langOpen ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              <current.Flag size={20} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', color: 'var(--text-secondary)' }}>
                {current.label}
              </span>
              <svg
                width="9" height="9" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{
                  color: 'var(--text-secondary)',
                  opacity: 0.5,
                  transition: 'transform 0.15s',
                  transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {langOpen && (
              <div
                className="absolute right-0 mt-1.5 overflow-hidden rounded-xl py-1"
                style={{
                  minWidth: '110px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {others.map(({ code, label, Flag }) => (
                  <button
                    key={code}
                    onClick={() => switchLocale(code)}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement
                      el.style.background = 'var(--bg-secondary)'
                      el.style.color = 'var(--text-primary)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement
                      el.style.background = 'transparent'
                      el.style.color = 'var(--text-secondary)'
                    }}
                  >
                    <Flag size={20} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em' }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'var(--bg-primary)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <nav className="container flex flex-col py-3">
            {[
              { key: 'products',  href: `/${locale}#products`   },
              { key: 'features',  href: `/${locale}#features`   },
              { key: 'pricing',   href: `/${locale}#pricing`    },
              { key: 'community', href: `/${locale}#community`  },
              { key: 'download',  href: `/${locale}#download`   },
            ].map(({ key, href }) => (
              <a
                key={key}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-2 py-3 text-sm font-medium border-b last:border-b-0"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'rgba(255,255,255,0.04)',
                }}
              >
                {t(key as 'products' | 'features' | 'pricing' | 'community' | 'download')}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
