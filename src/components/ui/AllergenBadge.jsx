import GlutenIcon from '../../assets/allergens/allergen-gluten.svg?react'
import MilkIcon from '../../assets/allergens/allergen-milk.svg?react'
import EggIcon from '../../assets/allergens/allergen-egg.svg?react'
import SoyIcon from '../../assets/allergens/allergen-soy.svg?react'
import NutsIcon from '../../assets/allergens/allergen-nuts.svg?react'
import SesameIcon from '../../assets/allergens/allergen-sesame.svg?react'

const ALLERGEN_ICONS = {
  Gluten: GlutenIcon,
  Milk: MilkIcon,
  Egg: EggIcon,
  Soy: SoyIcon,
  Nuts: NutsIcon,
  Sesame: SesameIcon,
}

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
      {Icon && <Icon width={14} height={14} />}
      {allergen}
    </span>
  )
}
