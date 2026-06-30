import pizzaGodImage from '../../assets/pizza-god-image.png'

export default function AboutSection({ visible }) {
  return (
    <div id="about-us" style={{ minHeight: '100vh', paddingTop: '280px', paddingLeft: 'calc(25vw + 130px)', opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
      <img src={pizzaGodImage} alt="Pizza God" style={{ maxWidth: '100%' }} />
    </div>
  )
}
