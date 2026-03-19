'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2.5 py-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
      <span
        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: 'var(--accent-primary)' }}
        aria-hidden="true"
      />
      {text}
    </li>
  )
}

// ── Pro card with interest form ───────────────────────────────────────────────

function ProCard() {
  const tp = useTranslations('landing.pricing')
  const tpro = useTranslations('landing.pro')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'already'>('idle')
  const [email, setEmail] = useState('')
  const [proCount, setProCount] = useState<number | null>(null)

  useEffect(() => {
    if (localStorage.getItem('pro_interest_voted')) setStatus('already')
    fetch('/api/stats').then(r => r.json()).then(d => setProCount(d.proInterest ?? 0)).catch(() => {})
  }, [])

  async function handleInterest() {
    if (status !== 'idle') return
    setStatus('loading')
    try {
      const res = await fetch('/api/pro-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() || undefined }),
      })
      const data = await res.json()
      if (data.alreadyVoted) { setStatus('already'); localStorage.setItem('pro_interest_voted', '1'); return }
      setStatus('done')
      localStorage.setItem('pro_interest_voted', '1')
      setProCount(prev => (prev !== null ? prev + 1 : 1))
    } catch {
      setStatus('idle')
    }
  }

  const proFeatures = [
    tp('pro_f1'), tp('pro_f2'), tp('pro_f3'),
    tp('pro_f4'), tp('pro_f5'), tp('pro_f6'),
  ]

  return (
    <div
      className="overflow-hidden rounded-2xl text-left flex flex-col"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 shrink-0"
        style={{ background: 'linear-gradient(90deg, var(--accent-primary), #22D3EE)' }}
      />

      <div className="flex flex-1 flex-col p-8">
        {/* Pricing part */}
        <div>
          <h3 className="mb-2 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {tp('pro_name')}
          </h3>
          <div className="mb-1 flex items-baseline gap-2">
            <span
              className="text-4xl font-bold"
              style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono, monospace)' }}
            >
              {tp('pro_price')}
            </span>
          </div>
          <p className="mb-4 text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
            {tp('pro_note')}
          </p>
          <ul className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            {proFeatures.map(f => <FeatureItem key={f} text={f} />)}
          </ul>
        </div>

        {/* Divider */}
        <div className="my-6 border-t" style={{ borderColor: 'var(--border)' }} />

        {/* Interest form */}
        <div>
          <p className="mb-4 text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
            {tpro('subtitle')}
          </p>

          {status === 'idle' || status === 'loading' ? (
            <div>
              <div className="mb-2 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={tpro('email_placeholder')}
                  className="input flex-1 text-sm"
                />
                <button
                  onClick={handleInterest}
                  disabled={status === 'loading'}
                  className="btn-primary shrink-0"
                >
                  {status === 'loading' ? (
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : tpro('button')}
                </button>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {tpro('email_optional')}
              </p>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.2)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-sm font-medium" style={{ color: '#30D158' }}>
                {status === 'already' ? tpro('already_voted') : tpro('thanks')}
              </p>
            </div>
          )}

          {proCount !== null && proCount > 0 && (
            <p className="mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{proCount.toLocaleString()}</strong>
              {' '}{tpro('count_label')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Free card ─────────────────────────────────────────────────────────────────

function FreeCard() {
  const t = useTranslations('landing.pricing')

  const freeFeatures = [
    t('free_f1'), t('free_f2'), t('free_f3'),
    t('free_f4'), t('free_f5'), t('free_f6'),
  ]

  return (
    <div
      className="overflow-hidden rounded-2xl text-left"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className="p-8">
        <h3 className="mb-2 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {t('free_name')}
        </h3>
        <div className="mb-1 flex items-baseline gap-2">
          <span
            className="text-4xl font-bold"
            style={{ color: '#22D3EE', fontFamily: 'var(--font-mono, monospace)' }}
          >
            {t('free_price')}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('free_period')}
          </span>
        </div>
        <p className="mb-6 text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
          {t('free_note')}
        </p>
        <ul className="border-t pt-5" style={{ borderColor: 'var(--border)' }}>
          {freeFeatures.map(f => <FeatureItem key={f} text={f} />)}
        </ul>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function PricingSection() {
  const t = useTranslations('landing.pricing')

  return (
    <section
      id="pricing"
      className="section"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="container max-w-4xl text-center">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono, monospace)' }}
        >
          {t('eyebrow')}
        </p>
        <h2
          className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
        >
          {t('title')}
        </h2>
        <p
          className="mx-auto mb-14 max-w-lg text-base font-light leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('subtitle')}
        </p>

        <div className="grid gap-5 sm:grid-cols-2 mx-auto text-left">
          <FreeCard />
          <ProCard />
        </div>
      </div>
    </section>
  )
}
