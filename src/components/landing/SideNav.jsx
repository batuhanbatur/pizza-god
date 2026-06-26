import { useState, useEffect } from 'react'

const links = [
  { label: 'Pizzas', id: 'pizzas' },
  { label: 'Pizza of the Day', id: 'pizza-of-the-day' },
  { label: 'About Us', id: 'about-us' },
]

export default function SideNav() {
  const [activeId, setActiveId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find((e) => e.isIntersecting)
        if (intersecting) {
          setActiveId(intersecting.target.id)
        } else if (entries.every((e) => !e.isIntersecting)) {
          setActiveId(null)
        }
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' }
    )

    links.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) activeObserver.observe(el)
    })

    const handleScroll = () => {
      setIsVisible(window.scrollY >= window.innerHeight - 1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      activeObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: '280px',
      paddingLeft: 'calc(25vw - 150px)',
      width: '180px',
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      transition: 'opacity 0.4s',
    }}>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {links.map(({ label, id }) => {
          const isActive = activeId === id
          const isHovered = hoveredId === id
          return (
            <li key={id} style={{
              borderLeft: isActive ? '3px solid #39FF14' : '3px solid transparent',
              paddingLeft: '10px',
            }}>
              <button
                className="font-zodiak"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  color: isHovered ? '#39FF14' : '#933C3C',
                  transition: 'color 0.2s',
                  textAlign: 'left',
                  display: 'block',
                  width: '100%',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => document.getElementById(id).scrollIntoView({ behavior: 'smooth' })}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
