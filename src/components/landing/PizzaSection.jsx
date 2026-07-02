import { MENU } from '../../data/menu'
import PizzaRow from './PizzaRow'
import { getDailyPizza } from '../../utils/dailyPizza'

export default function PizzaSection({ visible }) {
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
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <img
          src="/pizzas-wordmark-neon-a.svg"
          alt="PIZZAS"
          style={{ height: '80px', pointerEvents: 'none' }}
        />
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
