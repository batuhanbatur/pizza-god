import { BOT_LINES } from '../../../data/pizzaBotScript'

const inlineFooterLabelStyle = {
  fontSize: '1.4rem',
  letterSpacing: '0.15em',
  color: '#555',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}

export default function AllergenChips({ allergens, dispatch, onConstraintsDone }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <span className="font-zodiak" style={inlineFooterLabelStyle}>{BOT_LINES.constraints.footerLabel}</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem' }}>
        {BOT_LINES.constraints.chips.map(allergen => {
          const selected = allergens.includes(allergen)
          return (
            <button
              key={allergen}
              onClick={() => dispatch({ type: 'TOGGLE_ALLERGEN', payload: allergen })}
              className="font-zodiak"
              style={{
                background: selected ? '#933C3C' : 'none',
                border: `1px solid ${selected ? '#933C3C' : '#ccc'}`,
                color: selected ? '#E6D6E3' : '#555',
                padding: '0.3rem 0.8rem',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {allergen}
            </button>
          )
        })}
        </div>
      </div>
      <button
        onClick={onConstraintsDone}
        className="font-zodiak"
        style={{
          backgroundColor: '#1a1a1a',
          color: '#fff',
          border: 'none',
          padding: '0.45rem 1.5rem',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        {allergens.length > 0 ? 'Next →' : 'No Allergies'}
      </button>
    </div>
  )
}
