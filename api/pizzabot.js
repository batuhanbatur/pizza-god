import { DOUGH_OPTIONS, CHEESE_OPTIONS, OPTION_REMOVES } from '../src/data/menu.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { partySize, constraints, vibe, menuSummary } = req.body

  const doughOptions = DOUGH_OPTIONS.map(o => o.id)
  const cheeseOptions = CHEESE_OPTIONS.map(o => o.id)
  const enrichedMenu = menuSummary.map(item => ({ ...item, doughOptions, cheeseOptions }))

  const prompt = `You are PizzaBot, the AI assistant for Pizza God — a restaurant where classical antiquity meets street culture. You speak with dry wit and authority.

Customer preferences:
- People: ${partySize}
- Allergens to avoid: ${constraints.length ? constraints.join(', ') : 'none'}
- Vibe: ${vibe}

Menu:
${JSON.stringify(enrichedMenu, null, 2)}

Modifications available on any pizza, and the allergens each one removes:
${JSON.stringify(OPTION_REMOVES, null, 2)}

Recommend 1-3 pizzas. For each, give one short sentence of reasoning in PizzaBot's voice — dry, confident, slightly theatrical. Adjust quantity for party size and hunger. If a pizza would otherwise conflict with an allergen to avoid, but a modification above resolves the conflict, recommend it WITH that modification instead of skipping it, and mention the modification in the reason.

Respond with JSON only:
{
  "picks": [
    { "pizzaId": "pizza-id", "quantity": 1, "reason": "one sentence in PizzaBot voice", "modifications": { "dough": "gluten-free", "cheese": "vegan" } }
  ],
  "voiceLine": "one very short closing line, max 8 words, dry and confident. Examples: 'Your fate is sealed.' / 'The gods have spoken.' / 'Go. Eat. Be worthy.'"
}
"modifications" is optional — omit it entirely, or omit either key, when no change from regular dough / mozzarella is needed.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 500,
      }),
    })

    const data = await response.json()
    const parsed = JSON.parse(data.choices[0].message.content)
    res.status(200).json(parsed)

  } catch (err) {
    res.status(500).json({ error: 'PizzaBot failed' })
  }
}
