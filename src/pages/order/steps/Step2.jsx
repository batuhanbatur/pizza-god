import { useOrder } from "../../../context/OrderContext"

const ALLERGENS = [
  "Gluten", "Dairy", "Eggs", "Peanuts",
  "Tree Nuts", "Soy", "Shellfish", "Sesame"
]

const DIETARY = [
  { value: "none", label: "No restrictions" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
]

export default function Step2() {
  const { order, dispatch } = useOrder()

  function toggleAllergen(allergen) {
    const current = order.allergens
    const updated = current.includes(allergen)
      ? current.filter(a => a !== allergen)
      : [...current, allergen]
    dispatch({ type: "SET_ALLERGENS", payload: updated })
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Allergens */}
      <div className="flex flex-col gap-3">
        <h2 className="font-zodiak text-2xl font-semibold">Any allergens?</h2>
        <p className="text-sm text-gray-400">We'll make sure to warn you if a pizza contains these.</p>
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map(item => (
            <button
              key={item}
              onClick={() => toggleAllergen(item)}
              className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                order.allergens.includes(item)
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-gray-300 hover:border-red-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary */}
      <div className="flex flex-col gap-3">
        <h2 className="font-zodiak text-2xl font-semibold">Dietary preference?</h2>
        <div className="flex gap-3">
          {DIETARY.map(option => (
            <button
              key={option.value}
              onClick={() => dispatch({ type: "SET_DIETARY", payload: option.value })}
              className={`flex-1 py-3 px-4 border rounded transition-colors ${
                order.dietary === option.value
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              <div className="font-zodiak font-semibold">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}