import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import mascot from '../assets/mascot.png'
import { contact, nav } from '../data/content'
import { Close, Menu, Phone } from './Icons'
import Magnetic from './Magnetic'

export default function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // highlight the section currently in view
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  return (
    <>
      <header className={`hdr ${solid || open ? 'solid' : ''}`}>
        <div className="wrap hdr-row">
          <a className="brand" href="#top" aria-label="Blitzschutz Däumling – zur Startseite" onClick={() => setOpen(false)}>
            <img src={mascot} alt="" width={83} height={75} />
            <span className="brand-word"><small>Blitzschutz</small><b>Däumling</b></span>
          </a>

          <nav className="nav" aria-label="Hauptnavigation">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined}>
                {active === n.id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hdr-actions">
            <span className="hdr-cta"><Magnetic><a className="btn btn-signal btn-sm" href="#kontakt">Anfrage stellen</a></Magnetic></span>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="mnav"
              aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
        <motion.div className="hdr-progress" style={{ scaleX: progress }} aria-hidden="true" />
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mnav"
            className="mnav"
            aria-label="Mobile Navigation"
            initial={{ clipPath: 'circle(0% at calc(100% - 48px) 44px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 48px) 44px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 48px) 44px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {nav.map((n, i) => (
              <motion.a
                key={n.id}
                className="ml"
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.5 }}
              >
                {n.label}
                <span aria-hidden="true" style={{ color: 'var(--signal)', fontSize: 22 }}>+</span>
              </motion.a>
            ))}
            <motion.div className="mnav-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <a className="btn btn-signal" href="#kontakt" onClick={() => setOpen(false)}>Kostenlose Bestandsaufnahme anfragen</a>
              <a className="btn btn-ghost" href={contact.phoneHref}><Phone size={18} />{contact.phone}</a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

/** The page's down-conductor: a thin line at the left edge that fills with current as you scroll towards the ground. */
export function Rail() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })
  const top = useTransform(p, (v) => `${v * 100}%`)
  return (
    <div className="rail" aria-hidden="true">
      <motion.div className="rail-fill" style={{ scaleY: p }} />
      <motion.div className="rail-tip" style={{ top }} />
    </div>
  )
}
