import {
  MENU,
  DOUGH_OPTIONS,
  CHEESE_OPTIONS,
  OPTION_REMOVES,
} from "../src/data/menu.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { partySize, constraints = [], vibe } = req.body ?? {}

  if (!partySize || !vibe || !Array.isArray(constraints)) {
    return res.status(400).json({ error: "Invalid request data" })
  }

  // Mirrors src/components/pizza-bot/api.js's resolveBuild safety rule: a pizza is
  // safe if every one of its allergens that's also a selected constraint has some
  // OPTION_REMOVES fix (a dough or cheese swap) that removes it. Kept in sync by
  // hand since the two files can't share code across the client/server boundary
  // without a build step neither currently has.
  function isPizzaSafe(pizza, selectedAllergens) {
    const conflicts = selectedAllergens.filter(allergen =>
      pizza.allergens.includes(allergen),
    )
    return conflicts.every(allergen =>
      Object.values(OPTION_REMOVES).some(removes => removes.includes(allergen)),
    )
  }

  const safeItems = MENU.classics.items.filter(pizza =>
    isPizzaSafe(pizza, constraints),
  )

  // No pizza survives these constraints, even with a swap — don't ask the model to
  // pick from an empty menu. `pick: null` isn't schema-valid (the enum below can't
  // be empty), so this response bypasses the schema/OpenAI call entirely.
  if (safeItems.length === 0) {
    return res.status(200).json({
      remark: "Nothing on the menu survives that list. The kitchen concedes.",
      pick: null,
      alternates: [],
      build: null,
    })
  }

  const doughOptions = DOUGH_OPTIONS.map(option => option.id)
  const cheeseOptions = CHEESE_OPTIONS.map(option => option.id)

  // Banished pizzas never enter the model's context — it can't recommend what it
  // never sees, so an unsafe pick is now structurally impossible, not just filtered
  // after the fact.
  const menuForPrompt = safeItems.map(
    ({ id, name, description, allergens }) => ({
      id,
      name,
      ingredients: description,
      allergens,
    }),
  )

  const pizzaIds = menuForPrompt.map(item => item.id)

  const systemPrompt = `
You are PizzaBot, the recommendation voice for Pizza God.

Your job is to choose a suitable pizza and deliver the recommendation with personality.

VOICE
- Dry, concise, slightly dismissive, but still useful.
- Calm confidence rather than enthusiastic sales language.
- Occasionally mythological, never full fantasy roleplay.
- Sound observant and spontaneous, not like a collection of slogans.
- Use natural conversational English.
- One or two short sentences maximum.

STYLE BOUNDARIES
- Do not make grand declarations about fate, destiny, prophecies, divine judgment,
  or the customer's soul.
- Do not say things like "your fate is sealed" or "the gods have spoken."
- Do not use exclamation marks.
- Do not use em dashes.
- Do not repeat stock closing phrases such as "Trust it", "Good choice", or "Next."
- Do not copy wording from these instructions.
- Avoid generic filler that could apply to every pizza.

REMARK
- Demonstrate why the selected pizza fits this request.
- You may naturally reference one useful customer detail.
- Do not list or mechanically summarize all customer answers.
- Mention a modification when it meaningfully affects the recommendation.
- Vary the sentence structure and comedic angle.
- The remark must feel newly written for this order.
`.trim()

  const userPrompt = `
Choose the most appropriate pizza from the following menu.

MENU
${JSON.stringify(menuForPrompt, null, 2)}
Pizzas not shown are unavailable for this order.

DOUGH OPTIONS
${JSON.stringify(doughOptions)}

CHEESE OPTIONS
${JSON.stringify(cheeseOptions)}

MODIFICATIONS AND REMOVED ALLERGENS
${JSON.stringify(OPTION_REMOVES, null, 2)}

CUSTOMER
- Party size: ${partySize}
- Allergens to avoid: ${constraints.length ? constraints.join(", ") : "none"}
- Occasion: ${vibe}

SELECTION RULES
- Pick exactly one pizza.
- Include zero to two distinct alternates.
- Do not return the main pick again as an alternate.
- Never choose a pizza that remains unsafe for the listed allergens.
- Apply dough or cheese modifications when required.
- Prefer a pizza that meaningfully fits the occasion.
- Write a specific remark tied to the selected pizza and this request.
`.trim()

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "pizza_recommendation",
            strict: true,
            schema: {
              type: "object",
              properties: {
                remark: {
                  type: "string",
                  description:
                    "One or two short, order-specific sentences in PizzaBot voice.",
                },
                pick: {
                  type: "string",
                  enum: pizzaIds,
                },
                alternates: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: pizzaIds,
                  },
                  maxItems: 2,
                },
                build: {
                  type: "object",
                  properties: {
                    dough: {
                      type: ["string", "null"],
                      enum: [...doughOptions, null],
                    },
                    cheese: {
                      type: ["string", "null"],
                      enum: [...cheeseOptions, null],
                    },
                  },
                  required: ["dough", "cheese"],
                  additionalProperties: false,
                },
              },
              required: ["remark", "pick", "alternates", "build"],
              additionalProperties: false,
            },
          },
        },
        temperature: 0.6,
        max_tokens: 180,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("OpenAI error:", response.status, errorBody)

      return res.status(502).json({
        error: "PizzaBot request failed",
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error("OpenAI returned no content")
    }

    const parsed = JSON.parse(content)

    parsed.alternates = parsed.alternates.filter(
      (id, index, array) => id !== parsed.pick && array.indexOf(id) === index,
    )

    return res.status(200).json(parsed)
  } catch (error) {
    console.error("PizzaBot failed:", error)

    return res.status(500).json({
      error: "PizzaBot failed",
    })
  }
}
