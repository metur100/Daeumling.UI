import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useState, type PointerEvent } from 'react'
import { posts } from '../data/content'
import { useFinePointer } from '../hooks'
import RevealText from './RevealText'

export default function Knowledge() {
  return (
    <section id="wissen" className="sec light" aria-labelledby="wissen-title">
      <div className="wrap">
        <div className="sec-head">
          <RevealText id="wissen-title" className="h2" text="Wissen rund um Blitzschutz" />
          <div>
            <p className="lead muted">Neue Entwicklungen, Sicherheitstipps und Hintergründe – damit Sie Ihre Gebäude optimal schützen.</p>
            <a className="textlink" href="#wissen" style={{ marginTop: 14 }}>Alle Beiträge im Blog</a>
          </div>
        </div>
        <div className="posts">
          {posts.map((p, i) => <Post key={p.title} {...p} delay={i * 0.1} />)}
        </div>
      </div>
    </section>
  )
}

function Post({ title, text, art, delay }: (typeof posts)[number] & { delay: number }) {
  const fine = useFinePointer()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 20 })
  const sry = useSpring(ry, { stiffness: 200, damping: 20 })
  const [hover, setHover] = useState(false)
  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!fine) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8)
  }
  const leave = () => { rx.set(0); ry.set(0); setHover(false) }
  return (
    <motion.a
      className="post"
      href="#wissen"
      onPointerMove={move}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={leave}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{ rotateX: srx, rotateY: sry }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay }}
    >
      <div className="post-art">
        {art === 'odds' && <Odds hover={hover} />}
        {art === 'bonding' && <Bonding hover={hover} />}
        {art === 'systems' && <Systems hover={hover} />}
      </div>
      <h3 className="h3">{title}</h3>
      <p className="muted">{text}</p>
      <span className="textlink" style={{ color: 'var(--marke)' }}>Weiterlesen</span>
    </motion.a>
  )
}

const ink = '#082B44'
const o = '#F28C00'

function Odds({ hover }: { hover: boolean }) {
  const dots = []
  for (let r = 0; r < 8; r++) for (let c = 0; c < 16; c++) if (!(r === 5 && c === 11)) dots.push(<circle key={`${r}-${c}`} cx={60 + c * 32} cy={150 + r * 26} r="5" fill="#9DB4C6" />)
  return (
    <svg viewBox="0 0 600 400" aria-hidden="true">
      <rect width="600" height="400" fill="#E3ECF2" />
      {dots}
      <circle cx={412} cy={280} r="9" fill={o} />
      <motion.circle cx={412} cy={280} fill="none" stroke={o} strokeWidth="2" animate={{ r: hover ? 34 : 20, opacity: hover ? 0.4 : 1 }} transition={{ duration: 0.5 }} />
      <motion.polyline
        points="450,30 418,112 436,118 410,252"
        fill="none" stroke={ink} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"
        animate={{ pathLength: hover ? [0, 1] : 1 }} transition={{ duration: 0.45, ease: 'easeIn' }}
      />
    </svg>
  )
}

function Bonding({ hover }: { hover: boolean }) {
  const xs = [160, 240, 320, 400]
  return (
    <svg viewBox="0 0 600 400" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect width="600" height="400" fill="#FBE8CC" />
      <rect x="110" y="270" width="380" height="34" rx="6" fill={o} stroke={ink} strokeWidth="3" />
      {[...xs, 460].map((x) => <circle key={x} cx={x} cy={287} r="6" fill={ink} />)}
      <g stroke={ink} strokeWidth="3">
        <rect x="132" y="120" width="56" height="50" rx="6" /><path d="M146 145h28M160 132v26" />
        <path d="M220 110h60v60h-60z" /><path d="M232 126h36M232 140h36M232 154h24" />
        <path d="M296 100h48l-10 50h-28z" />
        <path d="M372 120h56v50h-56z" /><path d="M386 134l14 14 14-14" />
        <path d="M460 270v40M440 310h40M447 322h26M454 334h12" />
      </g>
      {xs.map((x, i) => (
        <motion.path key={x} d={`M${x} 270 V170`} stroke={hover ? o : ink} strokeWidth="3"
          animate={{ pathLength: hover ? [0, 1] : 1 }} transition={{ duration: 0.4, delay: i * 0.08 }} />
      ))}
    </svg>
  )
}

function Systems({ hover }: { hover: boolean }) {
  return (
    <svg viewBox="0 -50 600 400" aria-hidden="true" fill="none" strokeLinejoin="round" strokeLinecap="round">
      <rect y="-50" width="600" height="400" fill="#DCE8EE" />
      <line x1="30" y1="240" x2="570" y2="240" stroke={ink} strokeWidth="2" />
      <g stroke={ink} strokeWidth="3"><path d="M50 240V170l60-50 60 50v70" /><path d="M230 240V150h140v90" /><path d="M430 240v-60h100v60" /></g>
      <motion.g stroke={o} strokeWidth="3" animate={{ y: hover ? -6 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
        <path d="M110 120V80" /><path d="M50 170v70" />
      </motion.g>
      <g stroke={o} strokeWidth="2.5"><path d="M230 150h140M230 150v90M370 150v90M265 150v-8M300 150v-8M335 150v-8" /></g>
      <g stroke={o} strokeWidth="1.5" strokeDasharray="4 4"><path d="M265 150v90M300 150v90M335 150v90" /></g>
      <g stroke={o} strokeWidth="3"><path d="M556 240V60M540 240h32" /></g>
      <motion.path d="M556 60 470 175" stroke={o} strokeWidth="1.5" strokeDasharray="6 6" animate={{ pathLength: hover ? [0, 1] : 1 }} transition={{ duration: 0.6 }} />
    </svg>
  )
}
