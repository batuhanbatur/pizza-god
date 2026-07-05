import { useState } from 'react'
import { useOrder } from '../../context/OrderContext'
import { EXTRAS } from '../../data/menu'
import { ALLERGEN_ICONS } from '../icons/AllergenIcons'

function AllergenIconRow({ allergens }) {
  const [hovered, setHovered] = useState(false)
  if (!allergens || allergens.length === 0) return null
  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', gap: '3px', alignItems: 'center', marginBottom: '0.4rem', cursor: 'default', color: '#933C3C' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {allergens.map(a => {
        const Icon = ALLERGEN_ICONS[a]
        return Icon ? <Icon key={a} /> : null
      })}
      {hovered && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          marginBottom: '4px',
          backgroundColor: '#1a1a1a',
          color: '#E6D6E3',
          fontSize: '0.7rem',
          padding: '4px 8px',
          borderRadius: '3px',
          whiteSpace: 'nowrap',
          zIndex: 100,
          pointerEvents: 'none',
        }}>
          {allergens.join(', ')}
        </div>
      )}
    </div>
  )
}

const PAYMENT_OPTIONS = [
  { id: 'cash', label: 'Cash' },
  { id: 'credit', label: 'Credit Card' },
  { id: 'online', label: 'Online Payment' },
]

export default function CartSidebar({ navVisible }) {
  const { order, removeItem, updateQuantity, updateItemExtraQuantity } = useOrder()
  const { cartItems } = order

  const [checkoutMode, setCheckoutMode] = useState(false)
  const [address, setAddress] = useState({ name: '', street: '', city: '', zip: '' })
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => {
    const extrasPrice = Object.entries(item.extras || {}).reduce((s, [id, qty]) => {
      const extra = EXTRAS.find(e => e.id === id)
      return s + (extra ? extra.price * qty : 0)
    }, 0)
    return sum + (item.price + extrasPrice) * item.quantity
  }, 0)

  const showFull = navVisible && cartCount > 0
  const showPill = !navVisible && cartCount > 0

  const inputStyle = {
    fontFamily: 'inherit',
    fontSize: '0.85rem',
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '0.5rem',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#fff',
    color: '#1a1a1a',
  }

  return (
    <>
      {/* Minimized pill — shown on hero */}
      <button
        onClick={() => document.getElementById('pizzas').scrollIntoView({ behavior: 'smooth' })}
        className="font-zodiak"
        style={{
          position: 'fixed',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#39FF14',
          color: '#000',
          border: 'none',
          borderRadius: '999px',
          padding: '0.5rem 1.1rem',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          zIndex: 50,
          opacity: showPill ? 1 : 0,
          pointerEvents: showPill ? 'auto' : 'none',
          transition: 'opacity 0.4s',
        }}
      >
        CART · {cartCount}
      </button>

      {/* Full sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: checkoutMode ? '480px' : '220px',
        height: '100vh',
        backgroundColor: '#F7F2F6',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        opacity: showFull ? 1 : 0,
        pointerEvents: showFull ? 'auto' : 'none',
        transition: 'opacity 0.4s, width 0.3s ease',
        overflowX: 'hidden',
      }}>

        {!checkoutMode ? (
          <>
            {/* Header */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="font-zodiak" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' }}>
                  Your Cart
                </span>
                <span style={{
                  backgroundColor: '#39FF14',
                  color: '#000',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  borderRadius: '999px',
                  padding: '0.1rem 0.4rem',
                }}>
                  {cartCount}
                </span>
              </div>
              <div style={{ height: '1px', backgroundColor: '#ddd' }} />
            </div>

            {/* Scrollable item list */}
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {cartItems.map((item, index) => {
                const extrasPrice = Object.entries(item.extras || {}).reduce((s, [id, qty]) => {
                  const extra = EXTRAS.find(e => e.id === id)
                  return s + (extra ? extra.price * qty : 0)
                }, 0)
                const itemTotal = (item.price + extrasPrice) * item.quantity
                const extrasEntries = Object.entries(item.extras || {})
                return (
                  <div key={index}>
                    <div style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>

                      {/* Name + total */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                        <span className="font-zodiak" style={{ fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 'bold' }}>
                          {item.isPotd ? `${item.name} (Pizza of the Day)` : item.name}
                        </span>
                        <span className="font-zodiak" style={{ fontSize: '0.85rem', color: '#1a1a1a' }}>
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Dough + cheese */}
                      <div className="font-zodiak" style={{ fontSize: '0.75rem', color: '#888', marginBottom: extrasEntries.length > 0 ? '0.15rem' : '0.25rem' }}>
                        {item.dough === 'gluten-free' ? 'GF Dough' : 'Regular'} · {item.cheese === 'vegan' ? 'Vegan' : 'Mozzarella'}
                      </div>

                      {/* Extras */}
                      {extrasEntries.length > 0 && (
                        <div style={{ marginBottom: '0.25rem' }}>
                          {extrasEntries.map(([id, qty]) => {
                            const extra = EXTRAS.find(e => e.id === id)
                            if (!extra) return null
                            return id === 'poppers' ? (
                              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.1rem' }}>
                                <span className="font-zodiak" style={{ fontSize: '0.75rem', color: '#888' }}>+ {extra.label}</span>
                                <button
                                  onClick={() => updateItemExtraQuantity(index, id, qty - 1)}
                                  style={{ background: 'none', border: '1px solid #ccc', color: '#1a1a1a', width: '18px', height: '18px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.75rem', lineHeight: 1, padding: 0 }}
                                >−</button>
                                <span className="font-zodiak" style={{ fontSize: '0.75rem', color: '#1a1a1a', minWidth: '0.75rem', textAlign: 'center' }}>{qty}</span>
                                <button
                                  onClick={() => updateItemExtraQuantity(index, id, qty + 1)}
                                  style={{ background: 'none', border: '1px solid #ccc', color: '#1a1a1a', width: '18px', height: '18px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.75rem', lineHeight: 1, padding: 0 }}
                                >+</button>
                              </div>
                            ) : (
                              <div key={id} className="font-zodiak" style={{ fontSize: '0.75rem', color: '#888' }}>
                                + {extra.label}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Allergen icons */}
                      <AllergenIconRow allergens={item.allergens} />

                      {/* Quantity controls + remove */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {item.isPotd ? (
                            <span className="font-zodiak" style={{ fontSize: '0.85rem', color: '#1a1a1a', minWidth: '1rem', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                style={{ background: 'none', border: '1px solid #ccc', color: '#1a1a1a', width: '22px', height: '22px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.85rem', lineHeight: 1 }}
                              >−</button>
                              <span className="font-zodiak" style={{ fontSize: '0.85rem', color: '#1a1a1a', minWidth: '1rem', textAlign: 'center' }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                style={{ background: 'none', border: '1px solid #ccc', color: '#1a1a1a', width: '22px', height: '22px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.85rem', lineHeight: 1 }}
                              >+</button>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          style={{ background: 'none', border: 'none', color: '#933C3C', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'inherit', padding: 0 }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && (
                      <div style={{ height: '1px', backgroundColor: '#e8e8e8' }} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                <span className="font-zodiak" style={{ fontSize: '1rem', color: '#1a1a1a' }}>Total</span>
                <span className="font-zodiak" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => setCheckoutMode(true)}
                className="font-zodiak"
                style={{
                  width: '100%',
                  backgroundColor: '#39FF14',
                  color: '#000',
                  fontWeight: 'bold',
                  padding: '0.7rem',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                }}
              >
                Checkout →
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Checkout header */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="font-zodiak" style={{ fontFamily: 'inherit', fontSize: '0.7rem', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' }}>
                  Checkout
                </span>
                <button
                  onClick={() => setCheckoutMode(false)}
                  className="font-zodiak"
                  style={{ background: 'none', border: 'none', color: '#933C3C', fontSize: '0.8rem', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                >
                  ← Back to Cart
                </button>
              </div>
              <div style={{ height: '1px', backgroundColor: '#ddd' }} />
            </div>

            {/* Collapsed cart summary */}
            <div className="font-zodiak" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} — ${cartTotal.toFixed(2)}
            </div>

            <div style={{ height: '1px', backgroundColor: '#ddd', marginBottom: '1.25rem' }} />

            {/* Scrollable form */}
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Address fields */}
              {[
                { key: 'name', label: 'Name', placeholder: 'Batuhan Batur' },
                { key: 'street', label: 'Street', placeholder: '42 Meteor Lane' },
                { key: 'city', label: 'City', placeholder: 'Andromeda' },
                { key: 'zip', label: 'ZIP', placeholder: '7007' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span className="font-zodiak" style={{ fontFamily: 'inherit', fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
                  <input
                    className="font-zodiak"
                    value={address[key]}
                    onChange={e => setAddress(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}

              {/* Payment method */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span className="font-zodiak" style={{ fontFamily: 'inherit', fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Payment</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {PAYMENT_OPTIONS.map(opt => {
                    const selected = paymentMethod === opt.id
                    return (
                      <button
                        key={opt.id}
                        className="font-zodiak"
                        onClick={() => setPaymentMethod(opt.id)}
                        style={{
                          flex: 1,
                          background: 'none',
                          border: `1px solid ${selected ? '#1a1a1a' : '#ccc'}`,
                          color: selected ? '#1a1a1a' : '#888',
                          fontWeight: selected ? 'bold' : 'normal',
                          fontSize: '0.75rem',
                          fontFamily: 'inherit',
                          padding: '0.4rem 0.2rem',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Payment explanation */}
              {paymentMethod === 'cash' && (
                <p className="font-zodiak" style={{ fontFamily: 'inherit', fontSize: '0.8rem', color: '#777', marginTop: '0.5rem', margin: 0 }}>
                  Pay with cash when your order arrives.
                </p>
              )}
              {paymentMethod === 'credit' && (
                <p className="font-zodiak" style={{ fontFamily: 'inherit', fontSize: '0.8rem', color: '#777', marginTop: '0.5rem', margin: 0 }}>
                  Our courier will bring a card terminal.
                </p>
              )}
              {paymentMethod === 'online' && (
                <p className="font-zodiak" style={{ fontFamily: 'inherit', fontSize: '0.8rem', color: '#777', marginTop: '0.5rem', margin: 0 }}>
                  Pay securely before we prepare your order.
                </p>
              )}

              {/* Card number — shown only for online payment */}
              {paymentMethod === 'online' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span className="font-zodiak" style={{ fontFamily: 'inherit', fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Card Number</span>
                  <input
                    className="font-zodiak"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    disabled
                    style={{ ...inputStyle, backgroundColor: '#f5f5f5', color: '#999', cursor: 'not-allowed' }}
                  />
                </div>
              )}
            </div>

            {/* Complete Order */}
            {(() => {
              const formComplete = Object.values(address).every(v => v.trim() !== '')
              return (
                <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => console.log('order complete', { cart: cartItems, address, paymentMethod })}
                    disabled={!formComplete}
                    className="font-zodiak"
                    style={{
                      backgroundColor: formComplete ? '#39FF14' : '#ccc',
                      color: '#000',
                      border: 'none',
                      padding: '0.8rem',
                      width: '100%',
                      borderRadius: '3px',
                      cursor: formComplete ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    Complete Order
                  </button>
                </div>
              )
            })()}
          </>
        )}

      </div>
    </>
  )
}
