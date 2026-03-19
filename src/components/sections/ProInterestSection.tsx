'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const PRO_FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    key: 'edit',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    key: 'export',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="6" height="6" rx="1" />
        <rect x="9" y="3" width="6" height="6" rx="1" />
        <rect x="16" y="3" width="6" height="6" rx="1" />
        <rect x="2" y="15" width="6" height="6" rx="1" />
        <rect x="9" y="15" width="6" height="6" rx="1" />
        <rect x="16" y="15" width="6" height="6" rx="1" />
      </svg>
    ),
    key: 'batch',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    key: 'support',
  },
]

export function ProInterestSection() {
  const t = useTranslations('landing.pro')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'already'>('idle')
  const [email, setEmail] = useState('')
  const [proCount, setProCount] = useState<number | null>(null)

  useEffect(() => {
    // Check if already voted
    if (localStorage.getItem('pro_interest_voted')) {
      setStatus('already')
    }
    // Fetch count
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => setProCount(data.proInterest ?? 0))
      .catch(() => {})
  }, [])

  async function handleInterest() {
    if (status === 'loading' || status === 'done' || status === 'already') return
    setStatus('loading')

    try {
      const res = await fetch('/api/pro-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() || undefined }),
      })
      const data = await res.json()

      if (data.alreadyVoted) {
        setStatus('already')
        localStorage.setItem('pro_interest_voted', '1')
        return
      }

      setStatus('done')
      localStorage.setItem('pro_interest_voted', '1')
      setProCount(prev => (prev !== null ? prev + 1 : 1))
    } catch {
      setStatus('idle')
    }
  }

  return (
    <section
      className="section"
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
    >
      <div className="container max-w-3xl">
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Accent bar */}
          <div
            className="h-1"
            style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}
          />

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <span
                className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: 'rgba(99,102,241,0.10)',
                  color: 'var(--accent-primary)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                {t('badge')}
              </span>
              <h2
                className="mb-3 text-3xl font-bold md:text-4xl"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                {t('title')}
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>{t('subtitle')}</p>
            </div>

            {/* Features grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              {PRO_FEATURES.map(feature => (
                <div
                  key={feature.key}
                  className="flex items-start gap-3 rounded-lg p-4"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: 2 }}>
                    {feature.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {t(`features.${feature.key}.title`)}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {t(`features.${feature.key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interest form */}
            {status === 'idle' || status === 'loading' ? (
              <div>
                <div className="mb-3 flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('email_placeholder')}
                    className="input flex-1"
                    style={{ maxWidth: '280px' }}
                  />
                  <button
                    onClick={handleInterest}
                    disabled={status === 'loading'}
                    className="btn-primary shrink-0"
                  >
                    {status === 'loading' ? (
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    ) : (
                      t('button')
                    )}
                  </button>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {t('email_optional')}
                </p>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 rounded-lg px-4 py-3"
                style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.2)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-sm font-medium" style={{ color: '#30D158' }}>
                  {status === 'already' ? t('already_voted') : t('thanks')}
                </p>
              </div>
            )}

            {/* Social proof counter */}
            {proCount !== null && proCount > 0 && (
              <p className="mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{proCount.toLocaleString()}</strong>
                {' '}{t('count_label')}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
