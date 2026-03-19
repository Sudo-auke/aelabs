import { getTranslations } from 'next-intl/server'

// ── Bit Layout visual ─────────────────────────────────────────────────────────

const BIT_ROWS = [
  ['RPM','RPM','RPM','RPM','TPS','TPS','TPS','TPS'],
  ['RPM','RPM','RPM','RPM','CLT','CLT','CLT','CLT'],
  ['CLT','CLT','CLT','CLT','MAP','MAP','MAP','MAP'],
  ['MAP','MAP','MAP','MAP','','','',''],
]

const SIGNAL_COLORS: Record<string, { bg: string; text: string }> = {
  RPM: { bg: 'rgba(99,102,241,0.35)',  text: 'rgba(255,255,255,0.85)' },
  TPS: { bg: 'rgba(34,211,238,0.30)',  text: 'rgba(255,255,255,0.85)' },
  CLT: { bg: 'rgba(167,139,250,0.30)', text: 'rgba(255,255,255,0.85)' },
  MAP: { bg: 'rgba(251,191,36,0.28)',  text: 'rgba(255,255,255,0.85)' },
  '':  { bg: 'rgba(255,255,255,0.03)', text: 'transparent'            },
}

function BitLayoutVisual() {
  return (
    <div
      className="w-full overflow-hidden rounded-xl p-5"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        fontFamily: 'var(--font-mono, monospace)',
      }}
    >
      {/* Frame label */}
      <p className="mb-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
        0x100 EngineControl — 8 bytes
      </p>

      {/* Bit numbers header */}
      <div className="mb-1 grid grid-cols-8 gap-0.5 text-center">
        {[7,6,5,4,3,2,1,0].map(n => (
          <span key={n} className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
            {n}
          </span>
        ))}
      </div>

      {/* Bit grid */}
      <div className="flex flex-col gap-0.5">
        {BIT_ROWS.map((row, ri) => (
          <div key={ri} className="grid grid-cols-8 gap-0.5">
            {row.map((cell, ci) => {
              const colors = SIGNAL_COLORS[cell] ?? SIGNAL_COLORS['']
              return (
                <div
                  key={ci}
                  className="flex h-7 items-center justify-center rounded-sm text-xs font-medium"
                  style={{ background: colors.bg, color: colors.text, fontSize: '0.55rem' }}
                >
                  {cell}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3">
        {[
          { label: 'EngineRPM [12b]',    color: 'rgba(99,102,241,0.5)'  },
          { label: 'ThrottlePos [8b]',   color: 'rgba(34,211,238,0.45)' },
          { label: 'CoolantTemp [12b]',  color: 'rgba(167,139,250,0.45)'},
          { label: 'ManifoldPress [12b]',color: 'rgba(251,191,36,0.4)'  },
        ].map(({ label, color }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--text-secondary)', fontSize: '0.6rem' }}
          >
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: color }}
              aria-hidden="true"
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Multi-format visual ───────────────────────────────────────────────────────

function FormatListVisual() {
  const formats = [
    { ext: '.dbc',   desc: 'CAN / CAN FD database',                status: 'Free',        statusColor: '#22D3EE',  statusBg: 'rgba(34,211,238,0.08)',   extColor: 'var(--accent-primary)' },
    { ext: '.arxml', desc: 'AUTOSAR 4.x & 3.x system description', status: 'Pro',         statusColor: '#A78BFA',  statusBg: 'rgba(167,139,250,0.06)',  extColor: '#A78BFA'               },
    { ext: '.fibex', desc: 'FlexRay & Ethernet (ASAM FIBEX)',       status: 'Pro',         statusColor: '#A78BFA',  statusBg: 'rgba(167,139,250,0.04)',  extColor: '#A78BFA'               },
    { ext: '.ldf',   desc: 'LIN 2.x description file',             status: 'Pro',         statusColor: '#A78BFA',  statusBg: 'rgba(167,139,250,0.04)',  extColor: '#A78BFA'               },
  ]

  return (
    <div
      className="w-full overflow-hidden rounded-xl"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        fontFamily: 'var(--font-mono, monospace)',
      }}
    >
      {formats.map((f, i) => (
        <div
          key={f.ext}
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: f.statusBg,
            borderBottom: i < formats.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <span
            className="w-14 text-sm font-semibold shrink-0"
            style={{ color: f.extColor ?? 'var(--text-secondary)' }}
          >
            {f.ext}
          </span>
          <span className="flex-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {f.desc}
          </span>
          <span
            className="rounded px-2 py-0.5 text-xs font-medium shrink-0"
            style={{
              color: f.statusColor ?? 'var(--text-secondary)',
              background: f.statusBg,
              border: `1px solid ${f.statusColor ? f.statusColor + '33' : 'var(--border)'}`,
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            {f.status}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Feature row ───────────────────────────────────────────────────────────────

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map(item => (
        <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span
            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: 'var(--accent-primary)' }}
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export async function BusFileReaderFeatures() {
  const t = await getTranslations('landing.bfr_features')

  return (
    <section
      id="features"
      className="section"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="container">

        {/* Header */}
        <div className="mb-16">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono, monospace)' }}
          >
            {t('eyebrow')}
          </p>
          <h2
            className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
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

        {/* Feature 1 — Bit Layout */}
        <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <BitLayoutVisual />
          <div>
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono, monospace)' }}
            >
              {t('bit_label')}
            </p>
            <h3
              className="mb-3 text-2xl font-bold md:text-3xl"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              {t('bit_title')}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('bit_desc')}
            </p>
            <FeatureList items={[t('bit_feat1'), t('bit_feat2'), t('bit_feat3'), t('bit_feat4')]} />
          </div>
        </div>

        {/* Feature 2 — Multi-format (reversed) */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="lg:order-last">
            <FormatListVisual />
          </div>
          <div>
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono, monospace)' }}
            >
              {t('fmt_label')}
            </p>
            <h3
              className="mb-3 text-2xl font-bold md:text-3xl"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              {t('fmt_title')}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('fmt_desc')}
            </p>
            <FeatureList items={[t('fmt_feat1'), t('fmt_feat2'), t('fmt_feat3'), t('fmt_feat4')]} />
          </div>
        </div>

      </div>
    </section>
  )
}
