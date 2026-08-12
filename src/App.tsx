import { MotionConfig } from 'motion/react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { WaitlistForm } from './components/WaitlistForm'
import { Hero } from './sections/Hero'
import { BetweenVisits } from './sections/BetweenVisits'
import { ImagingExperience } from './sections/ImagingExperience'
import { Manifesto } from './sections/Manifesto'
import { ProductStory } from './sections/ProductStory'
import { Founders } from './sections/Founders'
import { PreLaunch } from './sections/PreLaunch'
import { FinalMoment } from './sections/FinalMoment'

export default function App() {
  return (
    // reducedMotion="user" strips transforms for readers who ask, everywhere at once.
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main id="main">
        <Hero />
        <BetweenVisits />
        <ImagingExperience />
        <Manifesto />
        <ProductStory />
        <Founders />
        <PreLaunch />
        <WaitlistForm />
        <FinalMoment />
      </main>
      <Footer />
    </MotionConfig>
  )
}
