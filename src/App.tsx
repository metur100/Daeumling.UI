import { MotionConfig } from 'framer-motion'
import { useState } from 'react'
import BlitzCheck from './components/BlitzCheck'
import Company from './components/Company'
import Contact from './components/Contact'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Header, { Rail } from './components/Header'
import Hero from './components/Hero'
import Knowledge from './components/Knowledge'
import Locations from './components/Locations'
import Process from './components/Process'
import System from './components/System'

export default function App() {
  const [checkSummary, setCheckSummary] = useState('')
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#main">Zum Inhalt springen</a>
      <Header />
      <Rail />
      <main id="main">
        <Hero />
        <System />
        <Process />
        <BlitzCheck onResult={setCheckSummary} />
        <Company />
        <Knowledge />
        <Locations />
        <Faq />
        <Contact prefill={checkSummary} />
      </main>
      <Footer />
    </MotionConfig>
  )
}
