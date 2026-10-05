import { motion } from 'framer-motion'
import mascot from '../assets/mascot.png'
import { contact } from '../data/content'

export default function Footer() {
  return (
    <footer className="foot">
      <svg className="foot-earth" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true" style={{ height: 'clamp(80px, 10vw, 140px)' }}>
        <line x1="0" y1="30" x2="1440" y2="30" stroke="rgba(156,195,224,.35)" strokeWidth="1.5" />
        <motion.path d="M20 0 V70" stroke="#F28C00" strokeWidth="3" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} />
        <motion.ellipse cx="720" cy="80" rx="700" ry="34" fill="none" stroke="#F28C00" strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0.2 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, delay: 0.5, ease: 'easeInOut' }} />
      </svg>
      <div className="wrap">
        <p className="foot-claim">Geerdet seit über 100 Jahren.</p>
        <div className="foot-grid">
          <div className="foot-col" style={{ gap: 14 }}>
            <img src={mascot} alt="" width={56} height={51} style={{ width: 56 }} />
            <p style={{ margin: 0, color: '#fff', fontWeight: 700 }}>Blitzschutz Däumling GmbH</p>
            <p style={{ margin: 0, maxWidth: '26em' }}>Ihr Blitzschutz-Fachbetrieb für Stuttgart, Augsburg, Nürnberg, München, Kempten, Nördlingen und Ulm.</p>
          </div>
          <nav className="foot-col" aria-label="Leistungen">
            <p className="foot-title">Leistungen</p>
            <a href="#part-ableitung">Gebäudeblitzschutz</a>
            <a href="#part-spd">Überspannungsschutz</a>
            <a href="#part-pruefung">Prüfservice</a>
            <a href="#part-fang">Blitzschutzplanung</a>
            <a href="#part-erdung">Erdungsanlagen</a>
          </nav>
          <nav className="foot-col" aria-label="Unternehmen">
            <p className="foot-title">Unternehmen</p>
            <a href="#unternehmen">Über uns</a>
            <a href="#standorte">Standorte</a>
            <a href="#check">Blitz-Check</a>
            <a href="#wissen">News und Wissen</a>
            <a href="#broschuere">Broschüre 2026</a>
          </nav>
          <div className="foot-col">
            <p className="foot-title">Hauptsitz</p>
            <p style={{ margin: 0 }}>Bei der Industriestraße 1<br />86720 Nördlingen</p>
            <a href={contact.phoneHref}>{contact.phone}</a>
            <a href={contact.emailHref}>{contact.email}</a>
          </div>
        </div>
        <div className="foot-bar">
          <span>© 2026 Blitzschutz Däumling GmbH. Alle Rechte vorbehalten.</span>
          <nav aria-label="Rechtliches"><a href="#kontakt">Kontakt</a><a href="#top">Impressum</a><a href="#top">Datenschutz</a></nav>
        </div>
      </div>
    </footer>
  )
}
