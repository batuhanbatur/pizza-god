import { useState, useEffect, useRef } from 'react'
import AccessibilityButton from '../ui/AccessibilityButton'

const links = [
  { label: 'PIZZAS', id: 'pizzas' },
  { label: 'PIZZA OF THE DAY', id: 'pizza-of-the-day' },
  { label: 'ABOUT US', id: 'about-us' },
]

export default function SideNav() {
  const [activeId, setActiveId] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const intersectionState = useRef({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          intersectionState.current[e.target.id] = e.isIntersecting
        })
        const active = links.find(({ id }) => intersectionState.current[id])
        setActiveId(active?.id ?? null)
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' }
    )

    links.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    const handleScroll = () => {
      setIsVisible(window.scrollY >= window.innerHeight - 1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '220px',
      height: '100vh',
      backgroundColor: '#111',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      transition: 'opacity 0.4s',
    }}>

      {/* Space for logo */}
      <div style={{ height: '250px', flexShrink: 0 }} />

      {/* Nav links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {links.map(({ label, id }) => {
          const isActive = activeId === id
          return (
            <div
              key={id}
              style={{
                borderLeft: isActive ? '3px solid #39FF14' : '3px solid transparent',
                paddingLeft: '12px',
                transition: 'border-color 0.2s',
              }}
            >
              <button
                className="font-zodiak"
                onClick={() => document.getElementById(id).scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  textAlign: 'left',
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'transform 0.2s, color 0.2s',
                }}
              >
                <span style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  color: isActive ? '#39FF14' : '#E6D6E3',
                }}>
                  {label}
                </span>
              </button>
            </div>
          )
        })}
      </div>

      {/* Accessibility button */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
        <AccessibilityButton />
      </div>

    </nav>
  )
}
