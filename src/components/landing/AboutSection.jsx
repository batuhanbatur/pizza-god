import godImage from '../../assets/pizza-god-image.webp'

export default function AboutSection({ visible }) {
  return (
    <div
      id="about-us"
      style={{
        marginLeft: '220px',
        marginRight: '220px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s',
        paddingTop: '160px',
        paddingBottom: '80px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        <img
          src={godImage}
          alt="Pizza God"
          style={{
            width: '750px',
            height: '780px',
            objectFit: 'cover',
            objectPosition: 'center',
            flexShrink: 0,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '1rem' }}>
          <h2
            className="font-zodiak"
            style={{
              fontSize: '2.75rem',
              fontWeight: 600,
              letterSpacing: '0',
              color: '#1a1a1a',
              margin: 0,
            }}
          >
            About Us
          </h2>
          <p className="font-zodiak" style={{ fontSize: '1rem', color: '#1a1a1a', lineHeight: '1.8', margin: 0 }}>
            Before Pizza God existed, "Oh my God!" was the thing our chef heard most after serving a pizza. So we kept the name.
          </p>
          <p className="font-zodiak" style={{ fontSize: '1rem', color: '#1a1a1a', lineHeight: '1.8', margin: 0 }}>
            The menu is small on purpose. A handful of pizzas we're proud of beats a hundred you'll forget. And we'd love to become your default answer to "what should we eat?"
          </p>
          <p className="font-zodiak" style={{ fontSize: '1rem', color: '#1a1a1a', lineHeight: '1.8', margin: 0 }}>
            Pizza of the Day is the same idea wearing a different hat: whatever ingredients we have too much of, we turn into one great pizza at a price that feels unfair. You eat well, we waste less.
          </p>
        </div>
      </div>
    </div>
  )
}