import { BOT_LINES } from '../../../data/pizzaBotScript'

const inlineFooterLabelStyle = {
  fontSize: '1.4rem',
  letterSpacing: '0.15em',
  color: '#555',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}

const chipBtn = {
  background: 'none',
  border: '1px solid #1a1a1a',
  color: '#1a1a1a',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '1rem',
}

export default function PartySizeChips({ stepper, dispatch, onPartySizeChip }) {
  const submitStepper = () => {
    const n = stepper
    const chatLabel = n === 4
      ? BOT_LINES.party_size.chips[3].chatLabel
      : BOT_LINES.party_size.chatLabelMany(n)
    onPartySizeChip({ value: n, chatLabel })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
      <span className="font-zodiak" style={inlineFooterLabelStyle}>{BOT_LINES.party_size.footerLabel}</span>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem' }}>
      {BOT_LINES.party_size.chips.slice(0, 3).map(chip => (
        <button
          key={chip.value}
          onClick={() => onPartySizeChip(chip)}
          className="font-zodiak"
          style={{ ...chipBtn, padding: '0.55rem 0', minWidth: 56, fontWeight: 'bold', fontSize: '1.1rem' }}
        >
          {chip.label}
        </button>
      ))}

      {stepper === null ? (
        <button
          onClick={() => dispatch({ type: 'SET_STEPPER', payload: 4 })}
          className="font-zodiak"
          style={{ ...chipBtn, padding: '0.55rem 0', minWidth: 56, fontWeight: 'bold', fontSize: '1.1rem' }}
        >
          4+
        </button>
      ) : (
        <>
          <button
            onClick={() => dispatch({ type: 'SET_STEPPER', payload: Math.max(4, stepper - 1) })}
            style={{ ...chipBtn, padding: '0.45rem 0.7rem' }}
          >−</button>
          <span className="font-zodiak" style={{ minWidth: 28, textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
            {stepper}
          </span>
          <button
            onClick={() => dispatch({ type: 'SET_STEPPER', payload: Math.min(10, stepper + 1) })}
            style={{ ...chipBtn, padding: '0.45rem 0.7rem' }}
          >+</button>
          <button
            onClick={submitStepper}
            className="font-zodiak"
            style={{ backgroundColor: '#1a1a1a', color: '#fff', border: 'none', padding: '0.45rem 1rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.9rem' }}
          >→</button>
        </>
      )}
      </div>
    </div>
  )
}
