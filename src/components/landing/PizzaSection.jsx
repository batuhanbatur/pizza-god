import { useContext } from 'react'
import { MENU } from '../../data/menu'
import PizzaRow from './PizzaRow'
import { getDailyPizza } from '../../utils/dailyPizza'
import NeonBurst from '../graffiti/NeonBurst'
import { AccessibilityContext } from '../../context/AccessibilityContext'

export default function PizzaSection({ visible }) {
  const { reduceGraffiti } = useContext(AccessibilityContext)
  const dailyPizza = getDailyPizza()
  return (
    <div
      id="pizzas"
      style={{
        marginLeft: '220px',
        marginRight: '320px',
        paddingLeft: '80px',
        paddingRight: '80px',
        paddingTop: '160px',
        paddingBottom: '80px',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s',
      }}
    >
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '3rem' }}>
        {!reduceGraffiti && (
          <NeonBurst style={{
            position: 'absolute',
            bottom: '-70px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            pointerEvents: 'none',
            zIndex: 0,
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
          <span className="font-zodiak" style={{ fontSize: '3.5rem', fontWeight: 'bold', letterSpacing: '0.2em', color: '#1a1a1a' }}>PIZZ</span>
          {reduceGraffiti
            ? <span className="font-zodiak" style={{ fontSize: '3.5rem', fontWeight: 'bold', letterSpacing: '0.2em', color: '#1a1a1a' }}>A</span>
            : <img src="/pizzas-wordmark-neon-a.svg" alt="A" style={{ height: '60px', width: 'auto', pointerEvents: 'none' }} />
          }
          <span className="font-zodiak" style={{ fontSize: '3.5rem', fontWeight: 'bold', letterSpacing: '0.2em', color: '#1a1a1a' }}>S</span>
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
