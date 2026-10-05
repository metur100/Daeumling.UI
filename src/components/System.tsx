import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { parts, type PartId } from '../data/content'
import { usePrefersReducedMotion } from '../hooks'
import RevealText from './RevealText'

const CYCLE = 6500

export default function System() {
  const [active, setActive] = useState<PartId>('fang')
  const [auto, setAuto] = useState(true)
  const reduce = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35 })

  // cycle through the parts until the visitor takes over
  useEffect(() => {
    if (!auto || reduce || !inView) return
    const t = window.setTimeout(() => {
      const i = parts.findIndex((p) => p.id === active)
      setActive(parts[(i + 1) % parts.length].id)
    }, CYCLE)
    return () => window.clearTimeout(t)
  }, [active, auto, reduce, inView])

  // links from the hero strip (#part-xyz) open the matching part
  useEffect(() => {
    const on = () => {
      const m = window.location.hash.match(/^#part-(\w+)/)
      if (m && parts.some((p) => p.id === m[1])) { setActive(m[1] as PartId); setAuto(false) }
    }
    on()
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const choose = (id: PartId) => { setActive(id); setAuto(false) }

  return (
    <section id="system" className="sec light" aria-labelledby="system-title">
      <div className="wrap">
        <div className="sec-head">
          <RevealText id="system-title" className="h2" text="Ein Schutzsystem, fünf Disziplinen" />
          <p className="lead muted">Wirksamer Blitzschutz entsteht erst, wenn alle Teile zusammenspielen. Wählen Sie ein Bauteil und sehen Sie, wo es im Gebäude sitzt und was wir dafür tun.</p>
        </div>

        <div className="anat" ref={ref}>
          <div className="anat-list" role="list">
            {parts.map((p) => {
              const on = p.id === active
              return (
                <div key={p.id} id={`part-${p.id}`} className={`anat-item ${on ? 'on' : ''}`} role="listitem" style={{ scrollMarginTop: 120 }}>
                  <button
                    type="button"
                    className="anat-btn"
                    aria-expanded={on}
                    aria-controls={`part-body-${p.id}`}
                    onClick={() => choose(p.id)}
                    onFocus={() => setAuto(false)}
                  >
                    <span className="anat-dot" aria-hidden="true" />
                    <span className="h3">{p.title}</span>
                    <span className="tech">{p.tech}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`part-body-${p.id}`}
                        className="anat-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="anat-body-in">
                          <p className="muted" style={{ margin: 0 }}>{p.text}</p>
                          <ul className="anat-points">
                            {p.points.map((pt) => <li key={pt}>{pt}</li>)}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {on && auto && !reduce && inView && (
                    <motion.span
                      key={`t-${p.id}`}
                      className="anat-timer"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE / 1000, ease: 'linear' }}
                      style={{ width: '100%' }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })}
          </div>

          <figure className="anat-fig" style={{ margin: 0 }}>
            <Blueprint active={active} onPick={choose} />
            <figcaption className="anat-caption">
              <span>Schematischer Gebäudeschnitt</span>
              <span>Aktiv: {parts.find((p) => p.id === active)?.tech}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function Blueprint({ active, onPick }: { active: PartId; onPick: (id: PartId) => void }) {
  const ink = '#0B3A5A'
  const blue = '#0075BE'
  const o = '#F28C00'
  const st = (id: PartId) => ({
    stroke: active === id ? o : blue,
    strokeOpacity: active === id ? 1 : 0.38,
    strokeWidth: active === id ? 3.5 : 2,
    style: { transition: 'stroke .4s, stroke-opacity .4s, stroke-width .4s' },
  })
  const flow = (id: PartId) => (active === id ? 'flow' : undefined)
  const hot: Record<PartId, [number, number]> = {
    fang: [300, 104], ableitung: [118, 400], erdung: [342, 574], spd: [216, 446], pruefung: [566, 469],
  }
  return (
    <svg viewBox="30 70 610 540" role="img" aria-label="Gebäudeschnitt mit hervorgehobenem Bauteil">
      {/* building */}
      <g fill="#fff" stroke={ink} strokeOpacity=".55" strokeWidth="1.5">
        <rect x="460" y="380" width="100" height="120" />
        <rect x="140" y="300" width="320" height="200" />
        <polygon points="120,302 300,170 480,302" strokeLinejoin="round" />
      </g>
      <g fill="none" stroke={ink} strokeOpacity=".3" strokeWidth="1.2">
        <rect x="270" y="225" width="60" height="40" rx="2" />
        <rect x="290" y="420" width="44" height="80" />
        <rect x="180" y="340" width="56" height="50" />
        <rect x="380" y="340" width="56" height="50" />
        <rect x="484" y="418" width="52" height="40" />
        <polygon points="318,192 352,217 344,227 310,202" />
        <polygon points="356,220 390,245 382,255 348,230" />
        <polygon points="394,248 428,273 420,283 386,258" />
      </g>
      <line x1="30" y1="500" x2="640" y2="500" stroke={ink} strokeOpacity=".6" strokeWidth="1.5" />
      <g stroke={ink} strokeOpacity=".12">
        {Array.from({ length: 30 }).map((_, i) => <line key={i} x1={30 + i * 22} y1="604" x2={52 + i * 22} y2="504" />)}
      </g>

      {/* parts */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g {...st('fang')}>
          <line x1="300" y1="170" x2="300" y2="100" />
          <line x1="530" y1="380" x2="530" y2="344" />
          <line x1="300" y1="172" x2="480" y2="303" className={flow('fang')} />
          <line x1="300" y1="172" x2="120" y2="303" className={flow('fang')} />
        </g>
        <g {...st('ableitung')}>
          <polyline points="120,304 118,304 118,548" className={flow('ableitung')} />
          <polyline points="482,304 482,378 566,378 566,548" className={flow('ableitung')} />
        </g>
        <g {...st('erdung')}>
          <ellipse cx="342" cy="552" rx="250" ry="22" className={flow('erdung')} />
          <line x1="118" y1="548" x2="118" y2="596" />
          <line x1="566" y1="548" x2="566" y2="596" />
          <rect x="134" y="500" width="332" height="26" strokeDasharray="4 4" />
        </g>
        <g {...st('spd')}>
          <rect x="196" y="420" width="40" height="52" rx="4" fill="#fff" />
          <path d="M219 428 l-8 14 h8 l-6 14" />
          <line x1="150" y1="482" x2="430" y2="482" strokeDasharray="6 4" className={flow('spd')} />
        </g>
        <g {...st('pruefung')}>
          <rect x="112" y="462" width="12" height="14" fill="#fff" />
          <rect x="560" y="462" width="12" height="14" fill="#fff" />
          <rect x="590" y="418" width="34" height="46" rx="5" fill="#fff" />
          <path d="M597 432 h20 M597 442 h14" />
          <path d="M607 464 L572 469" strokeDasharray="3 4" className={flow('pruefung')} />
        </g>
      </g>

      {/* hotspots */}
      {parts.map((p) => {
        const [x, y] = hot[p.id]
        const on = active === p.id
        return (
          <g key={p.id} onClick={() => onPick(p.id)} style={{ cursor: 'pointer' }} aria-hidden="true">
            <circle cx={x} cy={y} r="22" fill="transparent" />
            {on && (
              <circle cx={x} cy={y} r="10" fill="none" stroke={o} strokeWidth="2">
                <animate attributeName="r" values="10;26" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={x} cy={y} r={on ? 9 : 7} fill={on ? o : '#fff'} stroke={on ? o : blue} strokeWidth="2.5" style={{ transition: 'all .3s' }} />
          </g>
        )
      })}
    </svg>
  )
}
