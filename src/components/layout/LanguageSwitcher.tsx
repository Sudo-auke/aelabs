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

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    segments[1] = next
    startTransition(() => router.replace(segments.join('/')))
  }

  return (
    <div
      className="flex items-center gap-px rounded-lg p-0.5"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          disabled={isPending || locale === code}
          aria-label={`Switch language to ${label}`}
          className="rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150"
          style={{
            background: locale === code ? '#0a84ff' : 'transparent',
            color: locale === code ? '#fff' : '#8e8e93',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
