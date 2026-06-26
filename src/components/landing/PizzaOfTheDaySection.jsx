export default function PizzaOfTheDaySection({ visible }) {
  return (
    <div id="pizza-of-the-day" style={{ minHeight: '100vh', paddingTop: '280px', paddingLeft: 'calc(25vw + 130px)', opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
      <h2>Pizza of the Day</h2>
    </div>
  )
}