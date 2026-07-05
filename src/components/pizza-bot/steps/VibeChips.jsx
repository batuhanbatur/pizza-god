import { BOT_LINES } from '../../../data/pizzaBotScript'

const footerLabelStyle = {
  fontSize: '0.7rem',
  letterSpacing: '0.15em',
  color: '#555',
  textTransform: 'uppercase',
  textAlign: 'center',
  marginBottom: '0.75rem',
}

export default function VibeChips({ onVibeChip }) {
  return (
    <>
      <div className="font-zodiak" style={footerLabelStyle}>{BOT_LINES.vibe.footerLabel}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {BOT_LINES.vibe.chips.map(chip => (
        <button
          key={chip.value}
          onClick={() => onVibeChip(chip)}
          className="font-zodiak"
          style={{
            background: 'none',
            border: '1px solid #1a1a1a',
            color: '#1a1a1a',
            padding: '0.5rem 1rem',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            width: '100%',
            textAlign: 'left',
          }}
        >
          {chip.label}
        </button>
      ))}
      </div>
    </>
  )
}
