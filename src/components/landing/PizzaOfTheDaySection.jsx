import { useState } from 'react'
import { getDailyPizza, getTodayKey, POTD_DISCOUNT_MULTIPLIER } from '../../utils/dailyPizza'
import PizzaRow from './PizzaRow'

export default function PizzaOfTheDaySection({ visible }) {
  const pizza = getDailyPizza()
  const todayKey = getTodayKey()
  const [remaining, setRemaining] = useState(() => {
    const stored = localStorage.getItem(todayKey)
    return stored !== null ? parseInt(stored) : 20
  })

  return (
    <div
      id="pizza-of-the-day"
      style={{
        marginLeft: '220px',
        marginRight: '320px',
        paddingLeft: '80px',
        paddingRight: '80px',
        paddingTop: '160px',
        paddingBottom: '80px',
        minHeight: '100vh',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '3rem',
      }}>
        <img
          src="/pizza-of-the-day-clock.svg"
          alt=""
          style={{ height: '7rem', width: 'auto', pointerEvents: 'none' }}
        />
        <h2 className="font-zodiak" style={{
          fontSize: '2.75rem',
          fontWeight: 600,
          letterSpacing: '0',
          color: '#1a1a1a',
          margin: 0,
        }}>
          Pizza of the Day
        </h2>
      </div>

      <div style={{
        marginBottom: '3rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid #ccc',
      }}>
        <p className="font-zodiak" style={{
          fontSize: '1rem',
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
        onOrder={() => {
          const newRemaining = remaining - 1
          setRemaining(newRemaining)
          localStorage.setItem(todayKey, newRemaining)
        }}
      />
    </div>
  )
}
