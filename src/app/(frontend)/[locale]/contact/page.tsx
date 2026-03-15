import { ContactForm } from '@/components/sections/ContactForm'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('title') }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  const tInfo = await getTranslations({ locale, namespace: 'contact.info' })

  return (
    <main className="min-h-screen pt-24">
      {/* Hero */}
      <section className="section pb-0">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1
              className="text-4xl font-bold text-content-primary sm:text-5xl"
              style={{ letterSpacing: '-0.02em' }}
            >
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-content-secondary">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5">
            {/* Infos latérales */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  label: 'Email',
                  value: tInfo('email'),
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                  label: 'Téléphone',
                  value: tInfo('phone'),
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  label: 'Adresse',
                  value: tInfo('address'),
                },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-xl p-5"
                  style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg text-accent-primary"
                    style={{ background: 'rgba(10,132,255,0.1)' }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-content-secondary/60 uppercase tracking-wider">{label}</p>
                    <p className="mt-1 text-sm font-medium text-content-primary">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
