import { useContext } from 'react'
import { MENU } from '../../data/menu'
import PizzaRow from './PizzaRow'
import { getDailyPizza } from '../../utils/dailyPizza'
import NeonBurst from '../graffiti/NeonBurst'
import NeonA from '../graffiti/NeonA'
import { AccessibilityContext } from '../../context/AccessibilityContext'
import useIsMobile from '../../hooks/useIsMobile'

export default function PizzaSection({ visible }) {
  const { reduceGraffiti } = useContext(AccessibilityContext)
  const isMobile = useIsMobile()
  const dailyPizza = getDailyPizza()
  return (
    <div
      id="pizzas"
      style={{
        marginLeft: isMobile ? 0 : '220px',
        marginRight: isMobile ? 0 : '320px',
        paddingLeft: isMobile ? '20px' : '80px',
        paddingRight: isMobile ? '20px' : '80px',
        paddingTop: isMobile ? '80px' : '160px',
        paddingBottom: '80px',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s',
      }}
    >
      <div id="pizzas-anchor" style={{ position: 'relative', textAlign: 'center', marginBottom: '3rem', scrollMarginTop: '24px' }}>
        {!reduceGraffiti && (
          <NeonBurst style={{
            position: 'absolute',
            width: isMobile ? 'min(100vw, 420px)' : '900px',
            pointerEvents: 'none',
            zIndex: 0,
            // Mobile's viewBox is a square centered on its own focal point, so the
            // burst is centered directly on the wordmark row (both axes) instead
            // of desktop's bottom-offset-below-the-word trick.
            ...(isMobile
              ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
              : { bottom: '-70px', left: '50%', transform: 'translateX(-50%)' }),
          }} />
        )}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
          position: 'relative',
          zIndex: 1,
        }}>
          <span className="font-zodiak" style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: 'bold', letterSpacing: isMobile ? '0.12em' : '0.2em', color: '#1a1a1a' }}>PIZZ</span>
          {reduceGraffiti
            ? <span className="font-zodiak" style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: 'bold', letterSpacing: isMobile ? '0.12em' : '0.2em', color: '#1a1a1a' }}>A</span>
            : <NeonA style={{ height: isMobile ? '39px' : '60px', width: 'auto', pointerEvents: 'none' }} />
          }
          <span className="font-zodiak" style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: 'bold', letterSpacing: isMobile ? '0.12em' : '0.2em', color: '#1a1a1a' }}>S</span>
        </div>
      </div>

      {MENU.classics.items.map((pizza, i) => (
        <div key={pizza.id}>
          <PizzaRow pizza={pizza} isPotd={pizza.id === dailyPizza.id} />
          {i < MENU.classics.items.length - 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ccc' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }} />
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>·⊕·</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
