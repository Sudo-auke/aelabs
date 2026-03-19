'use client'

// ── Mini UI cards that scroll infinitely inside the hero side panels ──────────

const LEFT_CARDS = [
  // Signals table
  <div key="signals" style={{ background: 'rgba(20,14,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', width: 220 }}>
    <p style={{ color: '#636366', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Signals — 0x100</p>
    {[
      { name: 'EngineRPM',    bits: '[0..11]',  factor: '0.25',  unit: 'rpm' },
      { name: 'ThrottlePos',  bits: '[12..19]', factor: '0.4',   unit: '%'   },
      { name: 'CoolantTemp',  bits: '[20..31]', factor: '0.01',  unit: '°C'  },
      { name: 'ManifoldPres', bits: '[32..43]', factor: '0.1',   unit: 'kPa' },
    ].map(s => (
      <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ color: '#AEAEB2', fontSize: '0.65rem', fontFamily: 'monospace' }}>{s.name}</span>
        <span style={{ color: '#6366F1', fontSize: '0.6rem', fontFamily: 'monospace' }}>{s.bits}</span>
        <span style={{ color: '#30D5C8', fontSize: '0.6rem' }}>{s.factor} {s.unit}</span>
      </div>
    ))}
  </div>,

  // ECU tree
  <div key="ecu" style={{ background: 'rgba(20,14,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', width: 220 }}>
    <p style={{ color: '#636366', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>ECU Nodes</p>
    {[
      { name: 'ECM',  frames: 6, color: '#6366F1' },
      { name: 'TCM',  frames: 4, color: '#22D3EE' },
      { name: 'ABS',  frames: 3, color: '#A78BFA' },
      { name: 'HVAC', frames: 5, color: '#FBBF24' },
      { name: 'BCM',  frames: 7, color: '#34D399' },
    ].map(n => (
      <div key={n.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: n.color, flexShrink: 0 }} />
        <span style={{ color: '#AEAEB2', fontSize: '0.65rem', fontFamily: 'monospace', flex: 1 }}>{n.name}</span>
        <span style={{ color: '#636366', fontSize: '0.6rem' }}>{n.frames} frames</span>
      </div>
    ))}
  </div>,

  // Attributes panel
  <div key="attrs" style={{ background: 'rgba(20,14,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', width: 220 }}>
    <p style={{ color: '#636366', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Attributes</p>
    {[
      { key: 'BusType',       val: 'CAN'         },
      { key: 'Version',       val: '"DBC_VECTOR"' },
      { key: 'NmBaseAddress', val: '0x400'        },
      { key: 'GenSigSendType',val: 'cyclic'       },
    ].map(a => (
      <div key={a.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ color: '#636366', fontSize: '0.6rem', fontFamily: 'monospace' }}>{a.key}</span>
        <span style={{ color: '#FBBF24', fontSize: '0.6rem', fontFamily: 'monospace', textAlign: 'right' }}>{a.val}</span>
      </div>
    ))}
  </div>,

  // Statistics
  <div key="stats" style={{ background: 'rgba(20,14,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', width: 220 }}>
    <p style={{ color: '#636366', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>File Statistics</p>
    {[
      { label: 'Total frames',  val: '28',   color: '#30D5C8' },
      { label: 'Total signals', val: '127',  color: '#6366F1' },
      { label: 'ECU nodes',     val: '8',    color: '#A78BFA' },
      { label: 'Env variables', val: '3',    color: '#FBBF24' },
      { label: 'CAN FD frames', val: '12',   color: '#34D399' },
    ].map(s => (
      <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
        <span style={{ color: '#636366', fontSize: '0.65rem' }}>{s.label}</span>
        <span style={{ color: s.color, fontSize: '0.7rem', fontWeight: 600, fontFamily: 'monospace' }}>{s.val}</span>
      </div>
    ))}
  </div>,
]

const RIGHT_CARDS = [
  // Frame detail
  <div key="frame-detail" style={{ background: 'rgba(20,14,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', width: 220 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ color: '#30D5C8', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>0x100</span>
      <span style={{ background: 'rgba(99,102,241,0.15)', color: '#6366F1', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>8 bytes</span>
    </div>
    <p style={{ color: '#F5F5F7', fontSize: '0.7rem', fontWeight: 500, marginBottom: 6 }}>EngineControl</p>
    {[
      { label: 'Transmitter', val: 'ECM'   },
      { label: 'Cycle time',  val: '10 ms' },
      { label: 'Protocol',    val: 'CAN FD'},
    ].map(p => (
      <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ color: '#636366', fontSize: '0.6rem' }}>{p.label}</span>
        <span style={{ color: '#AEAEB2', fontSize: '0.6rem', fontFamily: 'monospace' }}>{p.val}</span>
      </div>
    ))}
  </div>,

  // Bit layout
  <div key="bits" style={{ background: 'rgba(20,14,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', width: 220 }}>
    <p style={{ color: '#636366', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Bit Layout — Byte 0–1</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 2 }}>
      {['RPM','RPM','RPM','RPM','TPS','TPS','TPS','TPS',
        'RPM','RPM','RPM','RPM','CLT','CLT','CLT','CLT'].map((cell, i) => {
        const bg = cell === 'RPM' ? 'rgba(99,102,241,0.4)' : cell === 'TPS' ? 'rgba(34,211,238,0.3)' : 'rgba(167,139,250,0.3)'
        return (
          <div key={i} style={{ background: bg, borderRadius: 2, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace' }}>
            {cell}
          </div>
        )
      })}
    </div>
    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
      {[['RPM','rgba(99,102,241,0.5)'],['TPS','rgba(34,211,238,0.5)'],['CLT','rgba(167,139,250,0.5)']].map(([l, c]) => (
        <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.55rem', color: '#636366' }}>
          <span style={{ width: 6, height: 6, borderRadius: 1, background: c as string }} />
          {l}
        </span>
      ))}
    </div>
  </div>,

  // Search results
  <div key="search" style={{ background: 'rgba(20,14,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', width: 220 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '5px 8px', marginBottom: 8 }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#636366" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <span style={{ color: '#636366', fontSize: '0.6rem', fontFamily: 'monospace' }}>EngineRPM</span>
    </div>
    {[
      { frame: '0x100', signal: 'EngineRPM',    match: 'signal name' },
      { frame: '0x180', signal: 'RPM_Filtered', match: 'signal name' },
      { frame: '0x200', signal: 'RPM_Target',   match: 'signal name' },
    ].map(r => (
      <div key={r.signal} style={{ padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ color: '#30D5C8', fontSize: '0.6rem', fontFamily: 'monospace', flexShrink: 0 }}>{r.frame}</span>
          <span style={{ color: '#AEAEB2', fontSize: '0.6rem' }}>{r.signal}</span>
        </div>
        <span style={{ color: '#636366', fontSize: '0.55rem' }}>{r.match}</span>
      </div>
    ))}
  </div>,

  // Signal property grid
  <div key="sigprop" style={{ background: 'rgba(20,14,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', width: 220 }}>
    <p style={{ color: '#636366', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Signal Properties</p>
    <p style={{ color: '#F5F5F7', fontSize: '0.65rem', fontWeight: 500, marginBottom: 6 }}>EngineRPM</p>
    {[
      { k: 'Start bit',  v: '0'        },
      { k: 'Length',     v: '12 bits'  },
      { k: 'Byte order', v: 'Motorola' },
      { k: 'Factor',     v: '0.25'     },
      { k: 'Offset',     v: '0'        },
      { k: 'Range',      v: '0..8000'  },
      { k: 'Unit',       v: 'rpm'      },
    ].map(p => (
      <div key={p.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '2.5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <span style={{ color: '#636366', fontSize: '0.58rem' }}>{p.k}</span>
        <span style={{ color: '#AEAEB2', fontSize: '0.58rem', fontFamily: 'monospace' }}>{p.v}</span>
      </div>
    ))}
  </div>,
]

// ── Panel component ────────────────────────────────────────────────────────────

interface PanelProps {
  cards: React.ReactNode[]
  rotation: number
  side: 'left' | 'right'
  duration: number
  delay?: number
}

function ScrollPanel({ cards, rotation, side, duration, delay = 0 }: PanelProps) {
  const doubled = [...cards, ...cards]

  return (
    <div
      style={{
        position: 'absolute',
        top: '-5%',
        [side]: side === 'left' ? '-40px' : '-40px',
        width: 230,
        height: '110%',
        overflow: 'hidden',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: '12px 0',
          animation: `scroll-up ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          willChange: 'transform',
        }}
      >
        {doubled.map((card, i) => (
          <div
            key={i}
            style={{
              opacity: 0.72,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {card}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Exported component ─────────────────────────────────────────────────────────

export function HeroScrollPanels() {
  return (
    <>
      <ScrollPanel
        cards={LEFT_CARDS}
        rotation={-6}
        side="left"
        duration={28}
      />
      <ScrollPanel
        cards={RIGHT_CARDS}
        rotation={6}
        side="right"
        duration={22}
        delay={-8}
      />
    </>
  )
}
