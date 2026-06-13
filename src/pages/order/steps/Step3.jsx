import { useState } from "react"
import { useOrder } from "../../../context/OrderContext"

const MOCK_PIZZAS = [
  {
    id: 1,
    name: "Margherita",
    description: "Classic tomato base, fresh mozzarella, basil.",
    price: 12.90,
    ingredients: ["Tomato", "Mozzarella", "Basil"],
    allergens: ["Dairy", "Gluten"],
  },
  {
    id: 2,
    name: "Pepperoni",
    description: "Tomato base, mozzarella, generous pepperoni.",
    price: 14.90,
    ingredients: ["Tomato", "Mozzarella", "Pepperoni"],
    allergens: ["Dairy", "Gluten"],
  },
  {
    id: 3,
    name: "Quattro Formaggi",
    description: "Four cheese blend on a white base.",
    price: 15.90,
    ingredients: ["Mozzarella", "Gorgonzola", "Parmesan", "Ricotta"],
    allergens: ["Dairy", "Gluten"],
  },
  {
    id: 4,
    name: "Diavola",
    description: "Spicy salami, tomato, chili oil.",
    price: 14.90,
    ingredients: ["Tomato", "Mozzarella", "Spicy Salami", "Chili"],
    allergens: ["Dairy", "Gluten"],
  },
  {
    id: 5,
    name: "Verdure",
    description: "Seasonal roasted vegetables, olive oil, garlic.",
    price: 13.90,
    ingredients: ["Tomato", "Zucchini", "Peppers", "Mushrooms", "Garlic"],
    allergens: ["Gluten"],
  },
  {
    id: 6,
    name: "Tonno",
    description: "Tuna, red onion, capers, tomato base.",
    price: 13.90,
    ingredients: ["Tomato", "Tuna", "Onions", "Capers"],
    allergens: ["Dairy", "Gluten", "Shellfish"],
  },
  {
    id: 7,
    name: "Hawaii",
    description: "Ham, pineapple, tomato, mozzarella.",
    price: 13.90,
    ingredients: ["Tomato", "Mozzarella", "Ham", "Pineapple"],
    allergens: ["Dairy", "Gluten"],
  },
]

export default function Step3() {
  const { order, dispatch } = useOrder()
  const [showMore, setShowMore] = useState(false)

  // Filter top 5 — exclude disliked and allergens from top picks
  const top5 = MOCK_PIZZAS.filter(pizza => {
    const hasDisliked = pizza.ingredients.some(i =>
      order.dislikedIngredients.includes(i)
    )
    const hasAllergen = pizza.allergens.some(a =>
      order.allergens.includes(a)
    )
    return !hasDisliked && !hasAllergen
  }).slice(0, 5)

  // Rest go in "show more"
  const rest = MOCK_PIZZAS.filter(p => !top5.includes(p))

  function togglePizza(pizza) {
    const current = order.selectedPizzas
    const exists = current.find(p => p.id === pizza.id)

    // Check if pizza has allergens or dislikes
    const hasAllergen = pizza.allergens.some(a => order.allergens.includes(a))
    const hasDisliked = pizza.ingredients.some(i => order.dislikedIngredients.includes(i))

    if (!exists) {
      if (hasAllergen || hasDisliked) {
        const warning = hasAllergen
          ? `This pizza contains ${pizza.allergens.filter(a => order.allergens.includes(a)).join(", ")}. Add anyway?`
          : `This pizza contains ingredients you disliked. Add anyway?`
        if (!window.confirm(warning)) return
      }
      dispatch({ type: "SET_PIZZAS", payload: [...current, pizza] })
    } else {
      dispatch({ type: "SET_PIZZAS", payload: current.filter(p => p.id !== pizza.id) })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-zodiak text-2xl font-semibold">Our recommendations</h2>

      {/* Top 5 */}
      <div className="flex flex-col gap-3">
        {top5.length === 0 && (
          <p className="text-gray-400 text-sm">No pizzas match your preferences perfectly — check the options below.</p>
        )}
        {top5.map(pizza => (
          <PizzaCard
            key={pizza.id}
            pizza={pizza}
            selected={!!order.selectedPizzas.find(p => p.id === pizza.id)}
            onToggle={() => togglePizza(pizza)}
          />
        ))}
      </div>

      {/* Show more */}
      {rest.length > 0 && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowMore(v => !v)}
            className="text-sm text-gray-400 hover:text-black transition-colors text-left"
          >
            {showMore ? "▲ Show less" : "▼ Show more options"}
          </button>
          {showMore && rest.map(pizza => (
            <PizzaCard
              key={pizza.id}
              pizza={pizza}
              selected={!!order.selectedPizzas.find(p => p.id === pizza.id)}
              onToggle={() => togglePizza(pizza)}
              dimmed
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PizzaCard({ pizza, selected, onToggle, dimmed }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left p-4 border rounded transition-all ${
        selected
          ? "border-black bg-black text-white"
          : dimmed
          ? "border-gray-200 opacity-50 hover:opacity-100 hover:border-gray-400"
          : "border-gray-300 hover:border-black"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-zodiak font-semibold">{pizza.name}</div>
          <div className={`text-sm mt-1 ${selected ? "text-white/70" : "text-gray-500"}`}>
            {pizza.description}
          </div>
        </div>
        <div className="font-zodiak font-semibold ml-4 shrink-0">
          €{pizza.price.toFixed(2)}
        </div>
      </div>
    </button>
  )
}