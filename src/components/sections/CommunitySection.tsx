import { getTranslations } from 'next-intl/server'

const CHANNELS = ['general', 'busfilereader', 'obd-bridge', 'feature-requests', 'bug-reports']

function DiscordIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
      <path d="M13.5 1C12.5 0.5 11.4 0.2 10.3 0c-.2.3-.3.6-.5.9C8.8.8 7.2.8 6.2.9 6 .6 5.9.3 5.7 0 4.6.2 3.5.5 2.5 1 .4 4.2-.2 7.2.1 10.2c1.2.9 2.3 1.4 3.4 1.8.3-.4.5-.8.7-1.2-.4-.1-.8-.3-1.1-.5.1-.1.2-.2.3-.2 2.2 1 4.6 1 6.8 0 .1.1.2.2.3.2-.4.2-.7.4-1.1.5.2.4.5.8.7 1.2 1.1-.3 2.2-.9 3.4-1.8.3-3.4-.5-6.3-2.6-7.2zM5.3 8.4c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.6 0 1.1.6 1.1 1.3S5.9 8.4 5.3 8.4zm5.4 0c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.6 0 1.1.6 1.1 1.3S11.3 8.4 10.7 8.4z" />
    </svg>
  )
}

export async function CommunitySection() {
  const t = await getTranslations('landing.community')

  const messages = [
    { authorKey: 'msg1_author', timeKey: 'msg1_time', contentKey: 'msg1_content', isTeam: true  },
    { authorKey: 'msg2_author', timeKey: 'msg2_time', contentKey: 'msg2_content', isTeam: false },
    { authorKey: 'msg3_author', timeKey: 'msg3_time', contentKey: 'msg3_content', isTeam: false },
    { authorKey: 'msg4_author', timeKey: 'msg4_time', contentKey: 'msg4_content', isTeam: true  },
  ] as const

  return (
    <section
      id="community"
      className="section"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="container max-w-3xl text-center">

        {/* Header */}
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono, monospace)' }}
        >
          {t('eyebrow')}
        </p>
        <h2
          className="mb-4 text-3xl font-bold md:text-4xl"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
        >
          {t('title')}
        </h2>
        <p
          className="mx-auto mb-10 max-w-lg text-base font-light"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('subtitle')}
        </p>

        {/* Discord mock embed */}
        <div
          className="relative overflow-hidden rounded-2xl text-left"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Left accent bar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5"
            style={{ background: 'var(--accent-primary)' }}
            aria-hidden="true"
          />

          {/* Channel list */}
          <div
            className="flex flex-wrap gap-4 px-6 py-4"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            {CHANNELS.map((ch, i) => (
              <span
                key={ch}
                className="flex items-center gap-1 text-xs"
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span style={{ opacity: 0.5 }}>#</span>{ch}
              </span>
            ))}
          </div>

          {/* Messages */}
          <div className="divide-y px-6" style={{ borderColor: 'var(--border)' }}>
            {messages.map(msg => (
              <div key={msg.authorKey} className="py-4">
                <div className="mb-1 flex items-baseline gap-2">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: msg.isTeam ? 'var(--accent-primary)' : '#22D3EE' }}
                  >
                    {t(msg.authorKey)}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                    {t(msg.timeKey)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {t(msg.contentKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA + coming soon badge */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href="#"
            className="btn-primary inline-flex items-center gap-2"
            aria-label={t('cta')}
          >
            <DiscordIcon size={16} />
            {t('cta')}
          </a>
          <span
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: '#22D3EE' }}
              aria-hidden="true"
            />
            {t('coming_label')}
          </span>
        </div>

      </div>
    </section>
  )
}
