/**
 * HeroBackground — Perspective grid + signal traces embedded in the same
 * perspective space. Both the grid and the SVG share the exact same CSS
 * transform so signals appear to lie flat ON the grid surface.
 */

// ── CAN-style bit patterns (28 bits × 50px = 1400px — snaps to 50px grid cells) ──
const BITS_A = [1,0,1,1,0,0,1,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,0] as const
const BITS_B = [0,0,1,1,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,0,1,1,1,0,1,0,0,1] as const
const BITS_C = [1,1,0,0,1,0,0,1,0,1,0,0,1,1,0,0,1,1,0,1,0,1,0,0,1,0,1,0] as const
const BITS_D = [0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,1,0,0,1,0,1,0,0,1,1,0] as const

// ── Square wave generator — bit transitions align with 50px grid cells ──
function sq(baseY: number, amp: number, bits: readonly number[]): string {
  const pts: string[] = []
  let x = 0
  let y = bits[0] === 1 ? baseY - amp : baseY
  pts.push(`0,${y}`)
  for (const bit of bits) {
    const ny = bit === 1 ? baseY - amp : baseY
    if (ny !== y) { pts.push(`${x},${ny}`); y = ny }
    x += 50
    pts.push(`${x},${y}`)
  }
  return pts.join(' ')
}

// ── Sine-like wave generator using cubic bezier approximation ──
function sine(baseY: number, amp: number, period: number, startX = 0, goUpFirst = true): string {
  const half = period / 2
  const q1 = +(half * 0.364).toFixed(1)
  const q2 = +(half * 0.636).toFixed(1)
  let d = `M ${startX},${baseY}`
  let x = startX
  let up = goUpFirst
  while (x < 1440) {
    const pk = up ? baseY - amp : baseY + amp
    const xe = +(x + half).toFixed(1)
    d += ` C ${+(x + q1).toFixed(1)},${pk} ${+(x + q2).toFixed(1)},${pk} ${xe},${baseY}`
    x = xe
    up = !up
  }
  return d
}

// ── The same CSS transform as .perspective-grid ────────────────────────────
const GRID_TRANSFORM = 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)'
const GRID_MASK = 'linear-gradient(to bottom, black 20%, transparent 80%)'

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">

      {/* Flat perspective grid */}
      <div className="perspective-grid" />

      {/* Signal traces — identical transform → signals lie ON the grid surface */}
      <div
        className="absolute inset-0"
        style={{
          transform: GRID_TRANSFORM,
          transformOrigin: 'top center',
          maskImage: GRID_MASK,
          WebkitMaskImage: GRID_MASK,
        }}
      >
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/*
           * Y values in this flat SVG map to depths on the grid:
           *   y ≈ 0–180   → near horizon (far from viewer)
           *   y ≈ 180–600 → mid-ground
           *   y > 720     → hidden by mask
           * Bit width 50px = exactly 1 grid cell → transitions align with grid lines.
           */}

          {/* ── Depth 1 — near horizon, fully visible, small in perspective ── */}
          <polyline points={sq(100, 28, BITS_A)}
            fill="none" stroke="rgba(99,102,241,0.55)" strokeWidth="1.2" />
          <path d={sine(140, 24, 200, 50)}
            fill="none" stroke="rgba(48,213,200,0.45)" strokeWidth="1.1" />

          {/* ── Depth 2 ── */}
          <polyline points={sq(210, 28, BITS_B)}
            fill="none" stroke="rgba(99,102,241,0.50)" strokeWidth="1.1" />
          <path d={sine(250, 26, 180, 0, false)}
            fill="none" stroke="rgba(48,213,200,0.42)" strokeWidth="1" />

          {/* ── Depth 3 — mid-ground ── */}
          <polyline points={sq(330, 26, BITS_C)}
            fill="none" stroke="rgba(48,213,200,0.44)" strokeWidth="1" />
          <path d={sine(370, 24, 220, 110)}
            fill="none" stroke="rgba(99,102,241,0.38)" strokeWidth="0.95" />

          {/* ── Depth 4 ── */}
          <polyline points={sq(460, 25, BITS_D)}
            fill="none" stroke="rgba(99,102,241,0.38)" strokeWidth="0.9" />
          <path d={sine(500, 22, 200, 60, false)}
            fill="none" stroke="rgba(48,213,200,0.34)" strokeWidth="0.85" />

          {/* ── Depth 5 — closer to viewer, fading via mask ── */}
          <polyline points={sq(580, 22, BITS_A)}
            fill="none" stroke="rgba(99,102,241,0.30)" strokeWidth="0.8" />
          <path d={sine(620, 20, 180, 30)}
            fill="none" stroke="rgba(48,213,200,0.26)" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Blue glow from top */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(10,132,255,0.10) 0%, transparent 65%)',
        }}
      />
    </div>
  )
}
