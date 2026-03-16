'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function SolutionsPreview({ locale }: { locale: string }) {
  const t = useTranslations('home.solutions_preview')
  const items = t.raw('items') as Array<{ category: string; title: string; description: string }>

  return (
    <section className="section bg-background-alt">
      <div className="container">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="tracking-hero text-3xl font-bold text-content-primary sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-3 text-base text-content-secondary">{t('subtitle')}</p>
          </div>
          <Link
            href={`/${locale}/solutions`}
            className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent-primary transition-opacity hover:opacity-70"
          >
            {t('cta')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
            <Link
              href={`/${locale}/solutions`}
              className="group relative block overflow-hidden rounded-2xl border border-white/[0.07] bg-background p-8 transition-all duration-200 hover:border-white/[0.12] hover:bg-surface hover:scale-[1.02] hover:shadow-glow"
            >
              {/* Ligne cyan au hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-secondary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="mb-5 inline-block rounded-md border border-accent-secondary/15 bg-accent-secondary/8 px-2.5 py-1 text-xs font-semibold text-accent-secondary">
                {item.category}
              </span>

              <h3
                className="mb-3 text-lg font-bold text-content-primary transition-colors group-hover:text-accent-primary"
                style={{ letterSpacing: '-0.02em' }}
              >
                {item.title}
              </h3>

              <p className="text-sm leading-relaxed text-content-secondary">{item.description}</p>

              <span className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-accent-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                En savoir plus
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
