import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { contact, parts } from '../data/content'
import { usePrefersReducedMotion } from '../hooks'
import { Check, Phone, PartGlyph } from './Icons'
import Magnetic from './Magnetic'
import RevealText from './RevealText'

type Pt = { x: number; y: number }
type Seg = { pts: Pt[]; width: number; alpha: number }
type Strike = { segs: Seg[]; born: number }

/** Midpoint-displacement lightning between two points, with random side branches. */
function buildBolt(a: Pt, b: Pt, scale: number): Seg[] {
  const segs: Seg[] = []
  const make = (p: Pt, q: Pt, rough: number, width: number, alpha: number, depth: number) => {
    let pts: Pt[] = [p, q]
    let disp = rough
    while (disp > 3 * scale) {
      const next: Pt[] = [pts[0]]
      for (let i = 0; i < pts.length - 1; i++) {
        const s = pts[i], e = pts[i + 1]
        const dx = e.x - s.x, dy = e.y - s.y
        const len = Math.hypot(dx, dy) || 1
        const off = (Math.random() - 0.5) * disp
        next.push({ x: (s.x + e.x) / 2 + (-dy / len) * off, y: (s.y + e.y) / 2 + (dx / len) * off })
        next.push(e)
      }
      pts = next
      disp /= 2
    }
    segs.push({ pts, width, alpha })
    if (depth > 0) {
      const branches = depth === 2 ? 3 + Math.floor(Math.random() * 3) : 1
      for (let k = 0; k < branches; k++) {
        const idx = Math.floor(pts.length * (0.15 + Math.random() * 0.55))
        const from = pts[idx]
        const dir = Math.random() < 0.5 ? -1 : 1
        const len = Math.hypot(q.x - p.x, q.y - p.y) * (0.18 + Math.random() * 0.25)
        const ang = Math.PI / 2 + dir * (0.35 + Math.random() * 0.7)
        const to = { x: from.x + Math.cos(ang) * len, y: from.y + Math.sin(ang) * len * 0.8 }
        make(from, to, rough * 0.45, width * 0.45, alpha * 0.55, depth - 1)
      }
    }
  }
  make(a, b, Math.hypot(b.x - a.x, b.y - a.y) * 0.28, 2.8 * scale, 1, 2)
  return segs
}

const LIFE = 650

export default function Hero() {
  const reduce = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tipRef = useRef<SVGCircleElement>(null)
  const strikes = useRef<Strike[]>([])
  const visible = useRef(true)
  const flash = useAnimationControls()
  const [hit, setHit] = useState(0)
  const [ka, setKa] = useState(34)
  const [caught, setCaught] = useState(0)

  const strike = useCallback(
    (fromX?: number) => {
      const c = canvasRef.current, tip = tipRef.current
      if (!c || !tip) return
      const cr = c.getBoundingClientRect()
      const tr = tip.getBoundingClientRect()
      const target = { x: tr.left + tr.width / 2 - cr.left, y: tr.top + tr.height / 2 - cr.top }
      const sx = fromX ?? target.x + (Math.random() - 0.5) * cr.width * 0.6
      const scale = Math.min(1.2, Math.max(0.7, cr.width / 1300))
      strikes.current.push({ segs: buildBolt({ x: sx, y: -20 }, target, scale), born: performance.now() })
      flash.start({ opacity: [0, 0.75, 0.1, 0.5, 0], transition: { duration: 0.6, times: [0, 0.08, 0.2, 0.3, 1] } })
      setHit((h) => h + 1)
      setCaught((n) => n + 1)
      // Most lightning currents lie between roughly 10 and 100 kA
      setKa(Math.round(12 + Math.random() * 70))
    },
    [flash],
  )

  // Canvas loop: rain and lightning
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    let raf = 0
    let w = 0, h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const drops: { x: number; y: number; l: number; v: number }[] = []

    const resize = () => {
      const r = c.getBoundingClientRect()
      w = r.width; h = r.height
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drops.length = 0
      const n = reduce ? 0 : Math.round((w * h) / 9000)
      for (let i = 0; i < n; i++) drops.push({ x: Math.random() * w, y: Math.random() * h, l: 10 + Math.random() * 18, v: 9 + Math.random() * 8 })
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(c)

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      // rain
      ctx.strokeStyle = 'rgba(156,195,224,0.16)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (const d of drops) {
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - d.l * 0.25, d.y + d.l)
        d.y += d.v; d.x -= d.v * 0.25
        if (d.y > h) { d.y = -20; d.x = Math.random() * (w + 100) }
      }
      ctx.stroke()
      // lightning
      strikes.current = strikes.current.filter((s) => t - s.born < LIFE)
      for (const s of strikes.current) {
        const age = (t - s.born) / LIFE
        const flicker = age < 0.12 ? 1 : age < 0.2 ? 0.25 : age < 0.32 ? 0.9 : 1 - (age - 0.32) / 0.68
        for (const seg of s.segs) {
          const a = Math.max(0, flicker) * seg.alpha
          ctx.lineJoin = 'round'; ctx.lineCap = 'round'
          ctx.shadowColor = 'rgba(170,210,255,0.9)'
          ctx.shadowBlur = 28
          ctx.strokeStyle = `rgba(190,220,255,${a * 0.55})`
          ctx.lineWidth = seg.width * 3.2
          ctx.beginPath()
          seg.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
          ctx.stroke()
          ctx.shadowBlur = 0
          ctx.strokeStyle = `rgba(255,255,255,${a})`
          ctx.lineWidth = seg.width
          ctx.stroke()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    const start = () => { if (!raf) raf = requestAnimationFrame(draw) }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }

    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting
      if (e.isIntersecting) start(); else stop()
    })
    if (sectionRef.current) io.observe(sectionRef.current)
    start()
    return () => { stop(); ro.disconnect(); io.disconnect() }
  }, [reduce])

  // Automatic strikes while the hero is visible
  useEffect(() => {
    if (reduce) return
    let timer: number
    const loop = (first: boolean) => {
      timer = window.setTimeout(() => {
        if (visible.current && !document.hidden) strike()
        loop(false)
      }, first ? 1700 : 5200 + Math.random() * 3800)
    }
    loop(true)
    return () => window.clearTimeout(timer)
  }, [reduce, strike])

  const onSky = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.target as HTMLElement
    if (el.closest('a, button')) return
    const r = canvasRef.current?.getBoundingClientRect()
    if (!r) return
    strike(e.clientX - r.left)
  }

  return (
    <section ref={sectionRef} className="hero grid-dark" id="top" onPointerDown={onSky} aria-labelledby="hero-title">
      <canvas ref={canvasRef} className="sky" aria-hidden="true" />
      <motion.div className="hero-flash" animate={flash} aria-hidden="true" />

      <div className="wrap hero-inner">
        <div className="hero-copy">
          <motion.div
            className="hero-meta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span><Check size={16} style={{ color: 'var(--signal)' }} />VDB-zertifizierter Fachbetrieb</span>
            <span><Check size={16} style={{ color: 'var(--signal)' }} />Seit über 100 Jahren</span>
            <span><Check size={16} style={{ color: 'var(--signal)' }} />4 Standorte in Süddeutschland</span>
          </motion.div>

          <RevealText as="h1" id="hero-title" className="display hero-title" text="Wir leiten den Blitz dorthin, wo er keinen Schaden anrichtet." immediate delay={0.2} />

          <motion.p
            className="lead muted"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75 }}
          >
            Planung, Bau und Prüfung von Blitzschutzanlagen, Erdung und Überspannungsschutz – für Wohnhäuser, Gewerbe, PV-Anlagen und öffentliche Gebäude.
          </motion.p>

          <motion.div
            className="hero-btns"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
          >
            <Magnetic><a className="btn btn-signal" href="#kontakt">Kostenlose Bestandsaufnahme anfragen</a></Magnetic>
            <Magnetic><a className="btn btn-ghost" href={contact.phoneHref}><Phone size={18} />{contact.phone}</a></Magnetic>
          </motion.div>

          <motion.div className="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
            <div className="readout" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={hit}
                  className="readout-n"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {hit ? ka : '–'}<small>kA</small>
                </motion.div>
              </AnimatePresence>
              <div className="readout-s">
                <span className="tech"><i aria-hidden="true" />Live-Simulation</span><br />
                {hit ? <>Blitzstrom sicher abgeleitet, {caught} {caught === 1 ? 'Blitz' : 'Blitze'} eingefangen</> : 'Warten auf den nächsten Blitz'}
              </div>
            </div>
            {!reduce && <p className="hero-hint" style={{ margin: 0 }}><i aria-hidden="true" />Tippen Sie in den Himmel, um selbst einen Blitz auszulösen.</p>}
          </motion.div>
        </div>

        <motion.div
          className="house-wrap"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <House tipRef={tipRef} hit={hit} />
        </motion.div>
      </div>

      <div className="ground" aria-hidden="true" />

      <nav className="hero-strip" aria-label="Leistungen im Überblick">
        <div className="wrap strip-row">
          {parts.map((p, i) => (
            <motion.a
              key={p.id}
              className="strip-item"
              href={`#part-${p.id}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 + i * 0.07 }}
            >
              <span className="strip-ico"><PartGlyph id={p.id} size={24} /></span>
              <span><b>{p.title}</b><span className="tech">{p.tech}</span></span>
            </motion.a>
          ))}
        </div>
      </nav>
    </section>
  )
}

/** House cross-section. When `hit` changes, current runs from the air terminal through the conductors into the earth ring. */
function House({ tipRef, hit }: { tipRef: React.RefObject<SVGCircleElement>; hit: number }) {
  const line = '#9CC3E0'
  const cond = '#F28C00'
  const run = (delay: number, dur: number) => ({
    initial: { pathLength: 0, opacity: 1 },
    animate: { pathLength: 1, opacity: [1, 1, 0] },
    transition: { pathLength: { duration: dur, delay, ease: 'easeIn' as const }, opacity: { duration: dur + 1.1, delay, times: [0, 0.6, 1] } },
  })
  return (
    <svg viewBox="40 70 600 540" role="img" aria-label="Querschnitt eines Hauses mit Fangstange, Ableitungen, Überspannungsschutz und Erdungsanlage">
      <defs>
        <filter id="hglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* annex */}
      <rect x="460" y="380" width="100" height="120" fill="#0B2E48" stroke={line} strokeOpacity=".7" strokeWidth="1.5" />
      <rect x="484" y="418" width="52" height="40" fill="none" stroke={line} strokeOpacity=".45" />
      {/* house */}
      <rect x="140" y="300" width="320" height="200" fill="#0B2E48" stroke={line} strokeOpacity=".7" strokeWidth="1.5" />
      <polygon points="120,302 300,170 480,302" fill="#0F3A5A" stroke={line} strokeOpacity=".7" strokeWidth="1.5" strokeLinejoin="round" />
      <g stroke={line} strokeOpacity=".7" strokeWidth="1" fill="#14507C">
        <polygon points="318,192 352,217 344,227 310,202" />
        <polygon points="356,220 390,245 382,255 348,230" />
        <polygon points="394,248 428,273 420,283 386,258" />
      </g>
      <g fill="none" stroke={line} strokeOpacity=".45" strokeWidth="1.2">
        <rect x="270" y="225" width="60" height="40" rx="2" />
        <rect x="290" y="420" width="44" height="80" />
        <rect x="180" y="340" width="56" height="50" /><line x1="208" y1="340" x2="208" y2="390" />
        <rect x="380" y="340" width="56" height="50" /><line x1="408" y1="340" x2="408" y2="390" />
      </g>
      {/* soil */}
      <rect x="40" y="500" width="600" height="110" fill="#041A2A" />
      <line x1="40" y1="500" x2="640" y2="500" stroke={line} strokeOpacity=".5" strokeWidth="1.5" />
      {/* protection system, resting state */}
      <g stroke={cond} strokeOpacity=".55" fill="none" strokeWidth="2.5" strokeLinejoin="round">
        <line x1="300" y1="170" x2="300" y2="104" strokeWidth="3" strokeLinecap="round" strokeOpacity="1" />
        <line x1="530" y1="380" x2="530" y2="346" strokeWidth="3" strokeLinecap="round" />
        <polyline points="300,172 118,304 118,548" />
        <polyline points="300,172 482,304 482,378 566,378 566,548" />
        <ellipse cx="342" cy="552" rx="250" ry="22" />
        <line x1="150" y1="482" x2="430" y2="482" strokeWidth="1.5" strokeDasharray="6 4" />
      </g>
      <rect x="196" y="420" width="40" height="52" rx="4" fill="#041A2A" stroke={cond} strokeWidth="1.8" />
      <path d="M219 428 l-8 14 h8 l-6 14" fill="none" stroke={cond} strokeWidth="2" strokeLinejoin="round" />
      <rect x="112" y="462" width="12" height="14" fill="#041A2A" stroke={cond} strokeWidth="1.6" />
      <rect x="560" y="462" width="12" height="14" fill="#041A2A" stroke={cond} strokeWidth="1.6" />

      {/* current pulse */}
      {hit > 0 && (
        <g key={hit} stroke="#FFD18A" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#hglow)">
          <motion.path d="M300 104 L300 172" {...run(0, 0.12)} />
          <motion.path d="M300 172 L118 304 L118 548" {...run(0.1, 0.5)} />
          <motion.path d="M300 172 L482 304 L482 378 L566 378 L566 548" {...run(0.1, 0.55)} />
          <motion.path d="M118 552 A250 22 0 0 0 592 552" {...run(0.58, 0.55)} />
          <motion.path d="M118 552 A250 22 0 0 1 592 552" {...run(0.6, 0.55)} />
          <motion.rect x="196" y="420" width="40" height="52" rx="4" strokeWidth="2.5"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.9, delay: 0.35 }} />
        </g>
      )}

      {/* air terminal tip – the strike target */}
      <circle cx="300" cy="104" r="10" fill={cond} opacity=".25">
        <animate attributeName="r" values="6;16;6" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".4;0;.4" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle ref={tipRef} cx="300" cy="104" r="4.5" fill="#fff" />

      <g fill="#CFE3F2" fontSize="14" className="tech" style={{ fontStretch: '75%' }}>
        <line x1="308" y1="104" x2="372" y2="104" stroke="#CFE3F2" strokeOpacity=".5" />
        <text x="380" y="109">Fangstange</text>
        <line x1="112" y1="400" x2="56" y2="400" stroke="#CFE3F2" strokeOpacity=".5" />
        <text x="56" y="392">Ableitung</text>
        <text x="196" y="410" textAnchor="start">Überspannungsschutz</text>
        <text x="500" y="598">Erdungsanlage</text>
      </g>
    </svg>
  )
}
