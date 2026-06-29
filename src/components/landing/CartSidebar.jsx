import { useOrder } from '../../context/OrderContext'

export default function CartSidebar({ navVisible }) {
  const { order, removeItem, updateQuantity } = useOrder()
  const { cartItems } = order

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => {
    const poppersPrice = item.poppers ? 3.99 * (item.poppersQuantity || 1) : 0
    return sum + (item.price + poppersPrice) * item.quantity
  }, 0)

  const showFull = navVisible && cartCount > 0
  const showPill = !navVisible && cartCount > 0

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
      width: '220px',
      height: '100vh',
      backgroundColor: '#F7F2F6',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      opacity: showFull ? 1 : 0,
      pointerEvents: showFull ? 'auto' : 'none',
      transition: 'opacity 0.4s',
    }}>

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
      <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0' }}>
        {cartItems.map((item, index) => {
          const itemTotal = (item.price + (item.poppers ? 3.99 * (item.poppersQuantity || 1) : 0)) * item.quantity
          return (
            <div key={index}>
              <div style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>

                {/* Name + total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                  <span className="font-zodiak" style={{ fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 'bold' }}>
                    {item.name}
                  </span>
                  <span className="font-zodiak" style={{ fontSize: '0.85rem', color: '#1a1a1a' }}>
                    ${itemTotal.toFixed(2)}
                  </span>
                </div>

                {/* Dough + cheese */}
                <div className="font-zodiak" style={{ fontSize: '0.75rem', color: '#888', marginBottom: item.poppers ? '0.15rem' : '0.4rem' }}>
                  {item.dough === 'gluten-free' ? 'GF Dough' : 'Regular'} · {item.cheese === 'vegan' ? 'Vegan' : 'Mozzarella'}
                </div>

                {/* Poppers */}
                {item.poppers && (
                  <div className="font-zodiak" style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.4rem' }}>
                    + Jalapeño Poppers ×{item.poppersQuantity}
                  </div>
                )}

                {/* Quantity controls + remove */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
          onClick={() => console.log('checkout')}
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

    </div>
    </>
  )
}
