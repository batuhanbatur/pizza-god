import { useReducer, useEffect } from 'react'
import { pizzaBotReducer, initialState } from './pizzaBotReducer'
import { BOT_LINES } from '../../data/pizzaBotScript'
import { getRecommendation, resolveBuild } from './api'

export const AVATAR = {
  base: '/pizza-bot/god-head-base.svg',
  thinking: '/pizza-bot/god-thinking.svg',
}

export function usePizzaBotFlow(isOpen) {
  const [state, dispatch] = useReducer(pizzaBotReducer, initialState)

  const addBotMessage = (text, avatar = AVATAR.base) =>
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'bot', text, avatar } })
  const addUserMessage = (text) =>
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', text } })

  useEffect(() => {
    if (!isOpen) return
    dispatch({ type: 'RESET' })
    const t = setTimeout(() => {
      addBotMessage(BOT_LINES.party_size.opening, AVATAR.base)
    }, 400)
    return () => clearTimeout(t)
  }, [isOpen])

  const handlePartySizeChip = (chip) => {
    addUserMessage(chip.chatLabel)
    dispatch({ type: 'SET_PARTY_SIZE', payload: chip.value })
    dispatch({ type: 'SET_STEP', payload: 'constraints' })
    dispatch({ type: 'SET_STEPPER', payload: null })
    dispatch({ type: 'SET_PENDING', payload: true })
    const ack = chip.value <= 4
      ? BOT_LINES.party_size.acknowledge[chip.value]
      : BOT_LINES.party_size.acknowledgeMany
    setTimeout(() => {
      addBotMessage(ack, AVATAR.base)
      dispatch({ type: 'SET_PENDING', payload: true })
      setTimeout(() => {
        addBotMessage(BOT_LINES.constraints.opening, AVATAR.base)
      }, 900)
    }, 900)
  }

  const handleConstraintsDone = () => {
    const label = state.allergens.length === 0
      ? BOT_LINES.constraints.noAllergy
      : state.allergens.join(', ')
    addUserMessage(label)
    dispatch({ type: 'SET_CONSTRAINTS', payload: state.allergens })
    dispatch({ type: 'SET_STEP', payload: 'vibe' })
    dispatch({ type: 'SET_PENDING', payload: true })
    const ackText = state.allergens.length > 0 ? BOT_LINES.constraints.acknowledge : BOT_LINES.constraints.acknowledgeNone
    setTimeout(() => {
      addBotMessage(ackText, AVATAR.base)
      dispatch({ type: 'SET_PENDING', payload: true })
      setTimeout(() => {
        addBotMessage(BOT_LINES.vibe.opening, AVATAR.base)
      }, 900)
    }, 900)
  }

  const handleVibeChip = (chip) => {
    addUserMessage(chip.chatLabel)
    dispatch({ type: 'SET_VIBE', payload: chip.value })
    dispatch({ type: 'SET_STEP', payload: 'recommending' })
    dispatch({ type: 'SET_PENDING', payload: true })
    setTimeout(() => {
      addBotMessage(BOT_LINES.vibe.acknowledge[chip.value])
      dispatch({ type: 'SET_PENDING', payload: true })
      setTimeout(() => callPizzaBot(chip.value), 1800)
    }, 900)
  }

  const callPizzaBot = async (vibe) => {
    dispatch({ type: 'SET_PENDING', payload: true })
    dispatch({ type: 'SET_STATUS', payload: 'thinking' })

    try {
      const recommendation = await getRecommendation({
        partySize: state.partySize,
        constraints: state.constraints,
        vibe,
      })

      dispatch({ type: 'SET_RECOMMENDATION', payload: recommendation })
      dispatch({ type: 'SET_STATUS', payload: 'idle' })
      // The verdict lives in the featured card, not a chat bubble — just end the
      // typing indicator directly instead of adding a redundant message.
      dispatch({ type: 'SET_PENDING', payload: false })

    } catch {
      dispatch({ type: 'SET_STATUS', payload: 'error' })
      addBotMessage(BOT_LINES.error) // clears pendingBot via reducer
    }
  }

  // Promotion is local re-arrangement, not a new recommendation — no network call.
  // The promoted alternate's build is re-resolved fresh (never trusted as build-less
  // just because alternates are displayed that way) so safety holds even if a
  // demoted pick (which may carry a real swap) is later re-promoted.
  const handlePromoteAlternate = (index) => {
    const alt = state.recommendation?.alternates[index]
    if (!alt) return
    const resolved = resolveBuild(alt.pizza, state.constraints)
    dispatch({
      type: 'PROMOTE_ALTERNATE',
      payload: {
        index,
        pick: { pizza: alt.pizza, build: resolved.build, effectiveAllergens: resolved.effectiveAllergens },
      },
    })
  }

  return {
    state,
    dispatch,
    handlers: { handlePartySizeChip, handleConstraintsDone, handleVibeChip, handlePromoteAlternate },
    AVATAR,
  }
}
