import { motion } from 'framer-motion'
import type { ElementType } from 'react'

/** Headline that rises word by word out of a mask. Used for every section title so the motion stays one consistent gesture. */
export default function RevealText({
  text, as = 'h2', className, delay = 0, immediate = false, id,
}: { text: string; as?: ElementType; className?: string; delay?: number; immediate?: boolean; id?: string }) {
  const Tag = as
  const words = text.split(' ')
  const word = {
    hidden: { y: '110%' },
    show: (i: number) => ({ y: '0%', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.06 } }),
  }
  return (
    <Tag className={className} id={id} aria-label={text}>
      {/* the trigger sits on the unclipped wrapper; words inside are masked */}
      <motion.span
        style={{ display: 'block' }}
        initial="hidden"
        {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.4 } })}
        aria-hidden="true"
      >
        {words.map((w, i) => (
          <span key={i} className="line-mask" style={{ display: 'inline-block', marginRight: '0.24em' }}>
            <motion.span custom={i} variants={word}>{w}</motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
