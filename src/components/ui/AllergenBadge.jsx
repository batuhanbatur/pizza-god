import { ALLERGEN_ICONS } from '../icons/AllergenIcons'

export default function AllergenBadge({ allergen }) {
  const Icon = ALLERGEN_ICONS[allergen]
  return (
    <span style={{
      backgroundColor: '#933C3C',
      color: '#E6D6E3',
      borderRadius: '999px',
      padding: '3px 8px 3px 5px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '0.7rem',
    }}>
      {Icon && <Icon />}
      {allergen}
    </span>
  )
}
