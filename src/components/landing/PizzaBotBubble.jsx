export default function PizzaBotBubble({ text, avatar }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '1.25rem',
    }}>
      {/* Avatar */}
      <img
        src={avatar || '/pizza-bot/god-head-base.svg'}
        alt="PizzaBot"
        style={{
          width: '100px',
          height: '100px',
          flexShrink: 0,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
      {/* Balloon */}
      <div style={{ position: 'relative', flex: 1 }}>
        <svg
          viewBox="0 0 300 120"
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
          }}
          fill="none"
        >
          <path
            fill="#F2E0B6"
            stroke="#1a1a1a"
            strokeWidth="5"
            strokeLinejoin="round"
            d="M 24 18 C 60 10 104 14 148 11 C 196 8 244 13 276 16 C 288 17 294 24 292 34 C 290 44 293 56 291 66 C 289 78 284 86 272 88 C 232 94 188 89 144 92 C 116 94 88 91 66 92 C 58 92 50 94 44 98 C 36 103 28 110 22 112 C 26 105 30 99 31 93 C 22 91 13 87 10 78 C 6 66 9 52 8 40 C 7 28 12 21 24 18 Z"
          />
        </svg>
        <div
          className="font-zodiak"
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '1rem 1.5rem 1.5rem 1.25rem',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: '#1a1a1a',
            minHeight: '80px',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
