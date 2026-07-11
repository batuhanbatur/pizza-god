import godImage from '../../assets/pizza-god-image.webp'
import useIsMobile from '../../hooks/useIsMobile'

export default function AboutSection({ visible }) {
  const isMobile = useIsMobile()

  return (
    <div
      id="about-us"
      style={{
        marginLeft: isMobile ? '20px' : '220px',
        marginRight: isMobile ? '20px' : '220px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s',
        paddingTop: isMobile ? '80px' : '160px',
        paddingBottom: '80px',
      }}
    >
      {(() => {
        const image = (
          <img
            key="image"
            src={godImage}
            alt="Pizza God"
            style={{
              width: isMobile ? '100%' : '750px',
              height: isMobile ? 'auto' : '780px',
              objectFit: 'cover',
              objectPosition: 'center',
              flexShrink: isMobile ? undefined : 0,
            }}
          />
        )
        const textBlock = (
          <div key="text" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: isMobile ? 0 : '1rem' }}>
            <h2
              id="about-us-anchor"
              className="font-zodiak"
              style={{
                fontSize: '2.75rem',
                fontWeight: 600,
                letterSpacing: '0',
                color: '#1a1a1a',
                margin: 0,
                scrollMarginTop: '24px',
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
        )
        return (
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'flex-start', gap: '24px' }}>
            {isMobile ? <>{textBlock}{image}</> : <>{image}{textBlock}</>}
          </div>
        )
      })()}
    </div>
  )
}
