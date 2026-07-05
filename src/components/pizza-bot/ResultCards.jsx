const FONT_MAP = {
  'heavy-metal-queen': 'font-metal-mania',
  'mushroom-samba': 'font-kablammo',
}

export function ResultCards({ recommendation, resultSelections, dispatch }) {
  if (!recommendation) return null

  return (
    <div style={{ marginTop: '0.25rem' }}>
      {recommendation.picks.map((rec, i) => {
        const nameFont = FONT_MAP[rec.pizza.id] || 'font-zodiak'
        return (
          <div
            key={i}
            onClick={() => dispatch({ type: 'TOGGLE_RESULT_SELECTION', payload: i })}
            style={{
              border: `1px solid ${resultSelections[i] ? '#1a1a1a' : '#ddd'}`,
              borderRadius: '3px',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              cursor: 'pointer',
              backgroundColor: resultSelections[i] ? '#fafafa' : '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className={nameFont} style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                {rec.pizza.name}
              </span>
              <span className="font-zodiak" style={{ fontSize: '0.9rem', color: '#555' }}>
                ×{rec.quantity} · ${(rec.pizza.price * rec.quantity).toFixed(2)}
              </span>
            </div>
            {(rec.modifications.dough || rec.modifications.cheese) && (
              <div className="font-zodiak" style={{ fontSize: '0.8rem', color: '#777', fontStyle: 'italic', marginTop: '0.2rem' }}>
                · {[
                  rec.modifications.dough && `${rec.modifications.dough} dough`,
                  rec.modifications.cheese && `${rec.modifications.cheese} cheese`,
                ].filter(Boolean).join(' · ')}
              </div>
            )}
            <div className="font-zodiak" style={{ fontSize: '0.8rem', color: '#777', fontStyle: 'italic', marginTop: '0.2rem' }}>
              {rec.reason}
            </div>
            {rec.hasWarning && (
              <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#933C3C' }}>
                ⚠️ Contains allergens you flagged
              </div>
            )}
          </div>
        )
      })}
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
