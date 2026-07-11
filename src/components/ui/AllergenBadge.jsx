import { useState } from 'react'
import { ALLERGEN_ICONS } from '../icons/AllergenIcons'
import useIsMobile from '../../hooks/useIsMobile'

const badgeStyle = {
  backgroundColor: '#933C3C',
  color: '#E6D6E3',
  borderRadius: '999px',
  padding: '3px 8px 3px 5px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.7rem',
}

export default function AllergenBadge({ allergen, source, isOpen, onToggle }) {
  const Icon = ALLERGEN_ICONS[allergen]
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState(false)

  if (!source) {
    return (
      <span style={badgeStyle}>
        {Icon && <Icon />}
        {allergen}
      </span>
    )
  }

  const showTooltip = isMobile ? isOpen : hovered

  return (
    <span
      style={{ ...badgeStyle, position: 'relative', cursor: isMobile ? 'pointer' : 'default' }}
      onMouseEnter={isMobile ? undefined : () => setHovered(true)}
      onMouseLeave={isMobile ? undefined : () => setHovered(false)}
      onClick={isMobile ? onToggle : undefined}
    >
      {Icon && <Icon />}
      {allergen}
      <span style={{
        position: 'absolute',
        bottom: 'calc(100% + 6px)',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#F2E0B6',
        border: '1px solid #1a1a1a',
        color: '#1a1a1a',
        fontSize: '0.7rem',
        padding: '3px 8px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        opacity: showTooltip ? 1 : 0,
        transition: 'opacity 0.15s',
        zIndex: 10,
      }}>
        from {source}
      </span>
    </span>
  )
}
