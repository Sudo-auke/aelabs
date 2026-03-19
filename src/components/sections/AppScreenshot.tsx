// Mock UI of the BusFileReader desktop app — shown in the Hero section

const FRAMES = [
  { id: '0x100', name: 'EngineControl',     len: 8,  signals: 6,  ecu: 'ECM',  cycleMs: 10  },
  { id: '0x200', name: 'TransmissionCtrl',  len: 8,  signals: 4,  ecu: 'TCM',  cycleMs: 20  },
  { id: '0x300', name: 'BrakeSystem',       len: 6,  signals: 5,  ecu: 'ABS',  cycleMs: 5   },
  { id: '0x400', name: 'SteeringAngle',     len: 4,  signals: 3,  ecu: 'EPS',  cycleMs: 10  },
  { id: '0x500', name: 'VehicleSpeed',      len: 8,  signals: 7,  ecu: 'BCM',  cycleMs: 20  },
  { id: '0x600', name: 'AirConditioning',   len: 6,  signals: 4,  ecu: 'HVAC', cycleMs: 100 },
  { id: '0x700', name: 'BatteryManagement', len: 8,  signals: 9,  ecu: 'BMS',  cycleMs: 50  },
  { id: '0x118', name: 'ThrottleBody',      len: 4,  signals: 3,  ecu: 'ECM',  cycleMs: 10  },
  { id: '0x310', name: 'ABSControl',        len: 6,  signals: 5,  ecu: 'ABS',  cycleMs: 5   },
]

const SELECTED_SIGNALS = [
  { name: 'EngineRPM',      start: 0,  len: 12, bo: 'Mot', factor: '0.25',  offset: '0',  min: '0',    max: '8000', unit: 'rpm' },
  { name: 'ThrottlePos',    start: 12, len: 8,  bo: 'Mot', factor: '0.4',   offset: '0',  min: '0',    max: '100',  unit: '%'   },
  { name: 'CoolantTemp',    start: 20, len: 12, bo: 'Mot', factor: '0.01',  offset: '-40',min: '-40',  max: '215',  unit: '°C'  },
  { name: 'ManifoldPress',  start: 32, len: 12, bo: 'Mot', factor: '0.1',   offset: '0',  min: '0',    max: '350',  unit: 'kPa' },
  { name: 'FuelInjDuration',start: 44, len: 10, bo: 'Mot', factor: '0.001', offset: '0',  min: '0',    max: '20',   unit: 'ms'  },
  { name: 'IgnitionTiming', start: 54, len: 8,  bo: 'Mot', factor: '0.5',   offset: '-64',min: '-64',  max: '64',   unit: '°'   },
]

const TREE_NODES = [
  { name: 'vehicle_can.dbc', active: true,  expanded: true,  depth: 0 },
  { name: 'ECM',             active: false, expanded: true,  depth: 1 },
  { name: '0x100 EngineControl', active: true, expanded: false, depth: 2 },
  { name: '0x118 ThrottleBody',  active: false,expanded: false, depth: 2 },
  { name: 'ABS',             active: false, expanded: false, depth: 1 },
  { name: 'BCM',             active: false, expanded: false, depth: 1 },
  { name: 'TCM',             active: false, expanded: false, depth: 1 },
]

const sigColor = (i: number) => {
  const palette = ['#6366F1','#22D3EE','#A78BFA','#FBBF24','#34D399','#F472B6']
  return palette[i % palette.length]
}

export function AppScreenshot() {
  return (
    <div
      className="w-full overflow-hidden rounded-xl"
      style={{
        background: '#161420',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
      }}
    >
      {/* ── Title bar ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ background: '#1E1B2E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full" style={{ background: '#FF5F57' }} />
          <div className="h-3 w-3 rounded-full" style={{ background: '#FEBC2E' }} />
          <div className="h-3 w-3 rounded-full" style={{ background: '#28C840' }} />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0.5 flex-1 justify-center">
          {['Frames', 'Signals', 'ECUs', 'Attributes', 'Bit Layout'].map((tab, i) => (
            <div
              key={tab}
              style={{
                padding: '3px 12px',
                fontSize: '0.65rem',
                borderRadius: 5,
                background: i === 0 ? 'rgba(99,102,241,0.18)' : 'transparent',
                color: i === 0 ? '#A5B4FC' : '#636366',
                cursor: 'default',
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        <span
          className="rounded px-1.5 py-0.5 text-xs font-medium"
          style={{ background: 'rgba(99,102,241,0.12)', color: '#6366F1', fontSize: '0.6rem' }}
        >
          v0.1.0-beta
        </span>
      </div>

      {/* ── App body ──────────────────────────────────────────────────────── */}
      <div className="flex" style={{ height: '360px' }}>

        {/* Sidebar — file/ECU tree */}
        <div
          className="flex shrink-0 flex-col"
          style={{ width: 188, background: '#130F1F', borderRight: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Search */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 7px' }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#4B4B52" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span style={{ color: '#4B4B52', fontSize: '0.58rem' }}>Filter…</span>
            </div>
          </div>

          {/* Tree */}
          {TREE_NODES.map((node, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: `4px ${8 + node.depth * 12}px`,
                background: node.active ? 'rgba(99,102,241,0.12)' : 'transparent',
                borderLeft: node.active ? '2px solid #6366F1' : '2px solid transparent',
              }}
            >
              {/* Caret or dot */}
              {node.depth < 2 && node.depth > 0 ? (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={node.expanded ? '#6366F1' : '#4B4B52'} strokeWidth="2.5">
                  {node.expanded
                    ? <polyline points="6 9 12 15 18 9"/>
                    : <polyline points="9 18 15 12 9 6"/>
                  }
                </svg>
              ) : node.depth === 2 ? (
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: node.active ? '#6366F1' : '#3A3A42', flexShrink: 0 }} />
              ) : (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={node.active ? '#30D5C8' : '#4B4B52'} strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              )}
              <span style={{ fontSize: '0.6rem', color: node.active ? '#E8E8EC' : node.depth === 0 ? '#AEAEB2' : '#636366', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="truncate">
                {node.name}
              </span>
            </div>
          ))}

          {/* Bottom summary */}
          <div style={{ marginTop: 'auto', padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#4B4B52' }}>
              <span>28 frames</span>
              <span>127 signals</span>
            </div>
          </div>
        </div>

        {/* Center — frame table */}
        <div className="flex flex-col overflow-hidden" style={{ flex: '1 1 0', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Toolbar */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.015)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 5, padding: '3px 8px', flex: 1 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4B4B52" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span style={{ color: '#4B4B52', fontSize: '0.58rem' }}>Search frames…</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ background: 'rgba(34,211,238,0.08)', color: '#22D3EE', fontSize: '0.55rem', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(34,211,238,0.15)' }}>CAN FD</span>
              <span style={{ background: 'rgba(255,255,255,0.04)', color: '#636366', fontSize: '0.55rem', padding: '2px 6px', borderRadius: 4 }}>28 frames</span>
            </div>
          </div>

          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '70px 1fr 44px 54px 52px 54px',
              padding: '5px 10px',
              fontSize: '0.55rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#4B4B52',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span>ID</span>
            <span>Name</span>
            <span>Len</span>
            <span>Signals</span>
            <span>ECU</span>
            <span>Cycle</span>
          </div>

          {/* Rows */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {FRAMES.map((f, i) => (
              <div
                key={f.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr 44px 54px 52px 54px',
                  padding: '5px 10px',
                  fontSize: '0.62rem',
                  background: i === 0 ? 'rgba(99,102,241,0.08)' : i % 2 !== 0 ? 'rgba(255,255,255,0.012)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  cursor: 'default',
                  borderLeft: i === 0 ? '2px solid #6366F1' : '2px solid transparent',
                }}
              >
                <span style={{ color: '#30D5C8', fontWeight: 500 }}>{f.id}</span>
                <span style={{ color: i === 0 ? '#F5F5F7' : '#AEAEB2' }}>{f.name}</span>
                <span style={{ color: '#636366' }}>{f.len}B</span>
                <span style={{ color: '#6366F1' }}>{f.signals}</span>
                <span style={{ background: 'rgba(255,255,255,0.05)', color: '#8E8E93', borderRadius: 3, padding: '1px 4px', display: 'inline-block', fontSize: '0.55rem' }}>{f.ecu}</span>
                <span style={{ color: '#636366' }}>{f.cycleMs} ms</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — signal detail */}
        <div
          className="flex shrink-0 flex-col"
          style={{ width: 240, background: '#130F1F' }}
        >
          {/* Panel header */}
          <div style={{ padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#30D5C8', fontSize: '0.65rem', fontWeight: 600 }}>0x100</span>
              <span style={{ background: 'rgba(99,102,241,0.12)', color: '#6366F1', fontSize: '0.55rem', padding: '1px 6px', borderRadius: 3 }}>8 bytes · 10 ms</span>
            </div>
            <p style={{ color: '#F5F5F7', fontSize: '0.65rem', fontWeight: 500, marginTop: 2 }}>EngineControl</p>
          </div>

          {/* Signal columns header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 38px 30px 44px',
              padding: '4px 8px',
              fontSize: '0.5rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#4B4B52',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <span>Signal</span>
            <span>Bits</span>
            <span>BO</span>
            <span>Unit</span>
          </div>

          {/* Signals */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {SELECTED_SIGNALS.map((s, i) => (
              <div
                key={s.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 38px 30px 44px',
                  padding: '4px 8px',
                  fontSize: '0.58rem',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  background: i === 0 ? 'rgba(99,102,241,0.07)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: sigColor(i), flexShrink: 0 }} />
                  <span style={{ color: '#AEAEB2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                </div>
                <span style={{ color: '#636366', fontSize: '0.52rem' }}>{s.start}+{s.len}</span>
                <span style={{ color: '#636366', fontSize: '0.52rem' }}>{s.bo}</span>
                <span style={{ color: '#FBBF24', fontSize: '0.52rem' }}>{s.unit}</span>
              </div>
            ))}
          </div>

          {/* Properties */}
          <div style={{ padding: '6px 8px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ color: '#4B4B52', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Selected · EngineRPM</p>
            {[
              ['Factor', '0.25'],
              ['Range',  '0 … 8000'],
              ['Offset', '0'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', padding: '1.5px 0' }}>
                <span style={{ color: '#4B4B52' }}>{k}</span>
                <span style={{ color: '#AEAEB2' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Status bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '5px 14px',
          background: '#1E1B2E',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: '0.58rem',
          color: '#4B4B52',
        }}
      >
        <span><span style={{ color: '#30D5C8' }}>28</span> frames</span>
        <span><span style={{ color: '#6366F1' }}>127</span> signals</span>
        <span><span style={{ color: '#A78BFA' }}>8</span> ECUs</span>
        <span><span style={{ color: '#FBBF24' }}>12</span> env vars</span>
        <span style={{ marginLeft: 'auto', color: '#3A3A42' }}>vehicle_can.dbc · DBC v1.0 · UTF-8</span>
        <span style={{ background: 'rgba(40,200,64,0.12)', color: '#28C840', padding: '1px 6px', borderRadius: 3, border: '1px solid rgba(40,200,64,0.18)' }}>Ready</span>
      </div>
    </div>
  )
}
