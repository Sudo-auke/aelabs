'use client'

import { useEffect, useRef, useState } from 'react'

// ── Shared design tokens ───────────────────────────────────────────────────────
const C = {
  bg:        '#161420',
  bgSide:    '#130F1F',
  bgBar:     '#1E1B2E',
  border:    'rgba(255,255,255,0.06)',
  borderFaint:'rgba(255,255,255,0.03)',
  dimText:   '#4B4B52',
  mutedText: '#636366',
  bodyText:  '#AEAEB2',
  brightText:'#F5F5F7',
  accent:    '#6366F1',
  cyan:      '#22D3EE',
  purple:    '#A78BFA',
  amber:     '#FBBF24',
  green:     '#28C840',
  pink:      '#F472B6',
  mono:      'ui-monospace, "JetBrains Mono", monospace',
}

const sigColors = ['#6366F1','#22D3EE','#A78BFA','#FBBF24','#34D399','#F472B6']

// ── Reusable tiny sub-components ──────────────────────────────────────────────

function TitleBar({ title, version = 'v0.1.0-beta', tabs }: { title: string; version?: string; tabs?: string[] }) {
  return (
    <div style={{ background: C.bgBar, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px 0' }}>
        <div style={{ display: 'flex', gap: 5, paddingBottom: 8 }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {(tabs ?? ['Detail','Frames','Signals','ECUs','Comm Matrix']).map((t, i) => (
            <div key={t} style={{ padding: '4px 12px 8px', fontSize: '0.62rem', borderRadius: '6px 6px 0 0', background: i === 0 ? 'rgba(99,102,241,0.18)' : 'transparent', color: i === 0 ? '#A5B4FC' : C.mutedText, cursor: 'default' }}>{t}</div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 8 }}>
          <span style={{ fontSize: '0.58rem', color: C.dimText, fontFamily: C.mono, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
          <span style={{ background: 'rgba(99,102,241,0.12)', color: C.accent, fontSize: '0.55rem', padding: '2px 6px', borderRadius: 4, fontFamily: C.mono }}>{version}</span>
        </div>
      </div>
    </div>
  )
}

function StatusBar({ items }: { items: { label: string; color: string; value: string }[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '5px 14px', background: C.bgBar, borderTop: `1px solid ${C.border}`, fontSize: '0.58rem', color: C.dimText }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
        <span style={{ color: C.green }}>Parsed</span>
      </span>
      {items.map(it => (
        <span key={it.label}><span style={{ color: it.color }}>{it.value}</span> {it.label}</span>
      ))}
      <span style={{ marginLeft: 'auto', color: C.dimText }}>vehicle_can.dbc · DBC v1.0 · UTF-8</span>
      <span style={{ background: 'rgba(40,200,64,0.10)', color: C.green, padding: '1px 7px', borderRadius: 3, border: `1px solid rgba(40,200,64,0.18)` }}>Ready</span>
    </div>
  )
}

// ── Slide 1: Frames Table ─────────────────────────────────────────────────────

const FRAMES = [
  { id:'0x100', name:'EngineControl',     dlc:8, sender:'ECM',  cycle:10,  sigs:6,  fd:true  },
  { id:'0x200', name:'TransmissionCtrl',  dlc:8, sender:'TCM',  cycle:20,  sigs:4,  fd:false },
  { id:'0x300', name:'BrakeSystem',       dlc:6, sender:'ABS',  cycle:5,   sigs:5,  fd:false },
  { id:'0x400', name:'SteeringAngle',     dlc:4, sender:'EPS',  cycle:10,  sigs:3,  fd:false },
  { id:'0x500', name:'VehicleSpeed',      dlc:8, sender:'BCM',  cycle:20,  sigs:7,  fd:true  },
  { id:'0x600', name:'AirConditioning',   dlc:6, sender:'HVAC', cycle:100, sigs:4,  fd:false },
  { id:'0x700', name:'BatteryManagement', dlc:8, sender:'BMS',  cycle:50,  sigs:9,  fd:true  },
  { id:'0x118', name:'ThrottleBody',      dlc:4, sender:'ECM',  cycle:10,  sigs:3,  fd:false },
  { id:'0x310', name:'ABSControl',        dlc:6, sender:'ABS',  cycle:5,   sigs:5,  fd:false },
]

const TREE = [
  { label:'vehicle_can.dbc', depth:0, icon:'file', color:'#22D3EE' },
  { label:'ECM',  depth:1, icon:'ecu', color:C.accent },
  { label:'0x100 EngineControl', depth:2, icon:'frame', color:C.accent, active:true },
  { label:'0x118 ThrottleBody',  depth:2, icon:'frame', color:C.mutedText },
  { label:'ABS',  depth:1, icon:'ecu', color:C.purple },
  { label:'BCM',  depth:1, icon:'ecu', color:C.amber  },
  { label:'TCM',  depth:1, icon:'ecu', color:'#34D399'},
]

function FramesSlide() {
  return (
    <div style={{ background: C.bg, fontFamily: C.mono, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TitleBar title="vehicle_can.dbc" tabs={['Frames','Signals','ECUs','Comm Matrix','FlexRay']} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 180, background: C.bgSide, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '6px 8px', borderBottom: `1px solid ${C.borderFaint}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,0.04)', borderRadius:5, padding:'3px 7px' }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.dimText} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span style={{ color: C.dimText, fontSize:'0.57rem' }}>Filter…</span>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {TREE.map((n,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:5, padding:`4px ${6+n.depth*10}px`, background: n.active ? 'rgba(99,102,241,0.12)' : 'transparent', borderLeft: n.active ? `2px solid ${C.accent}` : '2px solid transparent' }}>
                {n.depth===1 ? (
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke={n.color} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                ) : n.depth===2 ? (
                  <span style={{ width:4, height:4, borderRadius:'50%', background: n.active ? C.accent : C.dimText, flexShrink:0 }} />
                ) : (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={n.color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                )}
                <span style={{ fontSize:'0.59rem', color: n.active ? C.brightText : n.depth===0 ? C.bodyText : C.mutedText, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:'6px 10px', borderTop:`1px solid ${C.borderFaint}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.52rem', color:C.dimText }}>
              <span>28 frames</span><span>127 signals</span>
            </div>
          </div>
        </div>
        {/* Table */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px', borderBottom:`1px solid ${C.borderFaint}`, background:'rgba(255,255,255,0.01)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,0.04)', borderRadius:5, padding:'3px 8px', flex:1 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.dimText} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span style={{ color:C.dimText, fontSize:'0.57rem' }}>Search frames…</span>
            </div>
            <span style={{ background:'rgba(34,211,238,0.08)', color:C.cyan, fontSize:'0.52rem', padding:'2px 6px', borderRadius:4, border:`1px solid rgba(34,211,238,0.15)` }}>CAN FD</span>
            <span style={{ color:C.mutedText, fontSize:'0.52rem' }}>28 frames</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'62px 1fr 38px 50px 48px 42px 36px', padding:'4px 10px', fontSize:'0.52rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:C.dimText, borderBottom:`1px solid ${C.borderFaint}`, background:'rgba(255,255,255,0.018)' }}>
            <span>ID</span><span>Name</span><span>DLC</span><span>Sender</span><span>Cycle</span><span>Sigs</span><span>FD</span>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {FRAMES.map((f,i) => (
              <div key={f.id} style={{ display:'grid', gridTemplateColumns:'62px 1fr 38px 50px 48px 42px 36px', padding:'5px 10px', fontSize:'0.6rem', background: i===0 ? 'rgba(99,102,241,0.07)' : i%2!==0 ? 'rgba(255,255,255,0.01)' : 'transparent', borderBottom:`1px solid ${C.borderFaint}`, borderLeft: i===0 ? `2px solid ${C.accent}` : '2px solid transparent' }}>
                <span style={{ color:C.cyan, fontWeight:500 }}>{f.id}</span>
                <span style={{ color: i===0 ? C.brightText : C.bodyText }}>{f.name}</span>
                <span style={{ color:C.mutedText }}>{f.dlc}B</span>
                <span style={{ background:'rgba(255,255,255,0.05)', color:'#8E8E93', borderRadius:3, padding:'1px 4px', display:'inline-block', fontSize:'0.52rem' }}>{f.sender}</span>
                <span style={{ color:C.mutedText }}>{f.cycle} ms</span>
                <span style={{ color:C.accent }}>{f.sigs}</span>
                {f.fd
                  ? <span style={{ color:C.cyan, fontSize:'0.5rem' }}>Yes</span>
                  : <span style={{ color:C.dimText }}>—</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <StatusBar items={[{label:'frames',color:C.cyan,value:'28'},{label:'signals',color:C.accent,value:'127'},{label:'ECUs',color:C.purple,value:'8'},{label:'env vars',color:C.amber,value:'3'}]} />
    </div>
  )
}

// ── Slide 2: Frame Detail + Bit Layout ────────────────────────────────────────

const BIT_ROWS = [
  ['EngineRPM','EngineRPM','EngineRPM','EngineRPM','ThrottlePos','ThrottlePos','ThrottlePos','ThrottlePos'],
  ['EngineRPM','EngineRPM','EngineRPM','EngineRPM','CoolantTemp','CoolantTemp','CoolantTemp','CoolantTemp'],
  ['CoolantTemp','CoolantTemp','CoolantTemp','CoolantTemp','ManifPres','ManifPres','ManifPres','ManifPres'],
  ['ManifPres','ManifPres','ManifPres','ManifPres','FuelInj','FuelInj','FuelInj','FuelInj'],
  ['FuelInj','FuelInj','FuelInj','FuelInj','FuelInj','FuelInj','IgnTiming','IgnTiming'],
  ['IgnTiming','IgnTiming','IgnTiming','IgnTiming','IgnTiming','IgnTiming','',''],
]

const BIT_COLORS: Record<string,string> = {
  EngineRPM:   'rgba(99,102,241,0.55)',
  ThrottlePos: 'rgba(34,211,238,0.45)',
  CoolantTemp: 'rgba(167,139,250,0.45)',
  ManifPres:   'rgba(251,191,36,0.40)',
  FuelInj:     'rgba(52,211,153,0.40)',
  IgnTiming:   'rgba(244,114,182,0.40)',
  '':          'rgba(255,255,255,0.03)',
}
const BIT_LABELS: Record<string,string> = {
  EngineRPM:'RPM', ThrottlePos:'TPS', CoolantTemp:'CLT', ManifPres:'MAP', FuelInj:'FINJ', IgnTiming:'IGN', '':''
}

const FRAME_SIGS = [
  { name:'EngineRPM',      start:0,  bits:12, bo:'Mot', factor:'0.25', unit:'rpm', color:'#6366F1' },
  { name:'ThrottlePos',    start:12, bits:8,  bo:'Mot', factor:'0.4',  unit:'%',   color:'#22D3EE' },
  { name:'CoolantTemp',    start:20, bits:12, bo:'Mot', factor:'0.01', unit:'°C',  color:'#A78BFA' },
  { name:'ManifoldPress',  start:32, bits:12, bo:'Mot', factor:'0.1',  unit:'kPa', color:'#FBBF24' },
  { name:'FuelInjDuration',start:44, bits:10, bo:'Mot', factor:'0.001',unit:'ms',  color:'#34D399' },
  { name:'IgnitionTiming', start:54, bits:8,  bo:'Mot', factor:'0.5',  unit:'°',   color:'#F472B6' },
]

function FrameDetailSlide() {
  return (
    <div style={{ background: C.bg, fontFamily: C.mono, height:'100%', display:'flex', flexDirection:'column' }}>
      <TitleBar title="0x100 · EngineControl" tabs={['Detail','Frames','Signals','ECUs','Comm Matrix']} />
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Detail panel */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 18px' }}>
          {/* Frame header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <p style={{ color:C.cyan, fontSize:'0.85rem', fontWeight:700, marginBottom:2 }}>0x100</p>
              <p style={{ color:C.brightText, fontSize:'1rem', fontWeight:600, letterSpacing:'-0.02em' }}>EngineControl</p>
              <p style={{ color:C.mutedText, fontSize:'0.6rem', marginTop:3 }}>Engine control unit — main ECM frame</p>
            </div>
            <span style={{ background:'rgba(99,102,241,0.12)', color:C.accent, fontSize:'0.6rem', padding:'4px 10px', borderRadius:5, border:`1px solid rgba(99,102,241,0.2)` }}>8 bytes · 10 ms</span>
          </div>

          {/* Property grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'6px 12px', padding:'10px 12px', background:'rgba(255,255,255,0.02)', borderRadius:8, border:`1px solid ${C.borderFaint}`, marginBottom:14 }}>
            {[
              ['ID (hex)','0x100'], ['ID (dec)','256'], ['DLC','8 bytes'],
              ['Sender','ECM'], ['Cycle','10 ms'], ['Signals','6'],
            ].map(([k,v]) => (
              <div key={k}>
                <p style={{ color:C.dimText, fontSize:'0.52rem', marginBottom:1 }}>{k}</p>
                <p style={{ color:C.bodyText, fontSize:'0.65rem', fontWeight:500 }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Bit layout */}
          <p style={{ color:C.dimText, fontSize:'0.52rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>Bit Layout</p>
          <div style={{ marginBottom:12 }}>
            {/* header */}
            <div style={{ display:'grid', gridTemplateColumns:'22px repeat(8,1fr)', gap:2, marginBottom:2 }}>
              <span />
              {[7,6,5,4,3,2,1,0].map(n => <span key={n} style={{ textAlign:'center', color:C.dimText, fontSize:'0.48rem' }}>{n}</span>)}
            </div>
            {BIT_ROWS.map((row,ri) => (
              <div key={ri} style={{ display:'grid', gridTemplateColumns:'22px repeat(8,1fr)', gap:2, marginBottom:2 }}>
                <span style={{ color:C.dimText, fontSize:'0.48rem', display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:4 }}>{ri}</span>
                {row.map((cell,ci) => (
                  <div key={ci} style={{ background: BIT_COLORS[cell] ?? BIT_COLORS[''], borderRadius:2, height:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.42rem', color:'rgba(255,255,255,0.85)', fontFamily:C.mono }}>
                    {BIT_LABELS[cell]}
                  </div>
                ))}
              </div>
            ))}
            {/* Legend */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:6 }}>
              {FRAME_SIGS.map(s => (
                <span key={s.name} style={{ display:'flex', alignItems:'center', gap:3, fontSize:'0.52rem', color:C.mutedText }}>
                  <span style={{ width:6, height:6, borderRadius:1, background:s.color }} />{s.name}
                </span>
              ))}
            </div>
          </div>

          {/* Signals table */}
          <p style={{ color:C.dimText, fontSize:'0.52rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:5 }}>Signals (6)</p>
          <div style={{ borderRadius:7, border:`1px solid ${C.borderFaint}`, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 50px 40px 40px 55px 38px', padding:'4px 10px', fontSize:'0.5rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:C.dimText, background:'rgba(255,255,255,0.025)', borderBottom:`1px solid ${C.borderFaint}` }}>
              <span>Name</span><span>Start</span><span>Bits</span><span>BO</span><span>Factor</span><span>Unit</span>
            </div>
            {FRAME_SIGS.map((s,i) => (
              <div key={s.name} style={{ display:'grid', gridTemplateColumns:'1fr 50px 40px 40px 55px 38px', padding:'4px 10px', fontSize:'0.58rem', borderBottom: i<FRAME_SIGS.length-1 ? `1px solid ${C.borderFaint}` : 'none', background: i===0 ? 'rgba(99,102,241,0.06)' : 'transparent' }}>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:s.color, flexShrink:0 }} />
                  <span style={{ color:C.bodyText }}>{s.name}</span>
                </span>
                <span style={{ color:C.mutedText }}>{s.start}</span>
                <span style={{ color:C.mutedText }}>{s.bits}</span>
                <span style={{ color:C.mutedText }}>{s.bo}</span>
                <span style={{ color:C.amber, fontFamily:C.mono }}>{s.factor}</span>
                <span style={{ color:C.mutedText }}>{s.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <StatusBar items={[{label:'frames',color:C.cyan,value:'28'},{label:'signals',color:C.accent,value:'127'},{label:'ECUs',color:C.purple,value:'8'}]} />
    </div>
  )
}

// ── Slide 3: Signals Table ────────────────────────────────────────────────────

const ALL_SIGNALS = [
  { name:'EngineRPM',       frame:'EngineControl',    start:0,  bits:12, bo:'Mot', vtype:'Uns', factor:'0.25', offset:'0',   unit:'rpm', min:'0',   max:'8000' },
  { name:'ThrottlePos',     frame:'EngineControl',    start:12, bits:8,  bo:'Mot', vtype:'Uns', factor:'0.4',  offset:'0',   unit:'%',   min:'0',   max:'100'  },
  { name:'CoolantTemp',     frame:'EngineControl',    start:20, bits:12, bo:'Mot', vtype:'Sgn', factor:'0.01', offset:'-40', unit:'°C',  min:'-40', max:'215'  },
  { name:'GearRatio',       frame:'TransmCtrl',       start:0,  bits:8,  bo:'Mot', vtype:'Uns', factor:'0.1',  offset:'0',   unit:'',    min:'0',   max:'10'   },
  { name:'TorqueReq',       frame:'TransmCtrl',       start:8,  bits:10, bo:'Mot', vtype:'Sgn', factor:'0.5',  offset:'-256',unit:'Nm',  min:'-256',max:'256'  },
  { name:'WheelSpeedFL',    frame:'VehicleSpeed',     start:0,  bits:16, bo:'Int', vtype:'Uns', factor:'0.01', offset:'0',   unit:'km/h',min:'0',   max:'655'  },
  { name:'WheelSpeedFR',    frame:'VehicleSpeed',     start:16, bits:16, bo:'Int', vtype:'Uns', factor:'0.01', offset:'0',   unit:'km/h',min:'0',   max:'655'  },
  { name:'SteeringAngle',   frame:'SteeringAngle',    start:0,  bits:16, bo:'Mot', vtype:'Sgn', factor:'0.1',  offset:'-1638',unit:'°', min:'-1638',max:'1638' },
  { name:'BrakePress',      frame:'BrakeSystem',      start:0,  bits:12, bo:'Mot', vtype:'Uns', factor:'0.05', offset:'0',   unit:'bar', min:'0',   max:'205'  },
  { name:'ABSActive',       frame:'BrakeSystem',      start:12, bits:1,  bo:'Mot', vtype:'Uns', factor:'1',    offset:'0',   unit:'',    min:'0',   max:'1'    },
  { name:'BattVoltage',     frame:'BatteryMgmt',      start:0,  bits:10, bo:'Mot', vtype:'Uns', factor:'0.05', offset:'0',   unit:'V',   min:'0',   max:'51.2' },
  { name:'BattSoC',         frame:'BatteryMgmt',      start:10, bits:8,  bo:'Mot', vtype:'Uns', factor:'0.4',  offset:'0',   unit:'%',   min:'0',   max:'100'  },
]

function SignalsSlide() {
  return (
    <div style={{ background:C.bg, fontFamily:C.mono, height:'100%', display:'flex', flexDirection:'column' }}>
      <TitleBar title="vehicle_can.dbc" tabs={['Signals','Frames','ECUs','Comm Matrix','FlexRay']} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px', borderBottom:`1px solid ${C.borderFaint}`, background:'rgba(255,255,255,0.01)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,0.04)', borderRadius:5, padding:'3px 8px', flex:1 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.dimText} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{ color:C.dimText, fontSize:'0.57rem' }}>Search signals…</span>
          </div>
          <span style={{ color:C.mutedText, fontSize:'0.52rem' }}>127 signals · 28 frames</span>
        </div>
        {/* Header */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 40px 34px 34px 48px 48px 40px 44px 44px', padding:'4px 10px', fontSize:'0.5rem', fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:C.dimText, borderBottom:`1px solid ${C.borderFaint}`, background:'rgba(255,255,255,0.018)' }}>
          <span>Name</span><span>Frame</span><span>Start</span><span>Bits</span><span>BO</span><span>Type</span><span>Factor</span><span>Off.</span><span>Unit</span><span>Range</span>
        </div>
        {/* Rows */}
        <div style={{ flex:1, overflowY:'auto' }}>
          {ALL_SIGNALS.map((s,i) => (
            <div key={s.name} style={{ display:'grid', gridTemplateColumns:'1fr 100px 40px 34px 34px 48px 48px 40px 44px 44px', padding:'4px 10px', fontSize:'0.57rem', background: i===0 ? 'rgba(99,102,241,0.07)' : i%2!==0 ? 'rgba(255,255,255,0.01)' : 'transparent', borderBottom:`1px solid ${C.borderFaint}`, borderLeft: i===0 ? `2px solid ${C.accent}` : '2px solid transparent' }}>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:4, height:4, borderRadius:'50%', background:sigColors[i%sigColors.length], flexShrink:0 }} />
                <span style={{ color: i===0 ? C.brightText : C.bodyText, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</span>
              </span>
              <span style={{ color:C.mutedText, fontSize:'0.53rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.frame}</span>
              <span style={{ color:C.dimText }}>{s.start}</span>
              <span style={{ color:C.accent }}>{s.bits}</span>
              <span style={{ color:C.dimText }}>{s.bo}</span>
              <span style={{ color: s.vtype==='Sgn' ? C.purple : C.dimText, fontSize:'0.5rem' }}>{s.vtype==='Sgn' ? 'Signed' : 'Unsigned'}</span>
              <span style={{ color:C.amber, fontFamily:C.mono }}>{s.factor}</span>
              <span style={{ color:C.dimText }}>{s.offset}</span>
              <span style={{ color:C.mutedText }}>{s.unit}</span>
              <span style={{ color:C.dimText, fontSize:'0.5rem' }}>{s.min}…{s.max}</span>
            </div>
          ))}
        </div>
      </div>
      <StatusBar items={[{label:'signals',color:C.accent,value:'127'},{label:'frames',color:C.cyan,value:'28'},{label:'ECUs',color:C.purple,value:'8'}]} />
    </div>
  )
}

// ── Slide 4: Communication Matrix ─────────────────────────────────────────────

const MATRIX_FRAMES = ['EngineControl','TransmCtrl','BrakeSystem','SteeringAngle','VehicleSpeed','AirConditioning','BatteryMgmt','ThrottleBody']
const MATRIX_ECUS   = ['ECM','TCM','ABS','EPS','BCM','HVAC','BMS']
const MATRIX_DATA: Record<string, Record<string, 'T'|'R'|''>> = {
  EngineControl:   { ECM:'T', TCM:'R', ABS:'R', EPS:'',  BCM:'R', HVAC:'',  BMS:''  },
  TransmCtrl:      { ECM:'R', TCM:'T', ABS:'',  EPS:'',  BCM:'R', HVAC:'',  BMS:''  },
  BrakeSystem:     { ECM:'R', TCM:'R', ABS:'T', EPS:'',  BCM:'R', HVAC:'',  BMS:''  },
  SteeringAngle:   { ECM:'',  TCM:'',  ABS:'R', EPS:'T', BCM:'R', HVAC:'',  BMS:''  },
  VehicleSpeed:    { ECM:'',  TCM:'R', ABS:'R', EPS:'R', BCM:'T', HVAC:'',  BMS:''  },
  AirConditioning: { ECM:'',  TCM:'',  ABS:'',  EPS:'',  BCM:'R', HVAC:'T', BMS:''  },
  BatteryMgmt:     { ECM:'R', TCM:'',  ABS:'',  EPS:'',  BCM:'R', HVAC:'',  BMS:'T' },
  ThrottleBody:    { ECM:'T', TCM:'R', ABS:'',  EPS:'',  BCM:'',  HVAC:'',  BMS:''  },
}

function CommMatrixSlide() {
  return (
    <div style={{ background:C.bg, fontFamily:C.mono, height:'100%', display:'flex', flexDirection:'column' }}>
      <TitleBar title="vehicle_can.dbc — Comm Matrix" tabs={['Comm Matrix','Frames','Signals','ECUs','FlexRay']} />
      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px' }}>
        <p style={{ color:C.dimText, fontSize:'0.52rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>ECU Communication Matrix · vehicle_can.dbc</p>
        <div style={{ borderRadius:8, border:`1px solid ${C.borderFaint}`, overflow:'hidden' }}>
          {/* Header row */}
          <div style={{ display:'grid', gridTemplateColumns:`140px repeat(${MATRIX_ECUS.length},1fr)`, borderBottom:`1px solid ${C.border}`, background:'rgba(255,255,255,0.025)' }}>
            <div style={{ padding:'6px 10px', fontSize:'0.5rem', color:C.dimText }}>Frame</div>
            {MATRIX_ECUS.map(ecu => (
              <div key={ecu} style={{ padding:'6px 4px', fontSize:'0.55rem', fontWeight:600, color:C.bodyText, textAlign:'center', borderLeft:`1px solid ${C.borderFaint}` }}>{ecu}</div>
            ))}
          </div>
          {/* Data rows */}
          {MATRIX_FRAMES.map((frame,fi) => (
            <div key={frame} style={{ display:'grid', gridTemplateColumns:`140px repeat(${MATRIX_ECUS.length},1fr)`, borderBottom: fi<MATRIX_FRAMES.length-1 ? `1px solid ${C.borderFaint}` : 'none', background: fi%2!==0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
              <div style={{ padding:'6px 10px', fontSize:'0.58rem', color:C.bodyText, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{frame}</div>
              {MATRIX_ECUS.map(ecu => {
                const cell = MATRIX_DATA[frame]?.[ecu] ?? ''
                return (
                  <div key={ecu} style={{ display:'flex', alignItems:'center', justifyContent:'center', borderLeft:`1px solid ${C.borderFaint}`, padding:'5px 2px' }}>
                    {cell === 'T' ? (
                      <div style={{ width:14, height:14, borderRadius:'50%', background: 'rgba(99,102,241,0.3)', border:`2px solid ${C.accent}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ color:C.accent, fontSize:'0.45rem', fontWeight:700 }}>T</span>
                      </div>
                    ) : cell === 'R' ? (
                      <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${C.dimText}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ color:C.dimText, fontSize:'0.45rem' }}>R</span>
                      </div>
                    ) : (
                      <span style={{ color:'rgba(255,255,255,0.07)', fontSize:'0.6rem' }}>·</span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div style={{ display:'flex', gap:16, marginTop:12 }}>
          {[
            { sym:'T', bg:'rgba(99,102,241,0.3)', border:C.accent, label:'Transmitter' },
            { sym:'R', bg:'transparent', border:C.dimText, label:'Receiver' },
          ].map(l => (
            <div key={l.sym} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:12, height:12, borderRadius:'50%', background:l.bg, border:`2px solid ${l.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:l.border, fontSize:'0.42rem', fontWeight:700 }}>{l.sym}</span>
              </div>
              <span style={{ color:C.dimText, fontSize:'0.58rem' }}>{l.label}</span>
            </div>
          ))}
          <span style={{ color:C.dimText, fontSize:'0.58rem', marginLeft:4 }}>· = No communication</span>
        </div>
      </div>
      <StatusBar items={[{label:'frames',color:C.cyan,value:'28'},{label:'signals',color:C.accent,value:'127'},{label:'ECUs',color:C.purple,value:'8'}]} />
    </div>
  )
}

// ── Slide 5: Signal Detail ────────────────────────────────────────────────────

function SignalDetailSlide() {
  return (
    <div style={{ background:C.bg, fontFamily:C.mono, height:'100%', display:'flex', flexDirection:'column' }}>
      <TitleBar title="EngineRPM · 0x100 EngineControl" tabs={['Detail','Frames','Signals','ECUs','Comm Matrix']} />
      <div style={{ flex:1, overflowY:'auto', padding:'18px 20px' }}>
        {/* Signal header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
          <div>
            <p style={{ color:C.accent, fontSize:'1rem', fontWeight:700, letterSpacing:'-0.02em' }}>EngineRPM</p>
            <p style={{ color:C.mutedText, fontSize:'0.6rem', marginTop:2 }}>In frame <span style={{ color:C.cyan }}>0x100 EngineControl</span> · Sender: ECM</p>
          </div>
        </div>

        {/* Physical value formula */}
        <div style={{ padding:'10px 14px', background:'rgba(99,102,241,0.07)', borderRadius:8, border:`1px solid rgba(99,102,241,0.18)`, marginBottom:14 }}>
          <p style={{ color:C.dimText, fontSize:'0.5rem', marginBottom:4, letterSpacing:'0.08em', textTransform:'uppercase' }}>Physical Value Formula</p>
          <p style={{ color:C.brightText, fontSize:'0.75rem' }}>
            physical = raw × <span style={{ color:C.amber }}>0.25</span>
            <span style={{ color:C.mutedText, marginLeft:8, fontSize:'0.62rem' }}>Range: 0 … 8000 rpm</span>
          </p>
        </div>

        {/* Properties */}
        <p style={{ color:C.dimText, fontSize:'0.52rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>Properties</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
          {[
            ['Start bit','0'],['Length','12 bits'],['Byte order','Motorola'],
            ['Value type','Unsigned'],['Factor','0.25'],['Offset','0'],
            ['Min','0'],['Max','8000'],['Unit','rpm'],
            ['Multiplexing','—'],['Receivers','TCM, ABS, BCM'],['Comment','Engine speed in RPM'],
          ].map(([k,v]) => (
            <div key={k} style={{ padding:'7px 10px', background:'rgba(255,255,255,0.025)', borderRadius:6, border:`1px solid ${C.borderFaint}` }}>
              <p style={{ color:C.dimText, fontSize:'0.5rem', marginBottom:2 }}>{k}</p>
              <p style={{ color:C.bodyText, fontSize:'0.62rem', fontWeight:500 }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Attributes */}
        <p style={{ color:C.dimText, fontSize:'0.52rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>Attributes</p>
        <div style={{ borderRadius:7, border:`1px solid ${C.borderFaint}`, overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 1fr', padding:'4px 10px', fontSize:'0.5rem', fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:C.dimText, background:'rgba(255,255,255,0.02)', borderBottom:`1px solid ${C.borderFaint}` }}>
            <span>Name</span><span>Type</span><span>Value</span>
          </div>
          {[
            ['SystemSignalLongSymbol','string','EngineRotationalSpeed'],
            ['GenSigSendType','string','cyclic'],
            ['GenSigILSupport','integer','1'],
            ['SigType','string','rpm_signal'],
          ].map(([n,t,v],i) => (
            <div key={n} style={{ display:'grid', gridTemplateColumns:'1fr 80px 1fr', padding:'4px 10px', fontSize:'0.58rem', borderBottom: i<3 ? `1px solid ${C.borderFaint}` : 'none', background: i%2 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
              <span style={{ color:C.bodyText }}>{n}</span>
              <span style={{ color:C.purple, fontSize:'0.52rem' }}>{t}</span>
              <span style={{ color:C.amber }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <StatusBar items={[{label:'frames',color:C.cyan,value:'28'},{label:'signals',color:C.accent,value:'127'},{label:'ECUs',color:C.purple,value:'8'}]} />
    </div>
  )
}

// ── Carousel labels ───────────────────────────────────────────────────────────

const SLIDE_LABELS = ['Frames Table', 'Frame Detail + Bit Layout', 'Signals Table', 'Comm Matrix', 'Signal Detail']
const N = 5 // slides per set — triplet: [copy A | real | copy B]

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns the index (0-based) of the child whose center is closest to the scroll viewport center */
function closestChild(el: HTMLDivElement): number {
  const viewCenter = el.scrollLeft + el.clientWidth / 2
  const children = Array.from(el.children) as HTMLElement[]
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < children.length; i++) {
    const c = children[i]
    const dist = Math.abs(viewCenter - (c.offsetLeft + c.offsetWidth / 2))
    if (dist < bestDist) { bestDist = dist; best = i }
  }
  return best
}

/** Scroll so that children[idx] is centered in the viewport */
function centerOn(el: HTMLDivElement, idx: number, smooth = false) {
  const children = Array.from(el.children) as HTMLElement[]
  const target = children[idx]
  if (!target) return
  const left = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2
  if (smooth) el.scrollTo({ left, behavior: 'smooth' })
  else el.scrollLeft = left
}

// ── Main carousel component ───────────────────────────────────────────────────

export function HeroCarousel() {
  const scrollRef    = useRef<HTMLDivElement>(null)
  const isJumping    = useRef(false)
  const isPaused     = useRef(false)
  const autoTimer    = useRef<ReturnType<typeof setInterval> | null>(null)
  const [activeIndex, setActiveIndex] = useState(0) // visual 0..N-1

  // Triplet: copy A | real (N..2N-1) | copy B
  const BASE = [<FramesSlide />, <FrameDetailSlide />, <SignalsSlide />, <CommMatrixSlide />, <SignalDetailSlide />]
  const ALL  = [...BASE, ...BASE, ...BASE]

  // ── Mount: start in the middle set ──────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // Two rAF to let the browser finish layout before measuring offsetLeft
    requestAnimationFrame(() => requestAnimationFrame(() => {
      centerOn(el, N) // center on slide index N (first of middle set)
    }))
  }, [])

  // ── Wheel: convert vertical → horizontal ────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        isPaused.current = true
        el.scrollLeft += e.deltaY * 1.5
        // Resume auto-advance after 6 s of inactivity
        clearTimeout((onWheel as unknown as { _t: ReturnType<typeof setTimeout> })._t)
        ;(onWheel as unknown as { _t: ReturnType<typeof setTimeout> })._t =
          setTimeout(() => { isPaused.current = false }, 6000)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // ── Scroll: track active + infinite jump ────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      if (isJumping.current) return
      const real = closestChild(el)
      setActiveIndex(real % N)
      // Silent jump when entering the outer copies
      if (real < N) {
        isJumping.current = true
        centerOn(el, real + N)
        requestAnimationFrame(() => { isJumping.current = false })
      } else if (real >= N * 2) {
        isJumping.current = true
        centerOn(el, real - N)
        requestAnimationFrame(() => { isJumping.current = false })
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // ── Auto-advance every 4 s, pause on hover ───────────────────────────────────
  useEffect(() => {
    const advance = () => {
      if (isPaused.current) return
      const el = scrollRef.current
      if (!el) return
      const real = closestChild(el)
      // next in middle set; wrap back to N when at 2N-1
      const next = real >= N * 2 - 1 ? N : real + 1
      centerOn(el, next, true)
    }
    autoTimer.current = setInterval(advance, 4000)
    return () => { if (autoTimer.current) clearInterval(autoTimer.current) }
  }, [])

  // Pause auto on mouse enter, resume on leave
  const pauseAuto  = () => { isPaused.current = true  }
  const resumeAuto = () => { isPaused.current = false }

  // ── Dot navigation → always in middle set ────────────────────────────────────
  const goTo = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    isPaused.current = true
    centerOn(el, N + i, true)
    setTimeout(() => { isPaused.current = false }, 6000)
  }

  // ── Drag ─────────────────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    isPaused.current = true
    const startX    = e.pageX - el.offsetLeft
    const startScroll = el.scrollLeft
    el.style.cursor = 'grabbing'
    const onMove = (ev: MouseEvent) => {
      el.scrollLeft = startScroll - (ev.pageX - el.offsetLeft - startX)
    }
    const onUp = () => {
      el.style.cursor = 'grab'
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      setTimeout(() => { isPaused.current = false }, 6000)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{ position: 'relative', width: '100%' }}
      onMouseEnter={pauseAuto}
      onMouseLeave={resumeAuto}
    >
      {/* Clip + fade */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:120, background:'linear-gradient(to right, var(--bg-primary), transparent)', zIndex:2, pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:120, background:'linear-gradient(to left, var(--bg-primary), transparent)', zIndex:2, pointerEvents:'none' }} />

        <div
          ref={scrollRef}
          // biome-ignore lint/a11y/useKeyWithMouseEvents: drag
          onMouseDown={onMouseDown}
          style={{
            display: 'flex',
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            gap: 20,
            padding: '16px calc(50% - 440px)',
            cursor: 'grab',
          }}
        >
          {ALL.map((slide, i) => {
            const isActive = (i % N) === activeIndex
            return (
              <div
                key={i}
                style={{
                  flex: '0 0 880px',
                  height: 400,
                  scrollSnapAlign: 'center',
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: `1px solid ${isActive ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isActive
                    ? '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.12), 0 0 40px rgba(99,102,241,0.08)'
                    : '0 16px 40px rgba(0,0,0,0.3)',
                  transform: `scale(${isActive ? 1 : 0.88})`,
                  opacity: isActive ? 1 : 0.42,
                  transition: 'transform 0.4s cubic-bezier(0.25,0.1,0.25,1), opacity 0.4s ease, box-shadow 0.4s ease',
                  willChange: 'transform, opacity',
                }}
                // biome-ignore lint/a11y/useKeyWithClickEvents: carousel nav
                onClick={() => goTo(i % N)}
              >
                {slide}
              </div>
            )
          })}
        </div>
      </div>

      {/* Label + dots pill */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, marginTop:16 }}>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.68rem', fontFamily:'ui-monospace, monospace', opacity:0.7, letterSpacing:'0.02em' }}>
          {SLIDE_LABELS[activeIndex]}
        </p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(8,5,18,0.82)', padding:'7px 14px', borderRadius:20, border:'1px solid rgba(255,255,255,0.10)' }}>
          {BASE.map((_,i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              style={{
                width: activeIndex===i ? 22 : 6,
                height: 6,
                borderRadius: 3,
                background: activeIndex===i ? 'var(--accent-primary)' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
              aria-label={`View ${SLIDE_LABELS[i]}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
