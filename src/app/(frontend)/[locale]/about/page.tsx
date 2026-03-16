import { getTranslations, setRequestLocale } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('title') }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'about' })

  const values = t.raw('values') as Array<{ title: string; description: string }>
  const team = t.raw('team') as Array<{ name: string; role: string; bio: string }>
  const certifications = t.raw('certifications') as string[]

  return (
    <main className="min-h-screen pt-24">
      {/* Hero */}
      <section className="section pb-0">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1
              className="tracking-tightest text-4xl font-bold text-content-primary sm:text-5xl"
            >
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-content-secondary">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-white/[0.07] bg-surface p-10">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-accent-primary">
                {t('mission_title')}
              </h2>
              <p className="text-lg leading-relaxed text-content-secondary">
                {t('mission_body')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section pt-0">
        <div className="container">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
            {values.map((v, i) => (
              <div
                key={i}
                className="group relative overflow-hidden bg-background p-8 transition-colors hover:bg-surface"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-secondary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mb-3 text-2xl font-bold tracking-tightest text-accent-secondary">
                  0{i + 1}
                </div>
                <h3 className="mb-2 text-base font-semibold text-content-primary">{v.title}</h3>
                <p className="text-sm leading-relaxed text-content-secondary">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section pt-0">
        <div className="container">
          <h2
            className="tracking-tightest mb-10 text-center text-2xl font-bold text-content-primary sm:text-3xl"
          >
            {t('team_title')}
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-white/[0.07] bg-surface p-6"
              >
                {/* Avatar placeholder */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary/10 text-sm font-bold text-accent-primary border border-accent-primary/20">
                  {member.name.charAt(0)}
                </div>
                <p className="font-semibold text-content-primary" style={{ letterSpacing: '-0.01em' }}>
                  {member.name}
                </p>
                <p className="mt-0.5 text-xs font-medium text-accent-secondary">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-content-secondary">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section pt-0">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-sm font-semibold uppercase tracking-[0.12em] text-content-secondary/50">
              {t('certifications_title')}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {certifications.map((cert) => (
                <span
                  key={cert}
                  className="rounded-lg border border-white/[0.08] bg-surface px-4 py-2 text-sm font-semibold text-content-primary"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
