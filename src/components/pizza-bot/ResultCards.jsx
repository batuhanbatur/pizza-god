import useIsMobile from '../../hooks/useIsMobile'

const FONT_MAP = {
  'heavy-metal-queen': 'font-metal-mania',
  'mushroom-samba': 'font-kablammo',
}

export function ResultCards({ recommendation, onPromote }) {
  const isMobile = useIsMobile()
  if (!recommendation) return null

  const { verdict, pick, alternates } = recommendation
  const nameFont = FONT_MAP[pick.pizza.id] || 'font-zodiak'

  return (
    <div style={{ marginTop: '0.25rem' }}>

      {/* Deterministic facts (party size, vibe, allergens) live only in the verdict's
          opening line below, built in code by getRecommendation — not restated here. */}

      {/* Featured card — the pick */}
      <div style={{
        border: '1px solid #1a1a1a',
        borderRadius: '3px',
        padding: '1rem 1.25rem',
        marginBottom: '0.75rem',
        backgroundColor: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={nameFont} style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1a1a1a' }}>
            {pick.pizza.name}
          </span>
          <span className="font-zodiak" style={{ fontSize: '1rem', color: '#555' }}>
            ${pick.pizza.price.toFixed(2)}
          </span>
        </div>

        <div className="font-zodiak" style={{ fontSize: '0.85rem', color: '#933C3C', fontStyle: 'italic', marginTop: '0.2rem' }}>
          {pick.pizza.tagline}
        </div>

        {pick.build && (pick.build.dough || pick.build.cheese) && (
          <div className="font-zodiak" style={{ fontSize: '0.8rem', color: '#777', fontStyle: 'italic', marginTop: '0.3rem' }}>
            · {[
              pick.build.dough && `${pick.build.dough} dough`,
              pick.build.cheese && `${pick.build.cheese} cheese`,
            ].filter(Boolean).join(' · ')}
          </div>
        )}

        <div className="font-zodiak" style={{ fontSize: '0.9rem', color: '#1a1a1a', marginTop: '0.6rem' }}>
          {verdict}
        </div>
      </div>

      {/* Alternates — visibly smaller, name + price only */}
      {alternates.length > 0 && (
        <div>
          <div className="font-zodiak" style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '0.4rem' }}>
            Also acceptable:
          </div>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0.5rem' }}>
            {alternates.map((alt, i) => (
              <div
                key={alt.pizza.id}
                onClick={() => onPromote?.(i)}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                  padding: '0.4rem 0.7rem',
                  backgroundColor: '#fafafa',
                  width: isMobile ? '100%' : 'auto',
                  flex: isMobile ? 'none' : '1 1 0',
                  cursor: 'pointer',
                }}
              >
                <div className="font-zodiak" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                  {alt.pizza.name}
                </div>
                <div className="font-zodiak" style={{ fontSize: '0.75rem', color: '#555' }}>
                  ${alt.pizza.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function AddToCartButton({ onAddToCart }) {
  return (
    <button
      onClick={onAddToCart}
      className="font-zodiak"
      style={{
        width: '100%',
        backgroundColor: '#39FF14',
        color: '#000',
        border: 'none',
        padding: '0.75rem',
        borderRadius: '3px',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '0.25rem',
      }}
    >
      Add to cart &amp; go to menu →
    </button>
  )
}
