import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import photo from '../assets/techniker.jpg'
import { references } from '../data/content'
import { usePrefersReducedMotion } from '../hooks'
import { Bolt } from './Icons'
import RevealText from './RevealText'

const values = [
  { t: 'Beständig', d: 'Ein Familienname, über 100 Jahre Erfahrung im Blitzableiterbau.', icon: <path d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-5h4v5" /> },
  { t: 'Zertifiziert', d: 'Vom VDB zertifizierte Blitzschutzfachkräfte auf jeder Baustelle.', icon: <><circle cx="12" cy="9" r="5" /><path d="M9 13.5 8 21l4-2 4 2-1-7.5" /></> },
  { t: 'Fair', d: 'Transparente Angebote und ein faires Preis-Leistungs-Verhältnis.', icon: <path d="M12 3v18M5 7h14M5 7l-3 7h6zM19 7l-3 7h6z" /> },
  { t: 'Weitergebildet', d: 'Regelmäßige Schulungen nach aktuellem Stand von Technik und Normen.', icon: <path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5" /> },
]

export default function Company() {
  const numRef = useRef<HTMLDivElement>(null)
  const inView = useInView(numRef, { once: true, amount: 0.6 })
  const reduce = usePrefersReducedMotion()
  const [n, setN] = useState(reduce ? 100 : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, 100, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduce])

  const photoRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '0%'])

  return (
    <section id="unternehmen" className="sec dark" aria-labelledby="co-title">
      <div className="wrap co">
        <div>
          <div ref={numRef} className="co-big" aria-label="Über 100 Jahre">
            <span aria-hidden="true" style={{ color: 'inherit' }}>{n}</span><span aria-hidden="true">+</span>
          </div>
          <p className="h3" style={{ marginTop: 24, fontStretch: '125%' }}>Jahre Blitzschutz aus Nördlingen</p>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            <motion.figure
              ref={photoRef}
              className="co-photo"
              variants={{
                hidden: { clipPath: 'inset(100% 0% 0% 0% round 28px)' },
                show: { clipPath: 'inset(0% 0% 0% 0% round 28px)', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
              }}
              style={{ marginInline: 0 }}
            >
              <motion.img src={photo} alt="Ein Techniker von Blitzschutz Däumling misst mit einem Prüfgerät an der Erdungsanlage eines Gebäudes" style={{ y }} loading="lazy" />
              <figcaption>Messung an der Erdungsanlage</figcaption>
            </motion.figure>
          </motion.div>
        </div>

        <div>
          <RevealText id="co-title" className="h2" text="Kompetenz, die seit über einem Jahrhundert wächst" />
          <p className="lead muted" style={{ marginTop: 24 }}>
            Als spezialisierter Blitzschutz-Fachbetrieb legen wir Wert auf Qualität, Sicherheit und nachhaltigen Schutz für Ihre Immobilien. Wir installieren, prüfen und warten Ihre Anlagen immer nach aktuellem Stand von Technik und Normen.
          </p>
          <p className="lead muted" style={{ marginTop: 16 }}>
            Weil Wissen veraltet, investieren wir kontinuierlich in die Weiterbildung unseres Teams – und geben das Gelernte gern an Sie weiter.
          </p>
          <div className="vals">
            {values.map((v, i) => (
              <motion.div
                key={v.t}
                className="val"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F28C00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{v.icon}</svg>
                <h3 className="h3">{v.t}</h3>
                <p className="muted">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="marquee" aria-label="Referenzen: Große Kreisstadt Donauwörth, Donauries, Stadt Aalen. Kundenzufriedenheit 5,0 von 5.">
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map((k) => (
            <div key={k} className="marquee-item">
              {[...references, '5,0 von 5 Kundenzufriedenheit', 'VDB-zertifiziert'].map((r) => (
                <span key={r + k} style={{ display: 'inline-flex', alignItems: 'center', gap: 64 }}>
                  {r}<Bolt size={22} style={{ color: 'var(--signal)' }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
