import { useState } from 'react'
import { MENU, DOUGH_OPTIONS, CHEESE_OPTIONS, EXTRAS } from '../../data/menu'
import { useOrder } from '../../context/OrderContext'
import AllergenBadge from '../ui/AllergenBadge'

function OptionButton({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: `1px solid ${selected ? '#1a1a1a' : '#ccc'}`,
        color: selected ? '#1a1a1a' : '#888',
        fontWeight: selected ? 'bold' : 'normal',
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
  const [selectedExtras, setSelectedExtras] = useState({})

  const extraAllergens = Object.keys(selectedExtras)
    .flatMap(id => EXTRAS.find(e => e.id === id)?.allergens || [])

  const visibleAllergens = [...new Set([
    ...pizza.allergens.filter(a => {
      if (a === 'Gluten' && dough === 'gluten-free') return false
      if (a === 'Milk' && cheese === 'vegan') return false
      return true
    }),
    ...extraAllergens,
  ])]

  const extrasTotal = Object.entries(selectedExtras).reduce((sum, [id, qty]) => {
    const extra = EXTRAS.find(e => e.id === id)
    return sum + (extra ? extra.price * qty : 0)
  }, 0)
  const total = pizza.price + extrasTotal

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { id: pizza.id, name: pizza.name, price: pizza.price, quantity: 1, dough, cheese, extras: selectedExtras, allergens: visibleAllergens },
    })
  }

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>

      {/* Name + price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '0.3rem' }}>
        <span className={nameFont} style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '0.1em', color: '#1a1a1a', textTransform: 'uppercase' }}>
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
      <div className="font-zodiak" style={{ color: '#777', fontSize: '0.8rem', marginBottom: '1rem' }}>
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
          <span className="font-zodiak" style={{ color: '#aaa', fontSize: '0.75rem', width: '80px' }}>Dough</span>
          {DOUGH_OPTIONS.map(opt => (
            <OptionButton key={opt.id} label={opt.label} selected={dough === opt.id} onClick={() => setDough(opt.id)} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-zodiak" style={{ color: '#aaa', fontSize: '0.75rem', width: '80px' }}>Cheese</span>
          {CHEESE_OPTIONS.map(opt => (
            <OptionButton key={opt.id} label={opt.label} selected={cheese === opt.id} onClick={() => setCheese(opt.id)} />
          ))}
        </div>

        {/* Extras */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span className="font-zodiak" style={{ color: '#aaa', fontSize: '0.75rem' }}>Extras</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'flex-start' }}>
          {EXTRAS.map(extra => {
            const qty = selectedExtras[extra.id]
            const isSelected = qty !== undefined
            return (
              <div key={extra.id}>
                {!isSelected ? (
                  <button
                    onClick={() => setSelectedExtras(prev => ({ ...prev, [extra.id]: 1 }))}
                    style={{ background: 'none', border: '1px solid #555', color: '#888', padding: '0.3rem 0.8rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}
                  >
                    {extra.label} +${extra.price.toFixed(2)}
                  </button>
                ) : (
                  <button
                    className="font-zodiak"
                    onClick={() => setSelectedExtras(prev => { const n = { ...prev }; delete n[extra.id]; return n })}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a', fontWeight: 'bold', fontSize: '0.8rem', fontFamily: 'inherit', padding: '0.3rem 0.6rem 0.3rem 0.8rem', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    {extra.label}
                    <span style={{ color: '#933C3C', fontSize: '1rem', lineHeight: 1 }}>×</span>
                  </button>
                )}
              </div>
            )
          })}
          </div>
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
