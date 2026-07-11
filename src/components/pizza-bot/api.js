import { MENU, DOUGH_OPTIONS, CHEESE_OPTIONS, OPTION_REMOVES } from '../../data/menu'

const USE_MOCK = import.meta.env.VITE_PIZZABOT_MOCK === 'true'

const DOUGH_IDS = DOUGH_OPTIONS.map(o => o.id)
const CHEESE_IDS = CHEESE_OPTIONS.map(o => o.id)

function effectiveAllergensFor(pizza, build) {
  const removed = Object.values(build || {}).flatMap(opt => OPTION_REMOVES[opt] || [])
  return pizza.allergens.filter(a => !removed.includes(a))
}

// Derives the dough/cheese swap strictly from the user's selected constraints —
// never from a model- or caller-supplied build guess. There is exactly one fix
// per allergen in OPTION_REMOVES, so there's nothing for a model to usefully add
// here; trusting an incoming build only risked carrying along an unrequested swap
// (see api.js bug report: Gluten-only constraints applying a vegan-cheese swap
// because a stale build object was spread in wholesale instead of being derived
// fresh from `constraints`).
// Exported so alternate-promotion (ResultCards) can re-resolve a build without a
// network round trip — see usePizzaBotFlow's handlePromoteAlternate.
export function resolveBuild(pizza, constraints) {
  const resolved = {}
  const conflicts = constraints.filter(c => pizza.allergens.includes(c))

  conflicts.forEach(allergen => {
    const fixOption = Object.entries(OPTION_REMOVES).find(([, removes]) => removes.includes(allergen))?.[0]
    if (!fixOption) return
    if (DOUGH_IDS.includes(fixOption)) resolved.dough = fixOption
    else if (CHEESE_IDS.includes(fixOption)) resolved.cheese = fixOption
  })

  const allergens = effectiveAllergensFor(pizza, resolved)
  const stillConflicting = constraints.filter(c => allergens.includes(c))

  return {
    build: Object.keys(resolved).length ? resolved : null,
    effectiveAllergens: allergens,
    safe: stillConflicting.length === 0,
  }
}

// Deterministic safety net for section 1's fallback: first menu-order pizza that
// can be made allergen-safe (with or without a dough/cheese swap).
function firstSafePick(constraints) {
  for (const pizza of MENU.classics.items) {
    const resolved = resolveBuild(pizza, constraints)
    if (resolved.safe) return { pizza, build: resolved.build, effectiveAllergens: resolved.effectiveAllergens }
  }
  // Not reachable with the current menu: Gluten and Milk are always fixable via
  // OPTION_REMOVES, so only an allergen with no swap (e.g. Sulphites) present on
  // every single pizza could exhaust this loop.
  const pizza = MENU.classics.items[0]
  return { pizza, build: null, effectiveAllergens: pizza.allergens }
}

const ALLERGEN_NOUN = {
  Gluten: 'gluten',
  Milk: 'dairy',
  Egg: 'egg',
  Soy: 'soy',
  Nuts: 'nuts',
  Sesame: 'sesame',
  Mustard: 'mustard',
  Sulphites: 'sulphites',
}

// Structural fix for verdict miscitation: the facts are stated here, in code,
// never left to the model. The model only ever supplies a closing remark (see
// getRecommendation) — it cannot misquote a party size or allergen it never sees
// as text it's allowed to repeat.
export function buildVerdictOpening(partySize, vibe, constraints) {
  const partyPart = partySize === 1 ? 'One.'
    : partySize === 2 ? 'Two of you.'
    : `${partySize} of you.`

  const vibeLabel = vibe === 'quiet' ? 'Quiet night'
    : vibe === 'movie' ? 'Movie night'
    : vibe === 'starving' ? 'Starving'
    : vibe === 'celebration' ? 'Celebration'
    : null
  const vibePart = vibeLabel ? `${vibeLabel}.` : null

  const allergenPart = constraints.length > 0
    ? `No ${constraints.map(a => ALLERGEN_NOUN[a] || a.toLowerCase()).join(', no ')}.`
    : null

  return [partyPart, vibePart, allergenPart].filter(Boolean).join(' ')
}

export async function getRecommendation({ partySize, constraints, vibe }) {
  let parsed

  if (USE_MOCK) {
    console.info('PizzaBot: mock response (VITE_PIZZABOT_MOCK)')
    await new Promise(r => setTimeout(r, 1200))
    parsed = {
      remark: 'Trust it.',
      pick: 'margherita',
      alternates: ['pepperoni', 'four-cheese'],
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
  const resolved = candidate ? resolveBuild(candidate, constraints) : null

  const opening = buildVerdictOpening(partySize, vibe, constraints)

  let pick
  let verdict

  if (candidate && resolved.safe) {
    pick = { pizza: candidate, build: resolved.build, effectiveAllergens: resolved.effectiveAllergens }
    verdict = `${opening} ${parsed.remark}`
  } else {
    // Same opening builder as the success path — the fallback only ever swaps in a
    // neutral, code-written remark, never a fact-bearing sentence of its own.
    pick = firstSafePick(constraints)
    verdict = `${opening} Straightforward call.`
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
