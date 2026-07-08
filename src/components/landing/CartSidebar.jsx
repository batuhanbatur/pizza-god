import { useState, useEffect } from 'react'
import { useOrder } from '../../context/OrderContext'
import { EXTRAS } from '../../data/menu'
import { ALLERGEN_ICONS } from '../icons/AllergenIcons'
import useIsMobile from '../../hooks/useIsMobile'
import { supabase } from '../../lib/supabase'

// Cheap dev fallback so the checkout flow works without real Supabase env vars
// configured locally — never true in a production build.
const USE_MOCK = import.meta.env.DEV
  && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)

const LAST_ORDER_STORAGE_KEY = 'pizzagod:lastOrder'

function generateMockOrderId() {
  return `mock-${Date.now()}`
}

function buildOrderReceipt(id, items, total, name) {
  return { id, items, total, name, timestamp: Date.now() }
}

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

function OrderSummaryLine({ item, mutedColor = '#888' }) {
  const extrasEntries = Object.entries(item.extras || {})
  const extrasPrice = extrasEntries.reduce((s, [id, qty]) => {
    const extra = EXTRAS.find(e => e.id === id)
    return s + (extra ? extra.price * qty : 0)
  }, 0)
  const itemTotal = (item.price + extrasPrice) * item.quantity

  const configParts = [
    item.dough === 'gluten-free' ? 'GF Dough' : 'Regular',
    item.cheese === 'vegan' ? 'Vegan' : 'Mozzarella',
    ...extrasEntries.map(([id, qty]) => {
      const extra = EXTRAS.find(e => e.id === id)
      if (!extra) return null
      return qty > 1 ? `${extra.label} ×${qty}` : extra.label
    }).filter(Boolean),
  ]

  return (
    <div style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
        <span className="font-zodiak" style={{ fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 'bold' }}>
          {item.isPotd ? `${item.name} (Pizza of the Day)` : item.name}
        </span>
        <span className="font-zodiak" style={{ fontSize: '0.85rem', color: '#1a1a1a' }}>
          ${itemTotal.toFixed(2)}
        </span>
      </div>
      <div className="font-zodiak" style={{ fontSize: '0.75rem', color: mutedColor, marginBottom: '0.15rem' }}>
        {configParts.join(' · ')}
      </div>
      <AllergenIconRow allergens={item.allergens} />
      <div className="font-zodiak" style={{ fontSize: '0.75rem', color: mutedColor }}>
        × {item.quantity}
      </div>
    </div>
  )
}

const PAYMENT_OPTIONS = [
  { id: 'cash', label: 'Cash' },
  { id: 'credit', label: 'Credit Card' },
  { id: 'online', label: 'Online Payment' },
]

// Mobile cart button + drawer sizing — mirrors SideNav's hamburger/drawer exactly.
const MOBILE_CART_BUTTON_SIZE_PX = 44
const MOBILE_CART_BUTTON_OFFSET_PX = 16
const MOBILE_DRAWER_WIDTH = 'min(75vw, 300px)'
// Pill sits directly below the cart button on mobile: button offset + button size + gap.
const MOBILE_PILL_GAP_PX = 8
const MOBILE_PILL_TOP_PX = MOBILE_CART_BUTTON_OFFSET_PX + MOBILE_CART_BUTTON_SIZE_PX + MOBILE_PILL_GAP_PX

export default function CartSidebar({ navVisible, isOpen, onOpen, onClose }) {
  const { order, dispatch, removeItem, updateQuantity, updateItemExtraQuantity, completeOrder } = useOrder()
  const { cartItems } = order
  const isMobile = useIsMobile()

  // view: 'cart' | 'checkout' | 'complete'
  const [view, setView] = useState('cart')
  const [address, setAddress] = useState({ name: '', street: '', city: '', zip: '' })
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [lastOrder, setLastOrder] = useState(null)
  const [storedLastOrder, setStoredLastOrder] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(LAST_ORDER_STORAGE_KEY)
    if (!raw) return
    try {
      setStoredLastOrder(JSON.parse(raw))
    } catch {
      localStorage.removeItem(LAST_ORDER_STORAGE_KEY)
    }
  }, [])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => {
    const extrasPrice = Object.entries(item.extras || {}).reduce((s, [id, qty]) => {
      const extra = EXTRAS.find(e => e.id === id)
      return s + (extra ? extra.price * qty : 0)
    }, 0)
    return sum + (item.price + extrasPrice) * item.quantity
  }, 0)

  // view !== 'cart' keeps the desktop panel visible through checkout/complete even
  // after CLEAR_CART empties the cart mid-flow (cartCount alone would hide it the
  // instant the order completes, before the user ever sees the confirmation).
  const showFull = navVisible && (cartCount > 0 || view !== 'cart')
  const showPill = !navVisible && cartCount > 0

  // Unlike the desktop panel (which hides entirely when empty via showFull), the
  // mobile button must stay visible even with an empty cart — same rule as the
  // hamburger, gated purely on navVisible. The drawer shows an empty state instead.
  const mobileCartButtonVisible = navVisible

  const panelWidth = isMobile
    ? (view !== 'cart' ? '100vw' : MOBILE_DRAWER_WIDTH)
    : (view !== 'cart' ? '480px' : '220px')

  const handleCompleteOrder = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      let id
      if (USE_MOCK) {
        id = generateMockOrderId()
      } else {
        if (!supabase) throw new Error("Couldn't place order — try again.")
        const { data, error } = await supabase.rpc('place_order', {
          p_customer_name: address.name,
          p_street: address.street,
          p_city: address.city,
          p_zip: address.zip,
          p_payment_method: paymentMethod,
          p_items: cartItems,
          p_total: cartTotal,
        })
        if (error) throw error
        id = data
      }

      const receipt = buildOrderReceipt(id, cartItems, cartTotal, address.name)
      setLastOrder(receipt)
      setStoredLastOrder(receipt)
      localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(receipt))
      completeOrder() // POTD decrement — must run before CLEAR_CART while cartItems still holds the order
      dispatch({ type: 'CLEAR_CART' })
      setView('complete')
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong placing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // X / backdrop must not leave a stale 'complete' view behind for next time the
  // drawer opens — 'Got it' (labeled "Done" below) already resets view itself.
  const handleClose = () => {
    if (view === 'complete') setView('cart')
    onClose()
  }

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
      {/* Minimized pill — shown on hero, all viewports */}
      <button
        onClick={() => document.getElementById('pizzas').scrollIntoView({ behavior: 'smooth' })}
        className="font-zodiak"
        style={{
          position: 'fixed',
          ...(isMobile
            ? { right: `${MOBILE_CART_BUTTON_OFFSET_PX}px`, top: `${MOBILE_PILL_TOP_PX}px` }
            : { right: '24px', top: '50%', transform: 'translateY(-50%)' }),
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

      {/* Mobile cart button — mirrors SideNav's hamburger, fixed top-right */}
      {isMobile && (
        <button
          onClick={() => (isOpen ? onClose() : onOpen())}
          aria-label="Open cart"
          style={{
            position: 'fixed',
            top: `${MOBILE_CART_BUTTON_OFFSET_PX}px`,
            right: `${MOBILE_CART_BUTTON_OFFSET_PX}px`,
            width: `${MOBILE_CART_BUTTON_SIZE_PX}px`,
            height: `${MOBILE_CART_BUTTON_SIZE_PX}px`,
            borderRadius: '50%',
            backgroundColor: '#F7F2F6',
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 68,
            opacity: mobileCartButtonVisible ? 1 : 0,
            pointerEvents: mobileCartButtonVisible ? 'auto' : 'none',
            transition: 'opacity 0.4s',
            padding: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              bottom: '-2px',
              left: '-2px',
              backgroundColor: '#39FF14',
              color: '#000',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              borderRadius: '999px',
              minWidth: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              lineHeight: 1,
            }}>
              {cartCount}
            </span>
          )}
        </button>
      )}

      {/* Backdrop — mobile drawer only */}
      {isMobile && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 65,
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'opacity 0.3s',
          }}
        />
      )}

      {/* Full sidebar / mobile drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: panelWidth,
        height: '100vh',
        backgroundColor: view === 'complete' ? '#F2E0B6' : '#F7F2F6',
        zIndex: isMobile ? 70 : 40,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        overflowX: 'hidden',
        ...(isMobile
          ? {
              transform: `translateX(${isOpen ? '0%' : '100%'})`,
              transition: 'transform 0.3s ease, width 0.3s ease',
            }
          : {
              opacity: showFull ? 1 : 0,
              pointerEvents: showFull ? 'auto' : 'none',
              transition: 'opacity 0.4s, width 0.3s ease',
            }),
      }}>

        {/* Close button — mobile drawer only, top-left (mirrored from menu drawer's top-right) */}
        {isMobile && (
          <button
            onClick={handleClose}
            aria-label="Close cart"
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              color: '#555',
              fontSize: '1.5rem',
              lineHeight: 1,
              cursor: 'pointer',
              padding: 0,
              zIndex: 1,
            }}
          >
            &times;
          </button>
        )}

        {view === 'cart' ? (
          <>
            {/* Header */}
            <div style={{ marginBottom: '0.75rem', paddingLeft: isMobile ? '28px' : 0 }}>
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

            {cartItems.length === 0 ? (
              /* Empty state — mobile only; desktop just fades the whole panel out via
                 showFull, so rendering this here would flash for a frame first. */
              isMobile && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center', padding: '0 1rem' }}>
                <span className="font-zodiak" style={{ fontSize: '0.9rem', color: '#888' }}>
                  Your Cart is Empty
                </span>
                <button
                  onClick={() => {
                    document.getElementById('pizzas')?.scrollIntoView({ behavior: 'smooth' })
                    onClose()
                  }}
                  className="font-zodiak"
                  style={{
                    backgroundColor: '#39FF14',
                    color: '#000',
                    fontWeight: 'bold',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '3px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  Check out our pizzas
                </button>
                {storedLastOrder && (
                  <button
                    onClick={() => {
                      if (!lastOrder) setLastOrder(storedLastOrder)
                      setView('complete')
                    }}
                    className="font-zodiak"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#555',
                      fontSize: '0.75rem',
                      textDecoration: 'underline',
                    }}
                  >
                    Your last order: #{storedLastOrder.id} — ${storedLastOrder.total.toFixed(2)}
                  </button>
                )}
              </div>
              )
            ) : (
              <>
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
                onClick={() => setView('checkout')}
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

            {/* Last-order receipt hint — desktop's only path to it, since desktop
                never renders the empty state (see above). */}
            {storedLastOrder && (
              <button
                onClick={() => {
                  if (!lastOrder) setLastOrder(storedLastOrder)
                  setView('complete')
                }}
                className="font-zodiak"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  marginTop: '0.75rem',
                  cursor: 'pointer',
                  color: '#888',
                  fontSize: '0.7rem',
                  textDecoration: 'underline',
                  alignSelf: 'flex-start',
                }}
              >
                Last order: #{storedLastOrder.id} — ${storedLastOrder.total.toFixed(2)}
              </button>
            )}
              </>
            )}
          </>
        ) : view === 'checkout' ? (
          <>
            {/* Checkout header */}
            <div style={{ marginBottom: '0.75rem', paddingLeft: isMobile ? '28px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="font-zodiak" style={{ fontFamily: 'inherit', fontSize: '0.7rem', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' }}>
                  Checkout
                </span>
                <button
                  onClick={() => setView('cart')}
                  className="font-zodiak"
                  style={{ background: 'none', border: 'none', color: '#933C3C', fontSize: '0.8rem', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                >
                  ← Back to Cart
                </button>
              </div>
              <div style={{ height: '1px', backgroundColor: '#ddd' }} />
            </div>

            {/* Order summary — read-only, no steppers/remove */}
            <div style={{ marginBottom: '1rem' }}>
              {cartItems.map((item, index) => (
                <div key={index}>
                  <OrderSummaryLine item={item} />
                  {index < cartItems.length - 1 && (
                    <div style={{ height: '1px', backgroundColor: '#e8e8e8' }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
              <span className="font-zodiak" style={{ fontSize: '0.9rem', color: '#1a1a1a' }}>Total</span>
              <span className="font-zodiak" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                ${cartTotal.toFixed(2)}
              </span>
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
              const canSubmit = formComplete && !isSubmitting
              return (
                <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  {submitError && (
                    <div className="font-zodiak" style={{ color: '#933C3C', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      {submitError}
                    </div>
                  )}
                  <button
                    onClick={handleCompleteOrder}
                    disabled={!canSubmit}
                    className="font-zodiak"
                    style={{
                      backgroundColor: canSubmit ? '#39FF14' : '#ccc',
                      color: '#000',
                      border: 'none',
                      padding: '0.8rem',
                      width: '100%',
                      borderRadius: '3px',
                      cursor: canSubmit ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    {isSubmitting ? 'Placing Order…' : 'Complete Order'}
                  </button>
                </div>
              )
            })()}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center', paddingLeft: isMobile ? '28px' : 0, overflowY: 'auto' }}>
            {/* margin: 'auto 0' centers this group vertically as one block when it fits,
                and degrades to top-anchored scrolling (not bottom-pinned) when it doesn't —
                justifyContent:'center' on the scroll container itself would make an
                overflowing group unreachable at the top instead. */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', margin: 'auto 0' }}>
              {/* Reserved for a future animation — fixed dimensions now so later content can't shift this layout */}
              <div style={{
                width: isMobile ? 'min(350px, 85vw)' : '350px',
                height: isMobile ? 'min(350px, 85vw)' : '350px',
                border: 'none',
                backgroundColor: 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img src="/pizza-of-the-day-clock.svg" alt="" style={{ width: '120px', height: 'auto', pointerEvents: 'none' }} />
              </div>

              <span className="font-zodiak" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                Order #{lastOrder?.id}
              </span>
              <span className="font-zodiak" style={{ fontSize: '0.85rem', color: '#555' }}>
                Thanks{lastOrder?.name ? `, ${lastOrder.name}` : ''}! Your order total was ${lastOrder ? lastOrder.total.toFixed(2) : '0.00'}.
              </span>

              {lastOrder?.items?.length > 0 && (
                <div style={{ width: '100%', textAlign: 'left' }}>
                  {lastOrder.items.map((item, index) => (
                    <div key={index}>
                      <OrderSummaryLine item={item} mutedColor="#5a5a5a" />
                      {index < lastOrder.items.length - 1 && (
                        <div style={{ height: '1px', backgroundColor: '#d9c99a' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setAddress({ name: '', street: '', city: '', zip: '' })
                  setPaymentMethod('cash')
                  setLastOrder(null)
                  setView('cart')
                  onClose()
                }}
                className="font-zodiak"
                style={{
                  backgroundColor: '#39FF14',
                  color: '#000',
                  fontWeight: 'bold',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                }}
              >
                Got it
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
