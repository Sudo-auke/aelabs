'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

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

interface DownloadSectionProps {
  versions: SoftwareVersion[]
}

const PLATFORM_LABELS: Record<PlatformKey, { label: string; icon: React.ReactNode }> = {
  'macos-dmg': {
    label: 'macOS Universal (.dmg)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  'windows-exe': {
    label: 'Windows x64 Setup (.exe)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function DownloadSection({ versions }: DownloadSectionProps) {
  const t = useTranslations('landing.download')
  const [selectedVersion, setSelectedVersion] = useState<SoftwareVersion | null>(
    versions.length > 0 ? versions[0] : null
  )
  const [downloadCount, setDownloadCount] = useState<number | null>(null)
  const [downloading, setDownloading] = useState<PlatformKey | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => setDownloadCount(data.downloads ?? 0))
      .catch(() => {})
  }, [])

  async function handleDownload(file: SoftwareFile) {
    if (!selectedVersion) return
    setDownloading(file.platform)

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: file.platform,
          version: selectedVersion.version,
        }),
      })
      const data = await res.json()
      setDownloadCount(prev => (prev !== null ? prev + 1 : 1))

      if (data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer')
      }
    } catch {
      // silently fail — download still happened
    } finally {
      setDownloading(null)
    }
  }

  if (versions.length === 0) {
    return (
      <section id="download" className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container text-center">
          <p style={{ color: 'var(--text-secondary)' }}>No release available yet. Check back soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="download" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container max-w-3xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h2
            className="mb-3 text-3xl font-bold md:text-4xl"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            {t('title')}
          </h2>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            {t('subtitle')}
          </p>

          {/* Download counter */}
          {downloadCount !== null && (
            <div className="mt-4 flex justify-center">
              <span
                className="inline-flex items-center gap-1.5 text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {downloadCount.toLocaleString()}
                </strong>
                {' '}{t('downloads_count')}
              </span>
            </div>
          )}
        </div>

        {/* Version selector */}
        <div className="mb-6">
          <label className="label">{t('select_version')}</label>
          <div className="flex flex-wrap gap-2">
            {versions.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVersion(v)}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                style={{
                  background: selectedVersion?.id === v.id
                    ? 'var(--accent-primary)'
                    : 'var(--bg-secondary)',
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
            <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Released {formatDate(selectedVersion.releaseDate)}
            </p>
          )}
        </div>

        {/* Files */}
        {selectedVersion && (
          <div
            className="overflow-hidden rounded-xl"
            style={{ border: '1px solid var(--border)' }}
          >
            {selectedVersion.files.map((file, i) => {
              const meta = PLATFORM_LABELS[file.platform]
              return (
                <div
                  key={file.platform}
                  className="flex items-center justify-between gap-4 px-5 py-4"
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
                    className="btn-primary shrink-0 py-2 px-4 text-sm"
                    style={{ minWidth: '110px' }}
                  >
                    {downloading === file.platform ? (
                      <span className="flex items-center gap-1.5">
                        <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        {t('downloading')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

            {/* SHA note */}
            {selectedVersion.files.some(f => f.sha256) && (
              <div
                className="px-5 py-3"
                style={{
                  borderTop: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                }}
              >
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {t('sha_note')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
