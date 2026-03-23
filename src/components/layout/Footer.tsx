export function Footer({ locale: _locale }: { locale: string }) {
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            EM<span style={{ color: 'var(--accent-primary)' }}>BDX</span>
            {' '}
            <span className="font-normal">— BusFileReader</span>
          </span>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
            © {year} EMBDX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
