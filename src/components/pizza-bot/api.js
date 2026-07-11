import { MENU, DOUGH_OPTIONS, CHEESE_OPTIONS, OPTION_REMOVES } from '../../data/menu'

const USE_MOCK = import.meta.env.DEV

const DOUGH_IDS = DOUGH_OPTIONS.map(o => o.id)
const CHEESE_IDS = CHEESE_OPTIONS.map(o => o.id)

function effectiveAllergensFor(pizza, build) {
  const removed = Object.values(build || {}).flatMap(opt => OPTION_REMOVES[opt] || [])
  return pizza.allergens.filter(a => !removed.includes(a))
}

// Starts from `build` (the model's proposed swap, if any), then auto-fixes any
// allergen conflict still standing via OPTION_REMOVES — same resolution the old
// per-pick flow used, just for a single pick instead of an array of them.
// Exported so alternate-promotion (ResultCards) can re-resolve a build without a
// network round trip — see usePizzaBotFlow's handlePromoteAlternate.
export function resolveBuild(pizza, constraints, build) {
  const resolved = { ...build }
  let allergens = effectiveAllergensFor(pizza, resolved)
  let conflicts = constraints.filter(c => allergens.includes(c))

  if (conflicts.length > 0) {
    conflicts.forEach(allergen => {
      const fixOption = Object.entries(OPTION_REMOVES).find(([, removes]) => removes.includes(allergen))?.[0]
      if (!fixOption) return
      if (DOUGH_IDS.includes(fixOption)) resolved.dough = fixOption
      else if (CHEESE_IDS.includes(fixOption)) resolved.cheese = fixOption
    })
    allergens = effectiveAllergensFor(pizza, resolved)
    conflicts = constraints.filter(c => allergens.includes(c))
  }

  return {
    build: Object.keys(resolved).length ? resolved : null,
    effectiveAllergens: allergens,
    safe: conflicts.length === 0,
  }
}

// Deterministic safety net for section 1's fallback: first menu-order pizza that
// can be made allergen-safe (with or without a dough/cheese swap).
function firstSafePick(constraints) {
  for (const pizza of MENU.classics.items) {
    const resolved = resolveBuild(pizza, constraints, {})
    if (resolved.safe) return { pizza, build: resolved.build, effectiveAllergens: resolved.effectiveAllergens }
  }
  // Not reachable with the current menu: Gluten and Milk are always fixable via
  // OPTION_REMOVES, so only an allergen with no swap (e.g. Sulphites) present on
  // every single pizza could exhaust this loop.
  const pizza = MENU.classics.items[0]
  return { pizza, build: null, effectiveAllergens: pizza.allergens }
}

export function partySizeLine(partySize) {
  const bucket = partySize === 1 ? 'Small order.'
    : partySize === 2 ? 'Medium order.'
    : partySize <= 4 ? 'Larger order.'
    : 'Big order.'
  const people = partySize === 1 ? 'One' : `Party of ${partySize}`
  return `${people}. ${bucket}`
}

// Deterministic, code-generated — reports what the allergen filter actually did,
// per allergen: banished pizzas outright, forced a swap (per OPTION_REMOVES), or
// (edge case not currently reachable by the menu) matched nothing at all. The
// blanket "no restrictions" line is reserved for zero allergens selected — once
// the user has flagged anything, every flagged allergen gets its own line.
export function allergenFilterLines(constraints) {
  if (constraints.length === 0) return ['No restrictions. Full menu in play.']

  return constraints.map(allergen => {
    const fixOption = Object.entries(OPTION_REMOVES).find(([, removes]) => removes.includes(allergen))?.[0]
    if (fixOption) {
      const swapPhrase = fixOption === 'gluten-free' ? 'Gluten-free dough.'
        : fixOption === 'vegan' ? 'Vegan cheese it is.'
        : `${fixOption}.`
      return `${allergen}. ${swapPhrase}`
    }
    const out = MENU.classics.items.filter(p => p.allergens.includes(allergen))
    if (out.length === 0) return `${allergen}. Not on the menu anyway.`
    return `${allergen}. ${out.map(p => p.name).join(', ')} out.`
  })
}

// Deterministic, code-generated — the third progressive-reveal line, shown right
// after the vibe chip is answered.
export function vibeLine(vibe) {
  const label = vibe === 'quiet' ? 'Quiet night'
    : vibe === 'movie' ? 'Movie night'
    : vibe === 'starving' ? 'Starving'
    : vibe === 'celebration' ? 'Celebration'
    : null
  return label ? `${label}. Noted.` : 'Noted.'
}

export async function getRecommendation({ partySize, constraints, vibe }) {
  let parsed

  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 1200))
    parsed = {
      verdict: 'Two of you, movie night, no dairy. Vegan-cheese Margherita. Next.',
      pick: 'margherita',
      alternates: ['pepperoni', 'four-cheese'],
      build: { cheese: 'vegan' },
    }
  } else {
    const response = await fetch('/api/pizzabot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partySize, constraints, vibe }),
    })
    parsed = await response.json()
  }

  // Section 1's safety net: the model's pick is IDs only. Validate it exists and
  // is actually allergen-safe (after any swap) before ever rendering it.
  const candidate = MENU.classics.items.find(p => p.id === parsed.pick)
  const resolved = candidate ? resolveBuild(candidate, constraints, parsed.build || {}) : null

  let pick
  let verdict

  if (candidate && resolved.safe) {
    pick = { pizza: candidate, build: resolved.build, effectiveAllergens: resolved.effectiveAllergens }
    verdict = parsed.verdict
  } else {
    const fallback = firstSafePick(constraints)
    pick = fallback
    verdict = 'Straightforward call tonight. No drama, no allergens.'
  }

  // Alternates are name/price only in the UI, so only inherently-safe pizzas
  // qualify — never one that's only safe by way of an unstated swap.
  const alternates = (parsed.alternates || [])
    .map(id => MENU.classics.items.find(p => p.id === id))
    .filter(p => p && p.id !== pick.pizza.id && p.allergens.every(a => !constraints.includes(a)))
    .slice(0, 2)
    .map(pizza => ({ pizza }))

  return { verdict, pick, alternates }
}
