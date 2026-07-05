import { useState } from 'react'
import { DOUGH_OPTIONS, CHEESE_OPTIONS, POPPERS_OPTION } from '../../data/menu'
import { useOrder } from '../../context/OrderContext'
import { ALLERGEN_ICONS } from '../icons/AllergenIcons'

const FONT_MAP = {
  'heavy-metal-queen': 'font-metal-mania',
  'mushroom-samba': 'font-kablammo',
}

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

export default function PizzaCard({ pizza, onAddToCart }) {
  const { dispatch } = useOrder()
  const [dough, setDough] = useState('regular')
  const [cheese, setCheese] = useState('mozzarella')
  const [poppers, setPoppers] = useState(false)
  const [poppersQuantity, setPoppersQuantity] = useState(1)

  const nameFont = FONT_MAP[pizza.id] || 'font-zodiak'
  const total = pizza.price + (poppers ? POPPERS_OPTION.price * poppersQuantity : 0)
  const visibleAllergens = pizza.allergens.filter(a => {
  if (a === 'Gluten' && dough === 'gluten-free') return false
  if (a === 'Milk' && cheese === 'vegan') return false
  return true
})

  const handleAddToCart = () => {
    const item = { id: pizza.id, name: pizza.name, price: pizza.price, quantity: 1, dough, cheese, poppers, poppersQuantity }
    dispatch({ type: 'ADD_TO_CART', payload: item })
    onAddToCart(item)
  }

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '4px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    }}>

      {/* Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className={nameFont} style={{ color: '#F2E0B6', fontSize: '1.5rem', lineHeight: 1.1 }}>
            {pizza.name}
          </div>
          <div className="font-zodiak" style={{ color: '#888', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.25rem' }}>
            {pizza.tagline}
          </div>
        </div>
        <div className="font-zodiak" style={{ color: '#F2E0B6', fontSize: '1.2rem', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
          ${pizza.price.toFixed(2)}
        </div>
      </div>

      {/* Middle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div className="font-zodiak" style={{ color: '#aaa', fontSize: '0.85rem' }}>
          {pizza.description}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {visibleAllergens.map(a => {
            const Icon = ALLERGEN_ICONS[a]
            return (
              <span key={a} style={{
                backgroundColor: '#933C3C',
                color: '#E6D6E3',
                fontSize: '0.7rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                fontFamily: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}>
                {Icon && <Icon />}
                {a}
              </span>
            )
          })}
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {/* Dough */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-zodiak" style={{ color: '#666', fontSize: '0.8rem', width: '80px' }}>Dough</span>
          {DOUGH_OPTIONS.map(opt => (
            <OptionButton key={opt.id} label={opt.label} selected={dough === opt.id} onClick={() => setDough(opt.id)} />
          ))}
        </div>

        {/* Cheese */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-zodiak" style={{ color: '#666', fontSize: '0.8rem', width: '80px' }}>Cheese</span>
          {CHEESE_OPTIONS.map(opt => (
            <OptionButton key={opt.id} label={opt.label} selected={cheese === opt.id} onClick={() => setCheese(opt.id)} />
          ))}
        </div>

        {/* Poppers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="font-zodiak" style={{ color: '#666', fontSize: '0.8rem', width: '80px' }}>Extras</span>
          {!poppers ? (
            <button
              onClick={() => setPoppers(true)}
              style={{
                background: 'none',
                border: '1px solid #555',
                color: '#888',
                padding: '0.3rem 0.8rem',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontFamily: 'inherit',
              }}
            >
              Add Jalapeño Poppers +${POPPERS_OPTION.price.toFixed(2)}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => setPoppersQuantity(q => Math.max(1, q - 1))} style={{ background: 'none', border: '1px solid #555', color: '#F2E0B6', width: '28px', height: '28px', borderRadius: '3px', cursor: 'pointer', fontSize: '1rem' }}>−</button>
              <span className="font-zodiak" style={{ color: '#F2E0B6', minWidth: '1rem', textAlign: 'center' }}>{poppersQuantity}</span>
              <button onClick={() => setPoppersQuantity(q => Math.min(5, q + 1))} style={{ background: 'none', border: '1px solid #555', color: '#F2E0B6', width: '28px', height: '28px', borderRadius: '3px', cursor: 'pointer', fontSize: '1rem' }}>+</button>
              <span className="font-zodiak" style={{ color: '#888', fontSize: '0.8rem' }}>Jalapeño Poppers</span>
              <button onClick={() => { setPoppers(false); setPoppersQuantity(1) }} style={{ background: 'none', border: 'none', color: '#933C3C', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit', padding: '0 0.25rem' }}>Remove</button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #333', paddingTop: '1rem', marginTop: '0.25rem' }}>
        <div className="font-zodiak" style={{ color: '#F2E0B6', fontSize: '1.1rem' }}>
          Total: ${total.toFixed(2)}
        </div>
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
