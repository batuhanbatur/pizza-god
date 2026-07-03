export const initialState = {
  step: 'party_size',
  partySize: null,
  constraints: [],
  vibe: null,
  messages: [],
  recommendation: null,
  status: 'idle',
}

export function pizzaBotReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
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
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}
