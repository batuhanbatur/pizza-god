import { MENU } from '../../data/menu'
import PizzaCard from './PizzaCard'

export default function PizzaSection({ visible }) {
  const handleAddToCart = (item) => console.log('Add to cart:', item)

  return (
    <div
      id="pizzas"
      style={{
        minHeight: '100vh',
        paddingTop: '280px',
        paddingLeft: 'calc(25vw + 130px)',
        paddingRight: '4rem',
        paddingBottom: '4rem',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {MENU.classics.items.map(pizza => (
          <PizzaCard key={pizza.id} pizza={pizza} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  )
}
