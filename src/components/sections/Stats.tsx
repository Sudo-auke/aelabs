import { useTranslations } from 'next-intl'

export function Stats() {
  const t = useTranslations('home.stats')
  const items = t.raw('items') as Array<{ value: string; label: string }>

  return (
    <section className="section" style={{ background: '#0d0d14' }}>
      <div className="container">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center px-8 py-12 text-center"
              style={{
                background: '#0a0a0f',
                borderRight: i < items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : undefined,
              }}
            >
              <span
                className="text-gradient-blue text-4xl font-bold lg:text-5xl"
                style={{ letterSpacing: '-0.03em' }}
              >
                {item.value}
              </span>
              <span className="mt-3 text-xs font-medium uppercase tracking-wider text-content-secondary/70">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
