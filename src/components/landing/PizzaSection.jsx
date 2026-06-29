import { useState } from 'react'
import { MENU, DOUGH_OPTIONS, CHEESE_OPTIONS, POPPERS_OPTION } from '../../data/menu'
import { useOrder } from '../../context/OrderContext'
import AllergenBadge from '../ui/AllergenBadge'

function OptionButton({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: `1px solid ${selected ? '#39FF14' : '#555'}`,
        color: selected ? '#39FF14' : '#888',
        padding: '0.3rem 0.8rem',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontFamily: 'inherit',
        transition: 'border-color 0.15s, color 0.15s',
      }}
    >
      {label}
    </button>
  )
}

const FONT_MAP = {
  'heavy-metal-queen': 'font-metal-mania',
  'mushroom-samba': 'font-kablammo',
}

function PizzaRow({ pizza }) {
  const { dispatch } = useOrder()
  const nameFont = FONT_MAP[pizza.id] || 'font-zodiak'
  const [dough, setDough] = useState('regular')
  const [cheese, setCheese] = useState('mozzarella')
  const [poppers, setPoppers] = useState(false)
  const [poppersQuantity, setPoppersQuantity] = useState(1)

  const visibleAllergens = pizza.allergens.filter(a => {
    if (a === 'Gluten' && dough === 'gluten-free') return false
    if (a === 'Milk' && cheese === 'vegan') return false
    return true
  })

  const total = pizza.price + (poppers ? POPPERS_OPTION.price * poppersQuantity : 0)

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { id: pizza.id, name: pizza.name, price: pizza.price, quantity: 1, dough, cheese, poppers, poppersQuantity },
    })
  }

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>

      {/* Name + price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
        <span className={nameFont} style={{ fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '0.1em', color: '#1a1a1a', textTransform: 'uppercase' }}>
          {pizza.name}
        </span>
        <span className="font-zodiak" style={{ fontSize: '1.4rem', color: '#1a1a1a' }}>
          ${pizza.price.toFixed(2)}
        </span>
      </div>

      {/* Tagline */}
      <div className="font-zodiak" style={{ color: '#E05A9A', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
        {pizza.tagline}
      </div>

      {/* Ingredients */}
      <div className="font-zodiak" style={{ color: '#555', fontSize: '0.85rem', marginBottom: '1rem' }}>
        {pizza.description.split(', ').join(' • ')}
      </div>

      {/* Allergens */}
      {visibleAllergens.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {visibleAllergens.map(a => (
            <AllergenBadge key={a} allergen={a} />
          ))}
        </div>
      )}

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-zodiak" style={{ color: '#888', fontSize: '0.8rem', width: '80px' }}>Dough</span>
          {DOUGH_OPTIONS.map(opt => (
            <OptionButton key={opt.id} label={opt.label} selected={dough === opt.id} onClick={() => setDough(opt.id)} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-zodiak" style={{ color: '#888', fontSize: '0.8rem', width: '80px' }}>Cheese</span>
          {CHEESE_OPTIONS.map(opt => (
            <OptionButton key={opt.id} label={opt.label} selected={cheese === opt.id} onClick={() => setCheese(opt.id)} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="font-zodiak" style={{ color: '#888', fontSize: '0.8rem', width: '80px' }}>Extras</span>
          {!poppers ? (
            <button
              onClick={() => setPoppers(true)}
              style={{ background: 'none', border: '1px solid #555', color: '#888', padding: '0.3rem 0.8rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}
            >
              Add Jalapeño Poppers +${POPPERS_OPTION.price.toFixed(2)}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => setPoppersQuantity(q => Math.max(1, q - 1))} style={{ background: 'none', border: '1px solid #555', color: '#1a1a1a', width: '28px', height: '28px', borderRadius: '3px', cursor: 'pointer', fontSize: '1rem' }}>−</button>
              <span className="font-zodiak" style={{ color: '#1a1a1a', minWidth: '1rem', textAlign: 'center' }}>{poppersQuantity}</span>
              <button onClick={() => setPoppersQuantity(q => Math.min(5, q + 1))} style={{ background: 'none', border: '1px solid #555', color: '#1a1a1a', width: '28px', height: '28px', borderRadius: '3px', cursor: 'pointer', fontSize: '1rem' }}>+</button>
              <span className="font-zodiak" style={{ color: '#888', fontSize: '0.8rem' }}>Jalapeño Poppers</span>
              <button onClick={() => { setPoppers(false); setPoppersQuantity(1) }} style={{ background: 'none', border: 'none', color: '#933C3C', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit', padding: '0 0.25rem' }}>Remove</button>
            </div>
          )}
        </div>
      </div>

      {/* Footer row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-zodiak" style={{ color: '#1a1a1a', fontSize: '1rem' }}>
          Total: ${total.toFixed(2)}
        </span>
        <button
          onClick={handleAddToCart}
          className="font-zodiak"
          style={{
            backgroundColor: '#39FF14',
            color: '#000',
            border: 'none',
            padding: '0.6rem 1.5rem',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default function PizzaSection({ visible }) {
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
      <h2 className="font-zodiak" style={{
        fontSize: '3.5rem',
        fontWeight: 'bold',
        letterSpacing: '0.2em',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: '3rem',
        textTransform: 'uppercase',
      }}>
        Pizzas
      </h2>

      {MENU.classics.items.map((pizza, i) => (
        <div key={pizza.id}>
          <PizzaRow pizza={pizza} />
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
