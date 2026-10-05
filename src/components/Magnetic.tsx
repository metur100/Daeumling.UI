import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { ReactNode, PointerEvent } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '../hooks'

/** Wraps a button or link so it leans towards the pointer – like charge attracted to a conductor. */
export default function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const fine = useFinePointer()
  const reduce = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })
  const active = fine && !reduce

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (!active) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }

  return (
    <motion.span className="mag" style={{ display: 'inline-flex', x: sx, y: sy }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </motion.span>
  )
}
