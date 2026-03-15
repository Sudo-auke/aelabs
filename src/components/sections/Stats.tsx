import { useTranslations } from 'next-intl'

export function Stats() {
  const t = useTranslations('home.stats')
  const items = t.raw('items') as Array<{ value: string; label: string }>

  return (
    <section className="section bg-background">
      <div className="container">
        <p className="mb-12 text-center text-xs font-semibold uppercase tracking-widest text-content-secondary">
          {t('title')}
        </p>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center bg-surface px-6 py-12 text-center">
              <span className="text-4xl font-bold tracking-tight text-accent-primary lg:text-5xl">
                {item.value}
              </span>
              <span className="mt-3 text-sm text-content-secondary">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
