import { BALLOONS } from './balloons'

function pickBalloon(text) {
  const len = (text || '').length
  if (len < 40) return BALLOONS.s
  if (len <= 90) return BALLOONS.m
  return BALLOONS.l
}

export default function UserBubble({ text }) {
  const balloon = pickBalloon(text)
  const vbWidth = parseInt(balloon.viewBox.split(' ')[2])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '1.25rem',
    }}>
      <div style={{ position: 'relative', width: 'fit-content', maxWidth: '70%' }}>
        <svg
          viewBox={balloon.viewBox}
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          fill="none"
        >
          {/* Mirror horizontally so tail sits bottom-right */}
          <g transform={`translate(${vbWidth},0) scale(-1,1)`}>
            <path
              fill="#F2E0B6"
              stroke="#1a1a1a"
              strokeWidth="5"
              strokeLinejoin="round"
              d={balloon.d}
            />
          </g>
        </svg>
        <div
          className="font-zodiak"
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '1rem 1.5rem 1.5rem 1.25rem',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: '#1a1a1a',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
