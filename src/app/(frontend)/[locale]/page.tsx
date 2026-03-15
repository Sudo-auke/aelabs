import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home')

  return (
    <main className="min-h-screen">
      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-center text-5xl font-bold tracking-tight text-content-primary lg:text-7xl">
          {t('hero.title')}
        </h1>
        <p className="mt-6 max-w-2xl text-center text-lg text-content-secondary">
          {t('hero.subtitle')}
        </p>
        <a
          href="#contact"
          className="mt-10 inline-flex items-center rounded-full bg-accent-primary px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-primary/90 hover:shadow-[0_0_20px_rgba(10,132,255,0.4)]"
        >
          {t('hero.cta')}
        </a>
      </section>
    </main>
  )
}
