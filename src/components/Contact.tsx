import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type FormEvent } from 'react'
import { contact } from '../data/content'
import { Doc, Mail, Phone } from './Icons'
import Magnetic from './Magnetic'
import RevealText from './RevealText'

const kinds = ['Einfamilienhaus', 'Mehrfamilienhaus', 'Gewerbe oder Industrie', 'Öffentliches Gebäude', 'PV-Anlage']

export default function Contact({ prefill }: { prefill: string }) {
  const [name, setName] = useState('')
  const [reach, setReach] = useState('')
  const [kind, setKind] = useState(kinds[0])
  const [msg, setMsg] = useState('')
  const [errors, setErrors] = useState<{ name?: string; reach?: string }>({})
  const [sent, setSent] = useState(false)

  useEffect(() => { if (prefill) setMsg(prefill) }, [prefill])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Bitte geben Sie Ihren Namen ein.'
    if (!reach.trim()) next.reach = 'Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an, damit wir Sie erreichen.'
    setErrors(next)
    if (Object.keys(next).length) return
    // Demo: hier später an ein Formular-Backend senden (siehe README).
    setSent(true)
  }

  return (
    <section id="kontakt" className="sec dark grid-dark" aria-labelledby="kontakt-title">
      <div className="wrap contact">
        <div>
          <RevealText id="kontakt-title" className="display contact-title" text="Lassen Sie Ihr Gebäude kostenlos prüfen." />
          <p className="lead muted" style={{ marginTop: 28 }}>Erzählen Sie uns kurz von Ihrem Objekt. Wir melden uns und vereinbaren einen Termin für die Bestandsaufnahme.</p>
          <div className="contact-lines">
            <a href={contact.phoneHref}><Phone size={24} style={{ color: 'var(--signal)' }} />{contact.phone}</a>
            <a href={contact.emailHref}><Mail size={24} style={{ color: 'var(--signal)' }} />{contact.email}</a>
          </div>
          <div className="brochure" id="broschuere">
            <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <Doc size={28} style={{ color: 'var(--signal)', flex: 'none' }} />
              <span><b>Broschüre 2026</b><span className="muted" style={{ fontSize: 15 }}>Alle Leistungen auf einen Blick</span></span>
            </span>
            <a className="btn btn-ghost btn-sm" href="#broschuere">Broschüre öffnen</a>
          </div>
        </div>

        <div className="form" style={{ position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form key="form" onSubmit={submit} noValidate style={{ display: 'grid', gap: 18 }} exit={{ opacity: 0, y: -20 }}>
                <div className="f2">
                  <div className={`field ${errors.name ? 'err' : ''}`}>
                    <input id="f-name" placeholder=" " autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
                    <label htmlFor="f-name">Name</label>
                    {errors.name && <p className="field-err" id="e-name">{errors.name}</p>}
                  </div>
                  <div className={`field ${errors.reach ? 'err' : ''}`}>
                    <input id="f-reach" placeholder=" " autoComplete="email" value={reach} onChange={(e) => setReach(e.target.value)} aria-invalid={!!errors.reach} aria-describedby={errors.reach ? 'e-reach' : undefined} />
                    <label htmlFor="f-reach">Telefon oder E-Mail</label>
                    {errors.reach && <p className="field-err" id="e-reach">{errors.reach}</p>}
                  </div>
                </div>
                <fieldset className="chips">
                  <legend>Art des Objekts</legend>
                  {kinds.map((k) => (
                    <label key={k} className="chip">
                      <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} />
                      <span>{k}</span>
                    </label>
                  ))}
                </fieldset>
                <div className="field">
                  <textarea id="f-msg" placeholder=" " value={msg} onChange={(e) => setMsg(e.target.value)} />
                  <label htmlFor="f-msg">Ihr Anliegen</label>
                </div>
                <Magnetic strength={0.12}><button type="submit" className="btn btn-signal" style={{ width: '100%' }}>Anfrage senden</button></Magnetic>
                <p className="form-note">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben gemäß unserer <a href="#top">Datenschutzerklärung</a> zu.</p>
              </motion.form>
            ) : (
              <motion.div key="ok" className="success" role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
                  <motion.circle cx="36" cy="36" r="32" fill="none" stroke="#F28C00" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
                  <motion.path d="M22 37l9 9 19-20" fill="none" stroke="#082B44" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />
                </svg>
                <p className="result-title">Anfrage gesendet</p>
                <p style={{ margin: 0, color: 'var(--muted-light)' }}>Vielen Dank, {name.split(' ')[0]}. Wir melden uns in Kürze unter {reach}.</p>
                <button type="button" className="btn btn-ink btn-sm" onClick={() => { setSent(false); setMsg(''); }}>Weitere Anfrage stellen</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
