import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useRef, useState } from 'react'
import { steps } from '../data/content'
import { usePrefersReducedMotion } from '../hooks'
import RevealText from './RevealText'

export default function Process() {
  const reduce = usePrefersReducedMotion()
  return (
    <section id="ablauf" className="dark grid-dark" aria-labelledby="ablauf-title">
      {reduce ? <Vertical /> : <Pinned />}
    </section>
  )
}

function Head() {
  return (
    <div className="wrap sec-head" style={{ marginBottom: 0 }}>
      <RevealText id="ablauf-title" className="h2" text="Rundum-sorglos, vom ersten Termin an" />
      <p className="lead muted">Minimaler Aufwand für Sie, maximaler Schutz für Ihre Gebäude. Wir übernehmen das komplette Wartungs- und Prüfprogramm.</p>
    </div>
  )
}

/** Section stays pinned while scrolling; one step is shown at a time and the next one swaps in as you scroll on. */
function Pinned() {
  const outer = useRef<HTMLDivElement>(null)
  const [[active, dir], setActive] = useState<[number, number]>([0, 1])
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)))
    setActive((cur) => (next === cur[0] ? cur : [next, next > cur[0] ? 1 : -1]))
  })

  // scroll to the middle of a step's segment
  const goTo = (i: number) => {
    const el = outer.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + span * ((i + 0.5) / steps.length) })
  }

  const s = steps[active]
  return (
    <div ref={outer} className="proc" style={{ height: `calc(100svh + ${steps.length * 70}svh)` }}>
      <ol className="sr-only">
        {steps.map((st, i) => <li key={st.title}>Schritt {i + 1}: {st.title}. {st.text}</li>)}
      </ol>
      <div className="proc-pin">
        <Head />
        <div className="wrap proc-stage" aria-hidden="true">
          <div className="proc-bar">
            <div className="proc-line"><motion.div className="proc-line-fill" style={{ scaleX: scrollYProgress }} /></div>
            {steps.map((st, i) => (
              <button
                key={st.title}
                type="button"
                tabIndex={-1}
                className={`proc-dot${i <= active ? ' on' : ''}${i === active ? ' cur' : ''}`}
                style={{ left: `${(i / (steps.length - 1)) * 100}%` }}
                onClick={() => goTo(i)}
              >
                <span className="proc-node" />
                <span className="proc-dot-label">{st.title}</span>
              </button>
            ))}
          </div>
          <div className="proc-card">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={active}
                custom={dir}
                initial="enter"
                animate="show"
                exit="exit"
                variants={{
                  enter: (d: number) => ({ opacity: 0, y: d * 48 }),
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                  exit: (d: number) => ({ opacity: 0, y: d * -48, transition: { duration: 0.25 } }),
                }}
              >
                <div className="proc-num">{String(active + 1).padStart(2, '0')}<span>/ {String(steps.length).padStart(2, '0')}</span></div>
                <h3 className="h2 proc-title">{s.title}</h3>
                <p className="lead">{s.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function Vertical() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  return (
    <div className="sec">
      <Head />
      <div className="wrap" style={{ marginTop: 56 }}>
        <ol ref={ref} className="proc-v" style={{ listStyle: 'none', margin: 0 }}>
          <span className="proc-v-line" aria-hidden="true"><motion.span className="proc-v-fill" style={{ scaleY: scrollYProgress, display: 'block' }} /></span>
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              className="proc-v-step"
              initial={{ opacity: 0.35 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              <span className="proc-node" style={{ borderColor: 'var(--signal)' }} aria-hidden="true" />
              <div className="tech">Schritt {i + 1}</div>
              <h3 className="h3">{s.title}</h3>
              <p>{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  )
}
