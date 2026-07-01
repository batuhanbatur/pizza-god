import { useState, useEffect, useRef } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'

export default function AccessibilityButton() {
  const { reduceGraffiti, setReduceGraffiti } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Popover */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '90px',
          left: 0,
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '6px',
          padding: '1rem',
          width: '280px',
          zIndex: 60,
        }}>
          <div className="font-zodiak" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: '#888', marginBottom: '0.75rem' }}>
            ACCESSIBILITY
          </div>

          {/* Toggle row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-zodiak" style={{ fontSize: '0.8rem', color: '#E6D6E3' }}>
              Reduce Graffiti & Motion
            </span>
            <button
              onClick={() => setReduceGraffiti(v => !v)}
              style={{
                width: '36px',
                height: '20px',
                borderRadius: '999px',
                backgroundColor: reduceGraffiti ? '#39FF14' : '#444',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
                transition: 'background-color 0.2s',
                padding: 0,
              }}
            >
              <span style={{
                position: 'absolute',
                top: '2px',
                left: reduceGraffiti ? '18px' : '2px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#1a1a1a',
          border: '2px solid #333',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
      >
        <img src="/accessibility.svg" alt="Accessibility" style={{ width: '40px', height: '40px' }} />
      </button>
    </div>
  )
}
