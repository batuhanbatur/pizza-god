import { BALLOONS } from './balloons'
import useIsMobile from '../../hooks/useIsMobile'

function pickBalloon(text) {
  const len = (text || '').length
  if (len < 40) return BALLOONS.s
  if (len <= 90) return BALLOONS.m
  return BALLOONS.l
}

export default function PizzaBotBubble({ text, avatar }) {
  const balloon = pickBalloon(text)
  const isMobile = useIsMobile()
  const avatarSize = 125
  const backdropSize = 110

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: isMobile ? '6px' : '12px',
      marginBottom: '1.25rem',
    }}>
      {/* Avatar with circle backdrop */}
      <div style={{ position: 'relative', width: avatarSize, height: avatarSize, flexShrink: 0 }}>
        <div style={{
          position: 'absolute',
          width: backdropSize,
          height: backdropSize,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          backgroundColor: '#F2E0B6',
        }} />
        <img
          src={avatar || '/pizza-bot/god-head-base.svg'}
          alt="PizzaBot"
          style={{
            position: 'relative',
            width: avatarSize,
            height: avatarSize,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Balloon */}
      <div style={{ position: 'relative', width: 'fit-content', maxWidth: '70%' }}>
        <svg
          viewBox={balloon.viewBox}
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          fill="none"
        >
          <path
            fill="#F2E0B6"
            stroke="#1a1a1a"
            strokeWidth="5"
            strokeLinejoin="round"
            d={balloon.d}
          />
        </svg>
        <div
          className="font-zodiak"
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '1rem 1.25rem 1.5rem 1.5rem',
            fontSize: '0.95rem',
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
