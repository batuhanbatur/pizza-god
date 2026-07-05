// AllergenIcons.jsx — 24x24 viewBox, stroke-based, all inherit currentColor
const iconProps = {
  viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
  width: "1em", height: "1em", "aria-hidden": true,
}

export const GlutenIcon = () => (
  <svg {...iconProps}>
    {/* wheat: stem + three grain pairs */}
    <path d="M12 21V7" />
    <path d="M12 7c-3 0-4-2-4-4 2 0 4 1 4 4Zm0 0c3 0 4-2 4-4-2 0-4 1-4 4Z" />
    <path d="M12 12c-3 0-4-2-4-4 2 0 4 1 4 4Zm0 0c3 0 4-2 4-4-2 0-4 1-4 4Z" />
    <path d="M12 17c-3 0-4-2-4-4 2 0 4 1 4 4Zm0 0c3 0 4-2 4-4-2 0-4 1-4 4Z" />
  </svg>
)

export const MilkIcon = () => (
  <svg {...iconProps}>
    {/* milk bottle — reads better than a drop, which usually means "liquid" generically */}
    <path d="M9 3h6M9.5 3v3L7 10v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9l-2.5-4V3" />
    <path d="M7 14h10" />
  </svg>
)

export const SulphitesIcon = () => (
  <svg {...iconProps}>
    {/* wine glass with fill line */}
    <path d="M7 3h10c0 5-2 8-5 8s-5-3-5-8Z" />
    <path d="M8 7h8" />
    <path d="M12 11v7M8 21h8" />
  </svg>
)

export const EggIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3c3.5 0 6.5 5 6.5 10a6.5 6.5 0 1 1-13 0C5.5 8 8.5 3 12 3Z" />
  </svg>
)

export const NutsIcon = () => (
  <svg {...iconProps}>
    {/* hazelnut: cap + body */}
    <path d="M6 10c0-3 2.5-6 6-6s6 3 6 6" />
    <path d="M6 10h12c0 6-3 10-6 10s-6-4-6-10Z" />
    <path d="M6 10c2 1.5 10 1.5 12 0" />
  </svg>
)

export const ALLERGEN_ICONS = {
  Gluten: GlutenIcon,
  Milk: MilkIcon,
  Sulphites: SulphitesIcon,
  Egg: EggIcon,
  Nuts: NutsIcon,
}