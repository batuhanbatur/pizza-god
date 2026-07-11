import { getDailyPizza, POTD_DISCOUNT_MULTIPLIER } from '../../utils/dailyPizza'
import PizzaRow from './PizzaRow'
import useIsMobile from '../../hooks/useIsMobile'
import { useOrder } from '../../context/OrderContext'

export default function PizzaOfTheDaySection({ visible }) {
  const pizza = getDailyPizza()
  const isMobile = useIsMobile()
  const { order } = useOrder()
  const remaining = order.potdRemaining

  return (
    <div
      id="pizza-of-the-day"
      style={{
        marginLeft: isMobile ? 0 : '220px',
        marginRight: isMobile ? 0 : '320px',
        paddingLeft: isMobile ? '20px' : '80px',
        paddingRight: isMobile ? '20px' : '80px',
        paddingTop: isMobile ? '80px' : '160px',
        paddingBottom: '80px',
        minHeight: '100vh',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s',
      }}
    >
      <div
        id="pizza-of-the-day-anchor"
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? '0.5rem' : '1rem',
          marginBottom: isMobile ? '1.25rem' : '3rem',
          scrollMarginTop: '24px',
        }}>
        <img
          src="/pizza-of-the-day-clock.svg"
          alt=""
          style={{ height: isMobile ? '6.75rem' : '7rem', width: 'auto', pointerEvents: 'none' }}
        />
        <h2 className="font-zodiak" style={{
          fontSize: isMobile ? '2rem' : '2.75rem',
          fontWeight: 600,
          letterSpacing: '0',
          color: '#1a1a1a',
          margin: 0,
          textAlign: isMobile ? 'center' : 'left',
        }}>
          Pizza of the Day
        </h2>
      </div>

      <div style={{
        marginBottom: isMobile ? '1.25rem' : '3rem',
        paddingBottom: isMobile ? 0 : '2rem',
        borderBottom: isMobile ? 'none' : '1px solid #ccc',
      }}>
        <p className="font-zodiak" style={{
          fontSize: isMobile ? '0.875rem' : '1rem',
          color: '#555',
          lineHeight: '1.8',
          maxWidth: '100%',
        }}>
          Every day we choose one pizza to spotlight. It's made using ingredients we have in abundance that day, so we can keep everything fresh, reduce food waste, and offer it at a price that honestly feels unfair.
        </p>
        <p className="font-zodiak" style={{
          fontSize: '0.85rem',
          color: '#933C3C',
          marginTop: '0.75rem',
          letterSpacing: '0.05em',
        }}>
          Limited quantity. One per customer.
        </p>
        <p className="font-zodiak" style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>
          Remaining for {new Date().getDate().toString().padStart(2, '0')}/{(new Date().getMonth() + 1).toString().padStart(2, '0')}: <strong>{remaining}</strong>
        </p>
      </div>

      <PizzaRow
        pizza={pizza}
        discountedPrice={+(pizza.price * POTD_DISCOUNT_MULTIPLIER).toFixed(2)}
        isPotd={false}
        soldOut={remaining === 0}
      />
    </div>
  )
}
