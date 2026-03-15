'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

const locales = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
]

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchLocale(nextLocale: string) {
    // Replace current locale prefix with new one
    const segments = pathname.split('/')
    segments[1] = nextLocale
    const newPath = segments.join('/')
    startTransition(() => {
      router.replace(newPath)
    })
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-surface px-1 py-1">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          disabled={isPending}
          aria-label={`Switch to ${label}`}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            locale === code
              ? 'bg-accent-primary text-white'
              : 'text-content-secondary hover:text-content-primary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
