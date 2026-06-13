import { useOrder } from "../../../context/OrderContext"

const HUNGER_LABELS = {
  light: "Light",
  hungry: "Hungry",
  starving: "Starving",
}

const DIETARY_LABELS = {
  none: "No restrictions",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
}

export default function Step4() {
  const { order } = useOrder()

  const total = order.selectedPizzas.reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-zodiak text-2xl font-semibold">Confirm your order</h2>

      {/* Summary */}
      <div className="flex flex-col gap-4 border border-gray-200 rounded p-4">

        <SummaryRow label="People" value={order.people} />
        <SummaryRow label="Hunger" value={HUNGER_LABELS[order.hungerLevel]} />
        <SummaryRow label="Dietary" value={DIETARY_LABELS[order.dietary]} />

        {order.allergens.length > 0 && (
          <SummaryRow
            label="Allergens"
            value={order.allergens.join(", ")}
          />
        )}

        {order.dislikedIngredients.length > 0 && (
          <SummaryRow
            label="Skipping"
            value={order.dislikedIngredients.join(", ")}
          />
        )}

      </div>

      {/* Selected pizzas */}
      <div className="flex flex-col gap-2">
        <h3 className="font-zodiak font-semibold text-lg">Your pizzas</h3>
        {order.selectedPizzas.length === 0 ? (
          <p className="text-sm text-gray-400">No pizzas selected yet.</p>
        ) : (
          <>
            {order.selectedPizzas.map(pizza => (
              <div key={pizza.id} className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="font-zodiak">{pizza.name}</span>
                <span className="text-gray-500">€{pizza.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-zodiak font-semibold mt-2">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      {/* Confirm button */}
{order.selectedPizzas.length > 0 && (
  <button
    className="w-full py-4 bg-black text-white font-zodiak font-semibold rounded hover:bg-gray-900 transition-colors"
  >
    You're all set
  </button>
)}

    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400 font-zodiak">{label}</span>
      <span className="font-zodiak">{value}</span>
    </div>
  )
}