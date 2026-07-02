import { useState, useContext } from 'react'
import { DOUGH_OPTIONS, CHEESE_OPTIONS, EXTRAS } from '../../data/menu'
import { useOrder } from '../../context/OrderContext'
import AllergenBadge from '../ui/AllergenBadge'
import { AccessibilityContext } from '../../context/AccessibilityContext'
import Drip from '../graffiti/Drip'

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

export default function PizzaRow({ pizza, discountedPrice, isPotd = false, soldOut = false, onOrder }) {
  const { dispatch } = useOrder()
  const { reduceGraffiti } = useContext(AccessibilityContext)
  const nameFont = FONT_MAP[pizza.id] || 'font-zodiak'

  const [dough, setDough] = useState('regular')
  const [cheese, setCheese] = useState('mozzarella')
  const [selectedExtras, setSelectedExtras] = useState({})

  const effectivePrice = discountedPrice ?? pizza.price

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
  const total = effectivePrice + extrasTotal

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { id: pizza.id, name: pizza.name, price: effectivePrice, quantity: 1, dough, cheese, extras: selectedExtras, allergens: visibleAllergens },
    })
    setDough('regular')
    setCheese('mozzarella')
    setSelectedExtras({})
    onOrder?.()
  }

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>

      {/* Name + price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '0.3rem' }}>
        <span className={nameFont} style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '0.1em', color: '#1a1a1a', textTransform: 'uppercase' }}>
          {pizza.name}
        </span>
        {discountedPrice !== undefined ? (
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="font-zodiak" style={{ fontSize: '1.4rem', color: '#aaa', textDecoration: 'line-through' }}>
              ${pizza.price.toFixed(2)}
            </span>
            <span className="font-zodiak" style={{ fontSize: '1.4rem', color: '#39FF14', fontWeight: 'bold' }}>
              ${discountedPrice.toFixed(2)}
            </span>
          </span>
        ) : (
          <span className="font-zodiak" style={{ fontSize: '1.4rem', color: '#1a1a1a' }}>
            ${pizza.price.toFixed(2)}
          </span>
        )}
        {isPotd && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#1a1a1a', fontSize: '0.85rem', fontWeight: 'bold' }} className="font-zodiak">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1a1a1a" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Pizza of the Day
          </span>
        )}
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

        {/* Dough */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-zodiak" style={{ color: '#aaa', fontSize: '0.75rem', width: '80px' }}>Dough</span>
          {DOUGH_OPTIONS.map((opt, i) => (
            <div key={opt.id} style={{ position: 'relative', display: 'inline-block' }}>
              <OptionButton label={opt.label} selected={dough === opt.id} onClick={() => setDough(opt.id)} />
              {dough === opt.id && !reduceGraffiti && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '-5px', zIndex: 1 }}>
                  <Drip variant={i + 1} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cheese */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-zodiak" style={{ color: '#aaa', fontSize: '0.75rem', width: '80px' }}>Cheese</span>
          {CHEESE_OPTIONS.map((opt, i) => (
            <div key={opt.id} style={{ position: 'relative', display: 'inline-block' }}>
              <OptionButton label={opt.label} selected={cheese === opt.id} onClick={() => setCheese(opt.id)} />
              {cheese === opt.id && !reduceGraffiti && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '-5px', zIndex: 1 }}>
                  <Drip variant={i + 3} />
                </div>
              )}
            </div>
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
        {soldOut ? (
          <button disabled style={{ backgroundColor: '#ccc', color: '#888', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '3px', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '0.95rem' }}>
            Sold Out
          </button>
        ) : (
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
        )}
      </div>
    </div>
  )
}
