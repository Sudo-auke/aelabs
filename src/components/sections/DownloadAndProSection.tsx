'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

// ── Types ─────────────────────────────────────────────────────────────────────

type PlatformKey = 'macos-dmg' | 'windows-exe' | 'windows-msi' | 'macos-tar'

interface SoftwareFile {
  platform: PlatformKey
  fileName: string
  fileSize: string
  downloadUrl: string
  sha256?: string
}

interface SoftwareVersion {
  id: string
  version: string
  releaseDate: string
  isActive: boolean
  files: SoftwareFile[]
}

interface Props {
  versions: SoftwareVersion[]
}

// ── Platform labels ────────────────────────────────────────────────────────────

const PLATFORM_LABELS: Record<PlatformKey, { label: string; icon: React.ReactNode }> = {
  'macos-dmg': {
    label: 'macOS Universal (.dmg)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  'windows-exe': {
    label: 'Windows x64 Setup (.exe)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  'windows-msi': {
    label: 'Windows x64 MSI (.msi)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  'macos-tar': {
    label: 'macOS App Archive (.app.tar.gz)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

// ── Download panel ─────────────────────────────────────────────────────────────

function DownloadPanel({ versions }: Props) {
  const t = useTranslations('landing.download')
  const [selectedVersion, setSelectedVersion] = useState<SoftwareVersion | null>(
    versions.length > 0 ? versions[0] : null
  )
  const [downloadCount, setDownloadCount] = useState<number | null>(null)
  const [downloading, setDownloading] = useState<PlatformKey | null>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => setDownloadCount(d.downloads ?? 0)).catch(() => {})
  }, [])

  async function handleDownload(file: SoftwareFile) {
    if (!selectedVersion) return
    setDownloading(file.platform)
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: file.platform, version: selectedVersion.version }),
      })
      const data = await res.json()
      setDownloadCount(prev => (prev !== null ? prev + 1 : 1))
      if (data.url) window.open(data.url, '_blank', 'noopener,noreferrer')
    } catch {
      // silently fail
    } finally {
      setDownloading(null)
    }
  }

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl p-10 text-center" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No release available yet. Check back soon.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h2 className="mb-2 text-2xl font-bold md:text-3xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('subtitle')}</p>
        {downloadCount !== null && (
          <div className="mt-3 flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <strong style={{ color: 'var(--text-primary)' }}>{downloadCount.toLocaleString()}</strong>
            {' '}{t('downloads_count')}
          </div>
        )}
      </div>

      {/* Version selector */}
      <div className="mb-5">
        <label className="label">{t('select_version')}</label>
        <div className="flex flex-wrap gap-2">
          {versions.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVersion(v)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
              style={{
                background: selectedVersion?.id === v.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: selectedVersion?.id === v.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${selectedVersion?.id === v.id ? 'var(--accent-primary)' : 'var(--border)'}`,
              }}
            >
              v{v.version}
              {v.id === versions[0].id && (
                <span
                  className="ml-1.5 rounded-full px-1.5 py-0.5 text-xs"
                  style={{
                    background: selectedVersion?.id === v.id ? 'rgba(255,255,255,0.25)' : 'rgba(99,102,241,0.15)',
                    color: selectedVersion?.id === v.id ? '#fff' : 'var(--accent-primary)',
                  }}
                >
                  latest
                </span>
              )}
            </button>
          ))}
        </div>
        {selectedVersion && (
          <p className="mt-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Released {formatDate(selectedVersion.releaseDate)}
          </p>
        )}
      </div>

      {/* Files list */}
      {selectedVersion && (
        <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)' }}>
          {selectedVersion.files.map((file, i) => {
            const meta = PLATFORM_LABELS[file.platform]
            return (
              <div
                key={file.platform}
                className="flex items-center justify-between gap-3 px-4 py-3.5"
                style={{
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                  background: 'var(--bg-surface)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: 'var(--text-secondary)' }}>{meta?.icon}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {meta?.label ?? file.platform}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {file.fileName}
                      {file.fileSize && <span className="ml-2 opacity-60">{file.fileSize}</span>}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(file)}
                  disabled={downloading === file.platform}
                  className="btn-primary shrink-0 py-1.5 px-3 text-sm"
                  style={{ minWidth: '100px' }}
                >
                  {downloading === file.platform ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      {t('downloading')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      {t('download_button')}
                    </span>
                  )}
                </button>
              </div>
            )
          })}
          {selectedVersion.files.some(f => f.sha256) && (
            <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('sha_note')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Pro interest panel ─────────────────────────────────────────────────────────

const PRO_FEATURES = [
  { key: 'edit',    titleKey: 'features.edit.title',    descKey: 'features.edit.description'    },
  { key: 'export',  titleKey: 'features.export.title',  descKey: 'features.export.description'  },
  { key: 'batch',   titleKey: 'features.batch.title',   descKey: 'features.batch.description'   },
  { key: 'support', titleKey: 'features.support.title', descKey: 'features.support.description' },
] as const

function ProPanel() {
  const t = useTranslations('landing.pro')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'already'>('idle')
  const [email, setEmail] = useState('')
  const [proCount, setProCount] = useState<number | null>(null)

  useEffect(() => {
    if (localStorage.getItem('pro_interest_voted')) setStatus('already')
    fetch('/api/stats').then(r => r.json()).then(d => setProCount(d.proInterest ?? 0)).catch(() => {})
  }, [])

  async function handleInterest() {
    if (status !== 'idle') return
    setStatus('loading')
    try {
      const res = await fetch('/api/pro-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() || undefined }),
      })
      const data = await res.json()
      if (data.alreadyVoted) { setStatus('already'); localStorage.setItem('pro_interest_voted', '1'); return }
      setStatus('done')
      localStorage.setItem('pro_interest_voted', '1')
      setProCount(prev => (prev !== null ? prev + 1 : 1))
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div
      className="h-full overflow-hidden rounded-2xl"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Accent top bar */}
      <div
        className="h-0.5"
        style={{ background: 'linear-gradient(90deg, var(--accent-primary), #22D3EE)' }}
      />

      <div className="p-7">
        {/* Badge + title */}
        <span
          className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: 'rgba(99,102,241,0.10)', color: 'var(--accent-primary)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          {t('badge')}
        </span>
        <h2
          className="mb-2 text-2xl font-bold md:text-3xl"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
        >
          {t('title')}
        </h2>
        <p className="mb-7 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>

        {/* Feature tiles */}
        <div className="mb-7 grid gap-3 sm:grid-cols-2">
          {PRO_FEATURES.map(f => (
            <div
              key={f.key}
              className="rounded-xl p-4"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <p className="mb-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {t(f.titleKey)}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {t(f.descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Form */}
        {status === 'idle' || status === 'loading' ? (
          <div>
            <div className="mb-3 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('email_placeholder')}
                className="input flex-1"
                style={{ maxWidth: '260px' }}
              />
              <button
                onClick={handleInterest}
                disabled={status === 'loading'}
                className="btn-primary shrink-0"
              >
                {status === 'loading' ? (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : t('button')}
              </button>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('email_optional')}</p>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3"
            style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.2)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-sm font-medium" style={{ color: '#30D158' }}>
              {status === 'already' ? t('already_voted') : t('thanks')}
            </p>
          </div>
        )}

        {/* Counter */}
        {proCount !== null && proCount > 0 && (
          <p className="mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{proCount.toLocaleString()}</strong>
            {' '}{t('count_label')}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Combined section ───────────────────────────────────────────────────────────

export function DownloadAndProSection({ versions }: Props) {
  return (
    <section
      id="download"
      className="section"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="container max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <DownloadPanel versions={versions} />
          <ProPanel />
        </div>
      </div>
    </section>
  )
}
