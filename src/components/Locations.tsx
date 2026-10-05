import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { locations, serviceArea } from '../data/content'
import RevealText from './RevealText'

export default function Locations() {
  const [active, setActive] = useState('noerdlingen')
  const hq = locations[0]
  return (
    <section id="standorte" className="sec dark grid-dark" aria-labelledby="loc-title">
      <div className="wrap">
        <div className="sec-head">
          <RevealText id="loc-title" className="h2" text="Immer in Ihrer Nähe" />
          <p className="lead muted">Vom Hauptsitz in Nördlingen und unseren Filialen in München, Vöhringen und Kempten betreuen wir Kunden in ganz Süddeutschland – von Stuttgart bis München, von Nürnberg bis ins Allgäu.</p>
        </div>

        <div className="locs">
          <div className="map">
            <svg viewBox="0 0 640 520" role="img" aria-label="Karte des Einsatzgebiets in Süddeutschland" style={{ fontFamily: 'inherit' }}>
              <motion.path
                d="M90 362 C150 334 205 300 248 290 S340 252 386 226 S460 212 498 218 S580 192 640 158"
                fill="none" stroke="#1E557E" strokeWidth="5" strokeLinecap="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: 'easeInOut' }}
              />
              <text x="140" y="372" fill="#5E8FB3" fontSize="15" fontStyle="italic">Donau</text>
              <ellipse cx="148" cy="452" rx="58" ry="17" transform="rotate(-14 148 452)" fill="#0B2E48" stroke="#1E557E" strokeWidth="2" />
              <text x="96" y="492" fill="#5E8FB3" fontSize="15" fontStyle="italic">Bodensee</text>
              <path d="M240 512 l26 -30 l18 18 l24 -34 l22 26 l20 -22 l26 32 l24 -28 l30 34 l22 -20 l28 30 l24 -26 l30 30 l22 -18 l20 18" fill="none" stroke="#1E557E" strokeWidth="2" strokeLinejoin="round" />
              <text x="560" y="470" fill="#5E8FB3" fontSize="15" fontStyle="italic">Alpen</text>

              {serviceArea.map((c) => (
                <g key={c.name} fill="#9CC3E0" fontSize="16">
                  <circle cx={c.x} cy={c.y} r="5" />
                  <text x={c.name === 'Ulm' ? c.x - 12 : c.x + 12} y={c.y + 5} textAnchor={c.name === 'Ulm' ? 'end' : 'start'}>{c.name}</text>
                </g>
              ))}

              {/* connection from HQ to the selected branch */}
              <AnimatePresence>
                {active !== hq.id && (() => {
                  const b = locations.find((l) => l.id === active)!
                  const mx = (hq.x + b.x) / 2, my = Math.min(hq.y, b.y) - 40
                  return (
                    <motion.path
                      key={active}
                      d={`M${hq.x} ${hq.y} Q${mx} ${my} ${b.x} ${b.y}`}
                      fill="none" stroke="#F28C00" strokeWidth="2.5" strokeDasharray="7 7"
                      initial={{ pathLength: 0, opacity: 1 }} animate={{ pathLength: 1, opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                    />
                  )
                })()}
              </AnimatePresence>

              {locations.map((l) => {
                const on = l.id === active
                const left = l.id === 'muenchen'
                return (
                  <g key={l.id} className="map-pin" onClick={() => setActive(l.id)} onMouseEnter={() => setActive(l.id)} aria-hidden="true">
                    <circle cx={l.x} cy={l.y} r="24" fill="transparent" />
                    {on && <circle cx={l.x} cy={l.y} r="10" fill="none" stroke="#F28C00" strokeWidth="2" className="pulse" />}
                    <circle cx={l.x} cy={l.y} r={on ? 11 : 8} fill="#F28C00" style={{ transition: 'r .3s' }} />
                    <text x={left ? l.x - 18 : l.x + 18} y={l.y + 7} textAnchor={left ? 'end' : 'start'} fill="#fff" fontSize="20" fontWeight="700">{l.name}</text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="loc-list">
            {locations.map((l) => {
              const on = l.id === active
              return (
                <div key={l.id}>
                  <button type="button" className={`loc ${on ? 'on' : ''}`} aria-expanded={on} onClick={() => setActive(l.id)} onMouseEnter={() => setActive(l.id)}>
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
            <p className="muted" style={{ fontSize: 15, margin: '8px 0 0' }}>
              Direkt anrufen: <a href={locations.find((l) => l.id === active)!.phoneHref} style={{ color: '#fff', fontWeight: 700 }}>{locations.find((l) => l.id === active)!.phone}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
