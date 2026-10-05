import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Check, Chevron } from './Icons'
import Magnetic from './Magnetic'
import RevealText from './RevealText'

const questions = [
  {
    q: 'Um welches Gebäude geht es?',
    opts: [
      { v: 'efh', l: 'Einfamilien- oder Mehrfamilienhaus' },
      { v: 'gewerbe', l: 'Gewerbe oder Industrie' },
      { v: 'oeffentlich', l: 'Öffentliches Gebäude' },
      { v: 'land', l: 'Landwirtschaftliches Gebäude' },
    ],
  },
  {
    q: 'Gibt es eine PV-Anlage auf dem Dach?',
    opts: [
      { v: 'ja', l: 'Ja' },
      { v: 'geplant', l: 'Ist geplant' },
      { v: 'nein', l: 'Nein' },
    ],
  },
  {
    q: 'Wann wurde Ihre Blitzschutzanlage zuletzt geprüft?',
    opts: [
      { v: 'lt2', l: 'Vor weniger als 2 Jahren' },
      { v: '2to4', l: 'Vor 2 bis 4 Jahren' },
      { v: 'gt4', l: 'Vor mehr als 4 Jahren' },
      { v: 'unknown', l: 'Weiß ich nicht' },
      { v: 'none', l: 'Wir haben keine Anlage' },
    ],
  },
]

type Result = { level: 0 | 1 | 2; title: string; tips: string[]; summary: string }

function evaluate(a: string[]): Result {
  const [b, pv, last] = a
  let score = { lt2: 0, '2to4': 1, gt4: 2, unknown: 2, none: 3 }[last as 'lt2'] ?? 2
  if (pv !== 'nein' && last !== 'lt2') score += 1
  const level: Result['level'] = score === 0 ? 0 : score <= 2 ? 1 : 2
  const tips: string[] = []
  if (last === 'none') tips.push('Wir klären vor Ort, ob für Ihr Gebäude eine Blitzschutzanlage vorgeschrieben oder sinnvoll ist.')
  if (last === 'gt4' || last === 'unknown') tips.push('Je nach Schutzklasse sind umfassende Prüfungen alle zwei bis vier Jahre vorgesehen – Ihre Anlage ist vermutlich überfällig.')
  if (last === '2to4') tips.push('Eine umfassende Prüfung steht bald an – je nach Schutzklasse alle zwei bis vier Jahre.')
  if (last === 'lt2') tips.push('Ihre Prüfung ist aktuell. Wir erinnern Sie gern rechtzeitig an den nächsten Termin.')
  if (pv === 'ja') tips.push('PV-Anlagen brauchen einen abgestimmten Überspannungsschutz für Wechselrichter und Leitungen.')
  if (pv === 'geplant') tips.push('Planen Sie den Blitzschutz gleich mit der PV-Anlage – das spart spätere Umbauten.')
  if (b === 'gewerbe' || b === 'oeffentlich') tips.push('Für gewerbliche und öffentliche Gebäude verlangen Behörden und Versicherer häufig einen aktuellen Prüfnachweis.')
  if (b === 'land') tips.push('Freistehende Hallen und Ställe sind besonders exponiert – ein geprüfter Schutz sichert Tiere, Maschinen und Ernte.')
  const title = ['Sie sind gut aufgestellt', 'Eine Prüfung ist empfehlenswert', 'Hier besteht Handlungsbedarf'][level]
  const labels = a.map((v, i) => questions[i].opts.find((o) => o.v === v)?.l).join(', ')
  return { level, title, tips, summary: `Blitz-Check: ${labels}. Ergebnis: ${title}.` }
}

export default function BlitzCheck({ onResult }: { onResult: (summary: string) => void }) {
  const [answers, setAnswers] = useState<string[]>([])
  const step = answers.length
  const done = step >= questions.length
  const result = done ? evaluate(answers) : null

  const pick = (v: string) => {
    const next = [...answers, v]
    setAnswers(next)
    if (next.length === questions.length) onResult(evaluate(next).summary)
  }

  return (
    <section id="check" className="sec light" aria-labelledby="check-title">
      <div className="wrap check">
        <div>
          <RevealText id="check-title" className="h2" text="Wie gut ist Ihr Gebäude geschützt?" />
          <p className="lead muted" style={{ marginTop: 24 }}>Drei Fragen, eine erste Einschätzung in wenigen Sekunden. Danach besprechen wir das Ergebnis gern persönlich – kostenlos.</p>
        </div>

        <div className="check-card" aria-live="polite">
          <div className="check-progress" aria-hidden="true">
            {questions.map((_, i) => (
              <span key={i}><motion.i initial={false} animate={{ scaleX: i < step ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} /></span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tech muted" style={{ fontSize: 15 }}>Frage {step + 1} von {questions.length}</div>
                <p className="check-q">{questions[step].q}</p>
                <div className="check-opts">
                  {questions[step].opts.map((o) => (
                    <button key={o.v} type="button" className="check-opt" onClick={() => pick(o.v)}>
                      {o.l}<Chevron size={18} />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              result && (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div className="gauge">
                    <Gauge level={result.level} />
                    <p className="result-title">{result.title}</p>
                  </div>
                  <ul className="result-list">
                    {result.tips.map((t, i) => (
                      <motion.li key={t} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.12 }}>
                        <Check size={18} style={{ color: 'var(--signal)' }} />{t}
                      </motion.li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <Magnetic><a className="btn btn-signal" href="#kontakt">Ergebnis kostenlos besprechen</a></Magnetic>
                    <button type="button" className="btn btn-sm" style={{ background: 'none', color: 'var(--tinte)' }} onClick={() => setAnswers([])}>Neu starten</button>
                  </div>
                  <p className="result-note">Unverbindliche Ersteinschätzung. Sie ersetzt keine Prüfung vor Ort.</p>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {step > 0 && !done && (
            <button type="button" className="check-back" onClick={() => setAnswers(answers.slice(0, -1))}>Zurück</button>
          )}
        </div>
      </div>
    </section>
  )
}

function Gauge({ level }: { level: 0 | 1 | 2 }) {
  const colors = ['#2E9E5B', '#F28C00', '#C4372B']
  const amount = [0.25, 0.6, 0.94][level]
  const angle = -90 + amount * 180
  return (
    <svg viewBox="0 0 120 70" aria-hidden="true">
      <path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="#CFDBE4" strokeWidth="10" strokeLinecap="round" />
      <motion.path
        d="M10 62 A50 50 0 0 1 110 62"
        fill="none"
        stroke={colors[level]}
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: amount }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      />
      <motion.g initial={{ rotate: -90 }} animate={{ rotate: angle }} transition={{ type: 'spring', stiffness: 60, damping: 9, delay: 0.15 }} style={{ originX: 0.5, originY: 1 }}>
        <line x1="60" y1="62" x2="60" y2="22" stroke="#082B44" strokeWidth="3" strokeLinecap="round" />
      </motion.g>
      <circle cx="60" cy="62" r="5" fill="#082B44" />
    </svg>
  )
}
