import { useTranslations } from 'next-intl'

export function Stats() {
  const t = useTranslations('home.stats')
  const items = t.raw('items') as Array<{ value: string; label: string }>

  return (
    <section className="section bg-background">
      <div className="container">
        <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.15em] text-content-secondary/50">
          {t('title')}
        </p>

        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center bg-background px-8 py-14 text-center"
              style={{ borderRight: i < items.length - 1 ? '1px solid rgba(255,255,255,0.07)' : undefined }}
            >
              <span className="text-gradient-blue tracking-hero text-4xl font-bold lg:text-5xl">
                {item.value}
              </span>
              <span className="mt-3 text-xs font-medium uppercase tracking-wider text-content-secondary/60">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
