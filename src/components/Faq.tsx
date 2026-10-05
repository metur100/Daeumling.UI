import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { contact, faqs } from '../data/content'
import { Phone, Plus } from './Icons'
import Magnetic from './Magnetic'
import RevealText from './RevealText'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="sec light" aria-labelledby="faq-title">
      <div className="wrap faq">
        <div>
          <RevealText id="faq-title" className="h2" text="Häufige Fragen" />
          <p className="lead muted" style={{ marginTop: 24, marginBottom: 28 }}>Ihre Frage ist nicht dabei? Wir beraten Sie gern persönlich.</p>
          <Magnetic><a className="btn btn-ink" href={contact.phoneHref}><Phone size={18} />{contact.phone}</a></Magnetic>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => {
            const on = open === i
            return (
              <div key={f.q} className={`faq-item ${on ? 'on' : ''}`}>
                <h3 style={{ margin: 0 }}>
                  <button type="button" className="faq-q" aria-expanded={on} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(on ? null : i)}>
                    {f.q}
                    <span className="faq-plus" aria-hidden="true"><Plus size={18} /></span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`faq-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
