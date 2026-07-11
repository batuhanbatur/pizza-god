export const initialState = {
  step: 'party_size',
  partySize: null,
  constraints: [],
  vibe: null,
  messages: [],
  recommendation: null,
  status: 'idle',
  allergens: [],
  stepper: null,
  pendingBot: false,
  escalatedForBot: null,
}

export function pizzaBotReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        // Bot messages end the pending window; user messages don't
        pendingBot: action.payload.role === 'bot' ? false : state.pendingBot,
      }
    case 'SET_PENDING':
      return { ...state, pendingBot: action.payload }
    case 'SET_PARTY_SIZE':
      return { ...state, partySize: action.payload }
    case 'SET_CONSTRAINTS':
      return { ...state, constraints: action.payload }
    case 'SET_VIBE':
      return { ...state, vibe: action.payload }
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'SET_STATUS':
      return { ...state, status: action.payload }
    case 'SET_RECOMMENDATION':
      return { ...state, recommendation: action.payload, step: 'result' }
    case 'PROMOTE_ALTERNATE': {
      if (!state.recommendation) return state
      const { index, pick } = action.payload
      const { recommendation } = state
      const remaining = recommendation.alternates.filter((_, i) => i !== index)
      return {
        ...state,
        recommendation: {
          ...recommendation,
          pick,
          alternates: [...remaining, { pizza: recommendation.pick.pizza }],
          verdict: 'Fine. Your call.',
        },
      }
    }
    case 'SET_ALLERGENS':
      return { ...state, allergens: action.payload }
    case 'TOGGLE_ALLERGEN': {
      const a = action.payload
      const has = state.allergens.includes(a)
      return { ...state, allergens: has ? state.allergens.filter(x => x !== a) : [...state.allergens, a] }
    }
    case 'SET_STEPPER':
      return { ...state, stepper: action.payload }
    case 'SET_ESCALATED':
      return { ...state, escalatedForBot: action.payload }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}
