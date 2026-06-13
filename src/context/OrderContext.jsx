import { createContext, useContext, useReducer } from "react"

const initialState = {
  people: 1,
  hungerLevel: "hungry",
  dislikedIngredients: [],
  allergens: [],
  dietary: "none",
  selectedPizzas: [],
}
function orderReducer(state, action) {
  switch (action.type) {
    case "SET_PEOPLE":
      return { ...state, people: action.payload }
    case "SET_HUNGER":
      return { ...state, hungerLevel: action.payload }
    case "SET_DISLIKED":
      return { ...state, dislikedIngredients: action.payload }
    case "SET_ALLERGENS":
      return { ...state, allergens: action.payload }
    case "SET_PIZZAS":
      return { ...state, selectedPizzas: action.payload }
      case "SET_DIETARY":
  return { ...state, dietary: action.payload }
    default:
      return state
  }
}

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const [order, dispatch] = useReducer(orderReducer, initialState)
  return (
    <OrderContext.Provider value={{ order, dispatch }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  return useContext(OrderContext)
}