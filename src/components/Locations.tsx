import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { locations } from '../data/content'
import RevealText from './RevealText'

type Loc = (typeof locations)[number]

const address = (l: Loc) => encodeURIComponent(`${l.street}, ${l.city}`)
// keyless Google Maps embed – shows one address at a time
const embed = (l: Loc) => `https://maps.google.com/maps?q=${address(l)}&z=14&hl=de&output=embed`
const route = (l: Loc) => `https://www.google.com/maps/dir/?api=1&destination=${address(l)}`

export default function Locations() {
  const [activeId, setActiveId] = useState(locations[0].id)
  const active = locations.find((l) => l.id === activeId)!

  return (
    <section id="standorte" className="sec dark grid-dark" aria-labelledby="loc-title">
      <div className="wrap">
        <div className="sec-head">
          <RevealText id="loc-title" className="h2" text="Immer in Ihrer Nähe" />
          <p className="lead muted">Vom Hauptsitz in Nördlingen und unseren Filialen in München, Vöhringen und Kempten betreuen wir Kunden in ganz Süddeutschland – von Stuttgart bis München, von Nürnberg bis ins Allgäu.</p>
        </div>

        <div className="locs">
          <div className="map">
            <iframe
              key={active.id}
              src={embed(active)}
              title={`Karte: ${active.name}, ${active.street}, ${active.city}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="loc-list">
            {locations.map((l) => {
              const on = l.id === activeId
              return (
                <div key={l.id}>
                  <button type="button" className={`loc ${on ? 'on' : ''}`} aria-expanded={on} onClick={() => setActiveId(l.id)}>
                    <span className="loc-head"><b>{l.name}</b><span className="tech">{l.role}</span></span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          className="loc-body"
                          style={{ display: 'block' }}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <span className="loc-body-in">
                            <span>{l.street}<br />{l.city}</span>
                            <span>Telefon {l.phone}<br />Fax {l.fax}</span>
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              )
            })}
            <p className="muted" style={{ fontSize: 15, margin: '8px 0 0', display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
              <span>Direkt anrufen: <a href={active.phoneHref} style={{ color: '#fff', fontWeight: 700 }}>{active.phone}</a></span>
              <a className="loc-route" href={route(active)} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>Route planen →</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
