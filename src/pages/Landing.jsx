import { useState, useEffect } from 'react'
import logoOrder from '../assets/order-yourself.png'
import logoAi from '../assets/order-ai.png'
import Hero from '../components/landing/Hero'
import SideNav from '../components/landing/SideNav'
import CartSidebar from '../components/landing/CartSidebar'
import PizzaSection from '../components/landing/PizzaSection'
import AboutSection from '../components/landing/AboutSection'
import PizzaOfTheDaySection from '../components/landing/PizzaOfTheDaySection'

export default function Landing() {
  const [hoveredButton, setHoveredButton] = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [navVisible, setNavVisible] = useState(false)

  useEffect(() => {
    [logoOrder, logoAi].forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    setWindowHeight(window.innerHeight)

    const handleScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 1.2), 1)
      setScrollProgress(progress)
      setNavVisible(window.scrollY >= window.innerHeight - 1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleOrderYourself = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '200vh', backgroundColor: '#F2E0B6' }}>

      <Hero
        hoveredButton={hoveredButton}
        setHoveredButton={setHoveredButton}
        scrollProgress={scrollProgress}
        windowHeight={windowHeight}
        handleOrderYourself={handleOrderYourself}
        navVisible={navVisible}
      />

      <SideNav />
      <CartSidebar navVisible={navVisible} />
      <PizzaSection visible={navVisible} />

      <PizzaOfTheDaySection visible={navVisible} />
      <AboutSection visible={navVisible} />

    </div>
  )
}
