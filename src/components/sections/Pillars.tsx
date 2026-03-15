import { useTranslations } from 'next-intl'

const icons = {
  chip: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M9 7V4M12 7V4M15 7V4M9 20v-3M12 20v-3M15 20v-3M7 9H4M7 12H4M7 15H4M20 9h-3M20 12h-3M20 15h-3" />
    </svg>
  ),
  tool: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  cpu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  ),
}

export function Pillars() {
  const t = useTranslations('home.pillars')
  const items = t.raw('items') as Array<{ icon: string; title: string; description: string }>

  return (
    <section className="section bg-background-alt">
      <div className="container">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <h2 className="tracking-hero text-3xl font-bold text-content-primary sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-content-secondary">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden bg-background-alt p-8 transition-colors duration-200 hover:bg-surface"
            >
              {/* Ligne du haut au hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-accent-primary/15 bg-accent-primary/10 text-accent-primary">
                {icons[item.icon as keyof typeof icons]}
              </div>

              <h3 className="mb-3 text-base font-semibold leading-snug text-content-primary" style={{ letterSpacing: '-0.01em' }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-content-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
