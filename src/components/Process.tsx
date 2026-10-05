import { motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { steps } from '../data/content'
import { useMedia, usePrefersReducedMotion } from '../hooks'
import RevealText from './RevealText'

export default function Process() {
  const wide = useMedia('(min-width: 901px)')
  const reduce = usePrefersReducedMotion()
  return (
    <section id="ablauf" className="dark grid-dark" aria-labelledby="ablauf-title">
      {wide && !reduce ? <Horizontal /> : <Vertical />}
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

function Horizontal() {
  const outer = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)
  const [reached, setReached] = useState(0)
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] })

  useEffect(() => {
    const measure = () => {
      if (!track.current) return
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 80))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const x = useTransform(scrollYProgress, [0.08, 0.92], [0, -dist])
  const fill = useTransform(scrollYProgress, [0.08, 0.92], [0, 1])
  useMotionValueEvent(fill, 'change', (v) => setReached(Math.min(steps.length, Math.floor(v * (steps.length - 0.15)) + 1)))

  return (
    <div ref={outer} className="proc" style={{ height: `calc(100svh + ${dist + 400}px)` }}>
      <div className="proc-pin">
        <Head />
        <motion.div ref={track} className="proc-track" style={{ x, marginTop: 'clamp(40px, 7vh, 88px)' }}>
          {steps.map((s, i) => <HStep key={s.title} i={i} title={s.title} text={s.text} on={i < reached} fill={fill} />)}
        </motion.div>
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

function HStep({ i, title, text, on, fill }: { i: number; title: string; text: string; on: boolean; fill: MotionValue<number> }) {
  const scaleX = useTransform(fill, [i / steps.length, (i + 1) / steps.length], [0, 1])
  return (
    <div className={`proc-step ${on ? 'on' : ''}`}>
      <div className="proc-line">
        <motion.div className="proc-line-fill" style={{ scaleX }} />
        <span className="proc-node" />
      </div>
      <div className="proc-num" aria-hidden="true">{i + 1}</div>
      <h3 className="h3"><span className="sr-only">Schritt {i + 1}: </span>{title}</h3>
      <p>{text}</p>
    </div>
  )
}
