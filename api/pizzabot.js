export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { partySize, constraints, vibe, menuSummary } = req.body

  const prompt = `You are PizzaBot, the AI assistant for Pizza God — a restaurant where classical antiquity meets street culture. You speak with dry wit and authority.

Customer preferences:
- People: ${partySize}
- Allergens to avoid: ${constraints.length ? constraints.join(', ') : 'none'}
- Vibe: ${vibe}

Menu:
${JSON.stringify(menuSummary, null, 2)}

Recommend 1-3 pizzas. For each, give one short sentence of reasoning in PizzaBot's voice — dry, confident, slightly theatrical. Adjust quantity for party size and hunger.

Respond with JSON only:
{
  "picks": [
    { "pizzaId": "pizza-id", "quantity": 1, "reason": "one sentence in PizzaBot voice" }
  ],
  "voiceLine": "one very short closing line, max 8 words, dry and confident. Examples: 'Your fate is sealed.' / 'The gods have spoken.' / 'Go. Eat. Be worthy.'"
}`

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
