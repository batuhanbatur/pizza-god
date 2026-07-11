import { useState, useEffect, useRef } from 'react'
import AccessibilityButton from '../ui/AccessibilityButton'
import useIsMobile from '../../hooks/useIsMobile'
import logo from '../../assets/pizza-god-logo.webp'

const links = [
  { label: 'PIZZAS', id: 'pizzas' },
  { label: 'PIZZA OF THE DAY', id: 'pizza-of-the-day' },
  { label: 'ABOUT US', id: 'about-us' },
]

// goToSection scrolls to each section's heading, not its (padded) root div — see anchorIds.
const anchorIds = {
  'pizza-of-the-day': 'pizza-of-the-day-anchor',
  'about-us': 'about-us-anchor',
}

// Mobile hamburger + drawer sizing.
const MOBILE_HAMBURGER_SIZE_PX = 44
const MOBILE_HAMBURGER_OFFSET_PX = 16
const MOBILE_DRAWER_WIDTH = 'min(75vw, 300px)'
const MOBILE_DRAWER_TRANSITION = 'transform 0.3s ease'
// Accessibility button sits near the drawer's left edge (not centered like desktop) so its
// popover — which anchors to the button's own left edge and extends rightward — stays within
// the screen's actual width instead of clipping at a narrow viewport's right edge.
const MOBILE_ACCESSIBILITY_PADDING_LEFT_PX = 20

export default function SideNav({ navVisible, isOpen, onOpen, onClose }) {
  const isMobile = useIsMobile()
  const [activeId, setActiveId] = useState(null)
  const intersectionState = useRef({})

  // Watches the actual page sections, not the nav's own markup — runs regardless
  // of isMobile/isOpen so the highlight is already correct whenever the drawer opens.
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

    return () => {
      observer.disconnect()
    }
  }, [])

  const goToSection = (id) => {
    document.getElementById(anchorIds[id] ?? id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const renderLinks = (onLinkClick) => (
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
              onClick={() => onLinkClick(id)}
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
  )

  if (!isMobile) {
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
        opacity: navVisible ? 1 : 0,
        pointerEvents: navVisible ? 'auto' : 'none',
        transition: 'opacity 0.4s',
      }}>

        {/* Space for logo */}
        <div style={{ height: '250px', flexShrink: 0 }} />

        {renderLinks(goToSection)}

        {/* Accessibility button */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <AccessibilityButton />
        </div>

      </nav>
    )
  }

  return (
    <>
      {/* Hamburger trigger */}
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        aria-label="Open menu"
        style={{
          position: 'fixed',
          top: `${MOBILE_HAMBURGER_OFFSET_PX}px`,
          left: `${MOBILE_HAMBURGER_OFFSET_PX}px`,
          width: `${MOBILE_HAMBURGER_SIZE_PX}px`,
          height: `${MOBILE_HAMBURGER_SIZE_PX}px`,
          borderRadius: '50%',
          backgroundColor: '#111',
          border: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 68,
          opacity: navVisible ? 1 : 0,
          pointerEvents: navVisible ? 'auto' : 'none',
          transition: 'opacity 0.4s',
          padding: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ width: '20px', height: '2px', backgroundColor: '#fff', borderRadius: '1px' }} />
          <span style={{ width: '20px', height: '2px', backgroundColor: '#fff', borderRadius: '1px' }} />
          <span style={{ width: '20px', height: '2px', backgroundColor: '#fff', borderRadius: '1px' }} />
        </div>
      </button>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 65,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* Drawer */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: MOBILE_DRAWER_WIDTH,
        height: '100vh',
        backgroundColor: '#111',
        zIndex: 70,
        display: 'flex',
        flexDirection: 'column',
        transform: `translateX(${isOpen ? '0%' : '-100%'})`,
        transition: MOBILE_DRAWER_TRANSITION,
      }}>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            background: 'none',
            border: 'none',
            color: '#E6D6E3',
            fontSize: '1.5rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          &times;
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '32px', paddingBottom: '24px', flexShrink: 0 }}>
          <img src={logo} alt="Pizza God" style={{ width: '120px', height: 'auto' }} />
        </div>

        {renderLinks((id) => {
          goToSection(id)
          onClose()
        })}

        {/* Accessibility button */}
        <div style={{
          marginBottom: '2rem',
          paddingLeft: `${MOBILE_ACCESSIBILITY_PADDING_LEFT_PX}px`,
          display: 'flex',
          justifyContent: 'flex-start',
        }}>
          <AccessibilityButton />
        </div>

      </nav>
    </>
  )
}
