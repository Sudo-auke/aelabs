import { getTranslations } from 'next-intl/server'

export async function ManifestoSection() {
  const t = await getTranslations('landing.manifesto')

  return (
    <section className="relative py-24 text-center" style={{ borderTop: '1px solid var(--border)' }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px"
        style={{
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, var(--accent-primary), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="container max-w-4xl">
        <p
          className="text-xl md:text-2xl lg:text-[1.75rem] font-light leading-[1.8]"
          style={{ color: 'var(--text-secondary)' }}
        >
          {/* p1 */}
          {t('p1_a')}{' '}
          <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{t('p1_strong1')}</strong>
          {t('p1_b')}{' '}
          <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{t('p1_strong2')}</strong>
          {t('p1_c')}

          <br /><br />

          {/* p2 */}
          {t('p2_a')}{' '}
          <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>{t('p2_em1')}</span>
          {t('p2_b')}{' '}
          <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>{t('p2_em2')}</span>
          {t('p2_c')}{' '}
          <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>{t('p2_em3')}</span>{' '}
          {t('p2_d')}

          <br /><br />

          <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{t('p3')}</strong>
        </p>
      </div>
    </section>
  )
}
