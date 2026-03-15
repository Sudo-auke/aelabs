import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return {
    title: { default: t('title'), template: `%s | AE Labs` },
    description: t('description'),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'fr' | 'en' | 'de')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`dark ${inter.variable}`}>
      <body className="bg-[#0A0A0F] font-sans text-[#F5F5F7] antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
