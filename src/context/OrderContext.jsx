import { createContext, useContext, useReducer } from "react"
import { getDailyPizza, getTodayKey, POTD_DISCOUNT_MULTIPLIER } from "../utils/dailyPizza"

const initialState = {
  people: 1,
  hungerLevel: "hungry",
  dislikedIngredients: [],
  allergens: [],
  dietary: "none",
  selectedPizzas: [],
  cartItems: [],
  deliveryMethod: 'delivery',
  customerInfo: { name: '', address: '' },
  potdRemaining: 20,
}

function getInitialPotdRemaining() {
  const stored = localStorage.getItem(getTodayKey())
  return stored !== null ? parseInt(stored) : 20
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

    case "ADD_TO_CART": {
      const isTodaysPotd = action.payload.id === getDailyPizza().id
      const existingPotdLine = state.cartItems.find(
        (item) => item.id === action.payload.id && item.isPotd
      )

      // Today's PotD, not yet in the cart: routes to its own discounted, singleton line.
      if (isTodaysPotd && !existingPotdLine) {
        return {
          ...state,
          cartItems: [
            ...state.cartItems,
            {
              ...action.payload,
              price: +(action.payload.price * POTD_DISCOUNT_MULTIPLIER).toFixed(2),
              isPotd: true,
              quantity: 1,
            },
          ],
        }
      }

      // Otherwise (not today's PotD, or today's PotD already has its one discounted
      // line): regular full-price line. This is the fix for the vanishing-add bug —
      // re-adding today's PotD used to silently no-op instead of adding a full-price copy.
      const existing = state.cartItems.find(
        (item) =>
          item.id === action.payload.id &&
          !item.isPotd &&
          item.dough === action.payload.dough &&
          item.cheese === action.payload.cheese &&
          JSON.stringify(item.extras ?? {}) === JSON.stringify(action.payload.extras ?? {})
      )
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, isPotd: false, quantity: 1 }],
      }
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((_, i) => i !== action.payload),
      }

    case "UPDATE_QUANTITY": {
      const { index, quantity } = action.payload
      if (quantity < 1) {
        return {
          ...state,
          cartItems: state.cartItems.filter((_, i) => i !== index),
        }
      }
      // Invariant, regardless of which UI path calls this: a discounted PotD line's
      // quantity can never exceed 1 — clamp rather than trust the caller.
      const target = state.cartItems[index]
      const clampedQuantity = target?.isPotd ? Math.min(quantity, 1) : quantity
      return {
        ...state,
        cartItems: state.cartItems.map((item, i) =>
          i === index ? { ...item, quantity: clampedQuantity } : item
        ),
      }
    }

    case "UPDATE_ITEM_EXTRA_QUANTITY": {
      const { index, extraId, quantity } = action.payload
      return {
        ...state,
        cartItems: state.cartItems.map((item, i) => {
          if (i !== index) return item
          const extras = { ...item.extras }
          if (quantity <= 0) {
            delete extras[extraId]
          } else {
            extras[extraId] = Math.min(5, quantity)
          }
          return { ...item, extras }
        }),
      }
    }

    case "CLEAR_CART":
      return { ...state, cartItems: [] }

    case "COMPLETE_ORDER": {
      const potdItem = state.cartItems.find((item) => item.isPotd)
      if (!potdItem) return state
      const newRemaining = Math.max(0, state.potdRemaining - potdItem.quantity)
      localStorage.setItem(getTodayKey(), newRemaining)
      return { ...state, potdRemaining: newRemaining }
    }

    case 'SET_DELIVERY_METHOD': return { ...state, deliveryMethod: action.payload }
    case 'SET_CUSTOMER_INFO': return { ...state, customerInfo: { ...state.customerInfo, ...action.payload } }
    case 'SET_CART_ITEMS':
  return { ...state, cartItems: action.payload }

    default:
      return state
  }
}

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const [order, dispatch] = useReducer(orderReducer, initialState, (init) => ({
    ...init,
    potdRemaining: getInitialPotdRemaining(),
  }))

  const addItem = (item) => dispatch({ type: 'ADD_TO_CART', payload: item })
  const removeItem = (index) => dispatch({ type: 'REMOVE_FROM_CART', payload: index })
  const updateQuantity = (index, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } })
  const updateItemExtraQuantity = (index, extraId, quantity) => dispatch({ type: 'UPDATE_ITEM_EXTRA_QUANTITY', payload: { index, extraId, quantity } })
  const completeOrder = () => dispatch({ type: 'COMPLETE_ORDER' })

  return (
    <OrderContext.Provider value={{ order, dispatch, addItem, removeItem, updateQuantity, updateItemExtraQuantity, completeOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  return useContext(OrderContext)
}