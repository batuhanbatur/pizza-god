export default function PizzaOfTheDaySection({ visible }) {
  return (
    <div id="pizza-of-the-day" style={{ minHeight: '100vh', paddingTop: '280px', paddingLeft: 'calc(25vw + 130px)', paddingRight: '80px', opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
      <h2 className="font-zodiak" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1.5rem' }}>
        What is Pizza of the Day?
      </h2>
      <p className="font-zodiak" style={{ fontSize: '1rem', color: '#555', lineHeight: 1.7, maxWidth: '560px', marginBottom: '1rem' }}>
        Every day we choose one pizza to spotlight.
      </p>
      <p className="font-zodiak" style={{ fontSize: '1rem', color: '#555', lineHeight: 1.7, maxWidth: '560px', marginBottom: '1rem' }}>
        It's made using ingredients we have in abundance that day, so we can keep everything fresh, reduce food waste, and offer it at a price that honestly feels unfair.
      </p>
      <p className="font-zodiak" style={{ fontSize: '1rem', color: '#1a1a1a', fontWeight: 'bold', lineHeight: 1.7, maxWidth: '560px' }}>
        Limited quantity. One per customer.
      </p>
    </div>
  )
}