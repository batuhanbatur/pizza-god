import { MENU, DOUGH_OPTIONS, CHEESE_OPTIONS, OPTION_REMOVES } from '../../data/menu'

const USE_MOCK = import.meta.env.DEV

export async function getRecommendation({ partySize, constraints, vibe }) {
  let parsed

  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 1200))
    parsed = {
      picks: [
        { pizzaId: 'margherita', quantity: 1, reason: 'The foundation, remade with vegan cheese so the milk gods stay appeased.', modifications: { cheese: 'vegan' } },
        { pizzaId: 'pepperoni', quantity: 1, reason: 'A reliable prophecy. The pepperoni never lies.' },
      ],
      voiceLine: 'Your fate is sealed.',
    }
  } else {
    const response = await fetch('/api/pizzabot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partySize,
        constraints,
        vibe,
        menuSummary: MENU.classics.items.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          allergens: p.allergens,
          tags: p.tags,
        })),
      }),
    })
    parsed = await response.json()
  }

  const doughIds = DOUGH_OPTIONS.map(o => o.id)
  const cheeseIds = CHEESE_OPTIONS.map(o => o.id)
  const effectiveAllergensFor = (pizza, modifications) => {
    const removed = Object.values(modifications).flatMap(opt => OPTION_REMOVES[opt] || [])
    return pizza.allergens.filter(a => !removed.includes(a))
  }

  const enriched = parsed.picks.map(pick => {
    const pizza = MENU.classics.items.find(p => p.id === pick.pizzaId)
    if (!pizza) return null

    const modifications = { ...pick.modifications }
    let effectiveAllergens = effectiveAllergensFor(pizza, modifications)
    let conflicts = constraints.filter(c => effectiveAllergens.includes(c))

    if (conflicts.length > 0) {
      conflicts.forEach(allergen => {
        const fixOption = Object.entries(OPTION_REMOVES).find(([, removes]) => removes.includes(allergen))?.[0]
        if (!fixOption) return
        if (doughIds.includes(fixOption)) modifications.dough = fixOption
        else if (cheeseIds.includes(fixOption)) modifications.cheese = fixOption
      })
      effectiveAllergens = effectiveAllergensFor(pizza, modifications)
      conflicts = constraints.filter(c => effectiveAllergens.includes(c))
      if (conflicts.length > 0) return null // unfixable — drop the pick
    }

    const hasWarning = conflicts.length > 0 // safety net; shouldn't happen given the drop above
    return { ...pick, pizza, modifications, effectiveAllergens, hasWarning }
  }).filter(Boolean)

  return { picks: enriched, voiceLine: parsed.voiceLine }
}
