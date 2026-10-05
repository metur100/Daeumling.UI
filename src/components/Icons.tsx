import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
const base = (size = 24): SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
})

export const Phone = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
)
export const Mail = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
)
export const Check = ({ size, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2.8} {...p}><path d="M5 12l5 5L20 7" /></svg>
)
export const Bolt = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
)
export const Plus = ({ size, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2.4} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const Chevron = ({ size, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2.4} {...p}><path d="M9 6l6 6-6 6" /></svg>
)
export const Menu = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 7h16M4 12h16M4 17h10" /></svg>
)
export const Close = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const Doc = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></svg>
)

/* service glyphs: blue structure, orange = the part that carries current */
export function PartGlyph({ id, size = 26 }: { id: string; size?: number }) {
  const s = { width: size, height: size, viewBox: '0 0 40 40', fill: 'none', strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  const blue = '#9CC3E0'
  const o = '#F28C00'
  switch (id) {
    case 'fang':
      return <svg {...s} stroke={blue}><path d="M8 34V14h24v20" /><path d="M8 14l12-8 12 8" /><path d="M20 6V1" stroke={o} /><path d="M12 14v20M28 14v20" stroke={o} strokeDasharray="3 3" /></svg>
    case 'ableitung':
      return <svg {...s} stroke={blue}><path d="M6 36V18L20 8l14 10v18z" /><path d="M20 8V2" stroke={o} /><path d="M6 18v18" stroke={o} /></svg>
    case 'erdung':
      return <svg {...s} stroke={blue}><path d="M20 4v18" stroke={o} /><path d="M8 22h24M12 28h16M16 34h8" /></svg>
    case 'spd':
      return <svg {...s} stroke={blue}><rect x="6" y="6" width="28" height="28" rx="4" /><path d="M22 10l-6 10h8l-6 10" stroke={o} /></svg>
    default:
      return <svg {...s} stroke={blue}><rect x="8" y="6" width="24" height="30" rx="3" /><path d="M15 6V3h10v3" /><path d="M14 21l4 4 8-9" stroke={o} /></svg>
  }
}
