import { useOrder } from "../../../context/OrderContext"

const HUNGER_LEVELS = [
  { value: "light", label: "Light", description: "Just a snack" },
  { value: "hungry", label: "Hungry", description: "A proper meal" },
  { value: "starving", label: "Starving", description: "Bring everything" },
]

const DISLIKES = [
  "Tuna", "Pineapple", "Olives", "Anchovies",
  "Mushrooms", "Peppers", "Onions", "Jalapeños"
]

export default function Step1() {
  const { order, dispatch } = useOrder()

  function toggleDislike(ingredient) {
    const current = order.dislikedIngredients
    const updated = current.includes(ingredient)
      ? current.filter(i => i !== ingredient)
      : [...current, ingredient]
    dispatch({ type: "SET_DISLIKED", payload: updated })
  }

  return (
    <div className="flex flex-col gap-8">

      {/* People */}
      <div className="flex flex-col gap-3">
        <h2 className="font-zodiak text-2xl font-semibold">How many people?</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch({ type: "SET_PEOPLE", payload: Math.max(1, order.people - 1) })}
            className="w-10 h-10 border border-gray-300 rounded hover:border-black transition-colors text-xl"
          >
            −
          </button>
          <span className="font-zodiak text-3xl w-8 text-center">{order.people}</span>
          <button
            onClick={() => dispatch({ type: "SET_PEOPLE", payload: Math.min(20, order.people + 1) })}
            className="w-10 h-10 border border-gray-300 rounded hover:border-black transition-colors text-xl"
          >
            +
          </button>
        </div>
      </div>

      {/* Hunger */}
      <div className="flex flex-col gap-3">
        <h2 className="font-zodiak text-2xl font-semibold">How hungry are you?</h2>
        <div className="flex gap-3">
          {HUNGER_LEVELS.map(level => (
            <button
              key={level.value}
              onClick={() => dispatch({ type: "SET_HUNGER", payload: level.value })}
              className={`flex-1 py-3 px-4 border rounded transition-colors text-left ${
                order.hungerLevel === level.value
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              <div className="font-zodiak font-semibold">{level.label}</div>
              <div className="text-sm opacity-60">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Dislikes */}
      <div className="flex flex-col gap-3">
        <h2 className="font-zodiak text-2xl font-semibold">
          Anything you'd rather skip?
          <span className="text-sm font-normal text-gray-400 ml-2">optional</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {DISLIKES.map(item => (
            <button
              key={item}
              onClick={() => toggleDislike(item)}
              className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                order.dislikedIngredients.includes(item)
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}