export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d0d14',
        color: '#f5f5f7',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, margin: 0 }}>404</h1>
        <p style={{ color: '#8e8e93', marginTop: '0.5rem' }}>Page not found</p>
        <a href="/admin" style={{ color: '#0a84ff', marginTop: '1rem', display: 'block' }}>
          Back to admin
        </a>
      </div>
    </div>
  )
}
