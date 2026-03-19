import { getTranslations } from 'next-intl/server'

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconGrid() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18M9 3v18" />
    </svg>
  )
}

function IconBridge() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h4m8 0h4M12 4v4m0 8v4" />
      <circle cx="12" cy="12" r="3" />
      <path d="M8 8l-2-2m12 0l-2 2m0 8l2 2M8 16l-2 2" />
    </svg>
  )
}

function IconHW() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 6V4m4 2V4m4 2V4m4 2V4M6 18v2m4-2v2m4-2v2m4-2v2" />
    </svg>
  )
}

// ── Status badge styles ────────────────────────────────────────────────────────

type StatusType = 'beta' | 'dev' | 'design'

const STATUS_STYLES: Record<StatusType, { bg: string; color: string; border: string }> = {
  beta: {
    bg: 'rgba(34,211,238,0.10)',
    color: '#22D3EE',
    border: '1px solid rgba(34,211,238,0.2)',
  },
  dev: {
    bg: 'rgba(167,139,250,0.10)',
    color: '#A78BFA',
    border: '1px solid rgba(167,139,250,0.2)',
  },
  design: {
    bg: 'rgba(251,191,36,0.10)',
    color: '#FBBF24',
    border: '1px solid rgba(251,191,36,0.2)',
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

export async function ProductsSection() {
  const t = await getTranslations('landing.products')

  const PRODUCTS = [
    {
      id: 'bfr',
      statusType: 'beta' as StatusType,
      icon: <IconGrid />,
      iconBg: 'rgba(99,102,241,0.12)',
      iconColor: 'var(--accent-primary)',
      tags: ['DBC', 'ARXML', 'CAN / CAN FD', 'Free', 'Win / Mac / Linux'],
    },
    {
      id: 'obd',
      statusType: 'dev' as StatusType,
      icon: <IconBridge />,
      iconBg: 'rgba(167,139,250,0.12)',
      iconColor: '#A78BFA',
      tags: ['J2534', 'QUIC Tunnel', 'HW + SW', 'Full Rust'],
    },
    {
      id: 'autobridge',
      statusType: 'design' as StatusType,
      icon: <IconHW />,
      iconBg: 'rgba(34,211,238,0.10)',
      iconColor: '#22D3EE',
      tags: ['Hardware', 'Multi-bus', 'Modular', 'Pro-grade'],
    },
  ]

  return (
    <section
      id="products"
      className="section"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="container">

        {/* Header */}
        <div className="mb-12">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono, monospace)' }}
          >
            {t('eyebrow')}
          </p>
          <h2
            className="mb-3 text-3xl font-bold md:text-4xl lg:text-5xl"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            {t('title')}
          </h2>
          <p
            className="max-w-xl text-base font-light leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Products grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map(product => {
            const status = STATUS_STYLES[product.statusType]
            return (
              <div
                key={product.id}
                className="product-card relative overflow-hidden rounded-2xl p-6"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                }}
              >
                {/* Top gradient line on hover */}
                <div
                  className="card-top-line absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, var(--accent-primary), #22D3EE)' }}
                  aria-hidden="true"
                />

                {/* Icon */}
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: product.iconBg, color: product.iconColor }}
                >
                  {product.icon}
                </div>

                {/* Status badge */}
                <span
                  className="mb-4 inline-block rounded px-2 py-0.5 text-xs font-medium"
                  style={{
                    background: status.bg,
                    color: status.color,
                    border: status.border,
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  {t(`${product.id}.status` as Parameters<typeof t>[0])}
                </span>

                {/* Name */}
                <h3
                  className="mb-2 text-xl font-bold"
                  style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
                >
                  {t(`${product.id}.name` as Parameters<typeof t>[0])}
                </h3>

                {/* Description */}
                <p
                  className="mb-5 text-sm font-light leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t(`${product.id}.desc` as Parameters<typeof t>[0])}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded px-2 py-0.5 text-xs"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                        fontFamily: 'var(--font-mono, monospace)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
