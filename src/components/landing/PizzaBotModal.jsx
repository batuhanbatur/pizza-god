import { useReducer, useEffect, useRef, useState } from 'react'
import { pizzaBotReducer, initialState } from './pizzaBotReducer'
import { BOT_LINES } from '../../data/pizzaBotScript'
import { MENU } from '../../data/menu'
import { useOrder } from '../../context/OrderContext'
import PizzaBotBubble from './PizzaBotBubble'
import UserBubble from './UserBubble'

const FONT_MAP = {
  'heavy-metal-queen': 'font-metal-mania',
  'mushroom-samba': 'font-kablammo',
}

const AVATAR = {
  base: '/pizza-bot/god-head-base.svg',
  thinking: '/pizza-bot/god-thinking.svg',
  allergy1: '/pizza-bot/god-allergy-1.svg',
  allergy2: '/pizza-bot/god-allergy-2.svg',
}

export default function PizzaBotModal({ isOpen, onClose, onComplete }) {
  const [state, dispatch] = useReducer(pizzaBotReducer, initialState)
  const [selectedAllergens, setSelectedAllergens] = useState([])
  const [freeText, setFreeText] = useState('')
  const [avatarSrc, setAvatarSrc] = useState(AVATAR.base)
  const [resultSelections, setResultSelections] = useState({})
  const messagesEndRef = useRef(null)
  const { dispatch: orderDispatch } = useOrder()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages])

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'RESET' })
      setSelectedAllergens([])
      setFreeText('')
      setAvatarSrc(AVATAR.base)
      setResultSelections({})
      setTimeout(() => {
        dispatch({ type: 'ADD_MESSAGE', payload: { role: 'bot', text: BOT_LINES.party_size.opening, avatar: AVATAR.base } })
      }, 400)
    }
  }, [isOpen])

  useEffect(() => {
    if (state.step === 'constraints') {
      setAvatarSrc(AVATAR.allergy1)
      const timer = setTimeout(() => setAvatarSrc(AVATAR.allergy2), 400)
      return () => clearTimeout(timer)
    } else if (state.status === 'thinking') {
      setAvatarSrc(AVATAR.thinking)
    } else {
      setAvatarSrc(AVATAR.base)
    }
  }, [state.step, state.status])

  const addBotMessage = (text, avatar = avatarSrc) => dispatch({ type: 'ADD_MESSAGE', payload: { role: 'bot', text, avatar } })
  const addUserMessage = (text) => dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', text } })

  const handlePartySizeChip = (chip) => {
    addUserMessage(chip.label)
    dispatch({ type: 'SET_PARTY_SIZE', payload: chip.value })
    setTimeout(() => {
      addBotMessage(BOT_LINES.party_size.acknowledge[chip.value])
      setTimeout(() => {
        addBotMessage(BOT_LINES.constraints.opening)
        dispatch({ type: 'SET_STEP', payload: 'constraints' })
      }, 900)
    }, 900)
  }

  const handleConstraintsDone = () => {
    const label = selectedAllergens.length === 0
      ? BOT_LINES.constraints.noAllergy
      : selectedAllergens.join(', ')
    addUserMessage(label)
    dispatch({ type: 'SET_CONSTRAINTS', payload: selectedAllergens })
    setTimeout(() => {
      addBotMessage(BOT_LINES.vibe.opening)
      dispatch({ type: 'SET_STEP', payload: 'vibe' })
    }, 900)
  }

  const handleVibeChip = (chip) => {
    addUserMessage(chip.label)
    dispatch({ type: 'SET_VIBE', payload: chip.value })
    setTimeout(() => {
      addBotMessage(BOT_LINES.vibe.acknowledge[chip.value])
      setTimeout(() => {
        callPizzaBot(chip.value)
      }, 900)
    }, 900)
  }

  const callPizzaBot = async (vibe) => {
    dispatch({ type: 'SET_STATUS', payload: 'thinking' })
    const thinkingLine = BOT_LINES.thinking[Math.floor(Math.random() * BOT_LINES.thinking.length)]
    addBotMessage(thinkingLine)

    try {
      const response = await fetch('/api/pizzabot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partySize: state.partySize,
          constraints: state.constraints,
          vibe,
          menuSummary: MENU.classics.items.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            allergens: p.allergens,
            tags: p.tags,
          })),
        }),
      })

      const parsed = await response.json()

      const enriched = parsed.picks.map(pick => {
        const pizza = MENU.classics.items.find(p => p.id === pick.pizzaId)
        if (!pizza) return null
        const hasWarning = state.constraints.some(c => pizza.allergens.includes(c))
        return { ...pick, pizza, hasWarning }
      }).filter(Boolean)

      const selections = {}
      enriched.forEach((r, i) => { selections[i] = true })
      setResultSelections(selections)

      dispatch({ type: 'SET_RECOMMENDATION', payload: { picks: enriched, voiceLine: parsed.voiceLine } })
      dispatch({ type: 'SET_STATUS', payload: 'idle' })
      addBotMessage(parsed.voiceLine)

    } catch (err) {
      dispatch({ type: 'SET_STATUS', payload: 'error' })
      addBotMessage(BOT_LINES.error)
    }
  }

  const handleAddToCart = () => {
    if (!state.recommendation) return
    state.recommendation.picks.forEach((rec, i) => {
      if (!resultSelections[i]) return
      orderDispatch({
        type: 'ADD_TO_CART',
        payload: {
          id: rec.pizza.id,
          name: rec.pizza.name,
          price: rec.pizza.price,
          quantity: rec.quantity,
          dough: 'regular',
          cheese: 'mozzarella',
          extras: {},
          allergens: rec.pizza.allergens,
        },
      })
    })
    onComplete()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        backgroundColor: '#fff',
        width: '680px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>

        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '16px',
            background: 'none', border: 'none',
            color: '#888', fontSize: '1.4rem', cursor: 'pointer', zIndex: 10,
          }}
        >×</button>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {state.messages.map((msg, i) => (
            msg.role === 'bot'
              ? <PizzaBotBubble key={i} text={msg.text} avatar={msg.avatar} />
              : <UserBubble key={i} text={msg.text} />
          ))}

          {state.step === 'result' && state.recommendation && (
            <div style={{ marginTop: '0.5rem' }}>
              {state.recommendation.picks.map((rec, i) => {
                const nameFont = FONT_MAP[rec.pizza.id] || 'font-zodiak'
                return (
                  <div
                    key={i}
                    onClick={() => setResultSelections(prev => ({ ...prev, [i]: !prev[i] }))}
                    style={{
                      border: `1px solid ${resultSelections[i] ? '#1a1a1a' : '#ddd'}`,
                      borderRadius: '3px',
                      padding: '0.75rem 1rem',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      backgroundColor: resultSelections[i] ? '#fafafa' : '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span className={nameFont} style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                        {rec.pizza.name}
                      </span>
                      <span className="font-zodiak" style={{ fontSize: '0.9rem', color: '#555' }}>
                        ×{rec.quantity} · ${(rec.pizza.price * rec.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="font-zodiak" style={{ fontSize: '0.8rem', color: '#777', fontStyle: 'italic', marginTop: '0.2rem' }}>
                      {rec.reason}
                    </div>
                    {rec.hasWarning && (
                      <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#933C3C' }}>
                        ⚠️ Contains allergens you flagged
                      </div>
                    )}
                  </div>
                )
              })}
              <button
                onClick={handleAddToCart}
                className="font-zodiak"
                style={{
                  width: '100%',
                  backgroundColor: '#39FF14',
                  color: '#000',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              >
                Add to cart &amp; go to menu →
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chips / Input area */}
        {state.step !== 'result' && state.status !== 'thinking' && (
          <div style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid #eee',
            backgroundColor: '#fafafa',
          }}>

            {state.step === 'party_size' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {BOT_LINES.party_size.chips.map(chip => (
                  <button
                    key={chip.value}
                    onClick={() => handlePartySizeChip(chip)}
                    className="font-zodiak"
                    style={{
                      background: 'none',
                      border: '1px solid #1a1a1a',
                      color: '#1a1a1a',
                      padding: '0.6rem 1rem',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {state.step === 'constraints' && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {BOT_LINES.constraints.chips.map(allergen => {
                    const selected = selectedAllergens.includes(allergen)
                    return (
                      <button
                        key={allergen}
                        onClick={() => setSelectedAllergens(prev =>
                          selected ? prev.filter(a => a !== allergen) : [...prev, allergen]
                        )}
                        className="font-zodiak"
                        style={{
                          background: selected ? '#933C3C' : 'none',
                          border: `1px solid ${selected ? '#933C3C' : '#ccc'}`,
                          color: selected ? '#E6D6E3' : '#555',
                          padding: '0.3rem 0.7rem',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        {allergen}
                      </button>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    value={freeText}
                    onChange={e => setFreeText(e.target.value)}
                    placeholder={BOT_LINES.constraints.freeTextPlaceholder}
                    className="font-zodiak"
                    style={{
                      flex: 1,
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      padding: '0.4rem 0.7rem',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleConstraintsDone}
                    className="font-zodiak"
                    style={{
                      backgroundColor: '#1a1a1a',
                      color: '#fff',
                      border: 'none',
                      padding: '0.4rem 1rem',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    {selectedAllergens.length === 0 && !freeText ? BOT_LINES.constraints.noAllergy : 'Next →'}
                  </button>
                </div>
              </div>
            )}

            {state.step === 'vibe' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {BOT_LINES.vibe.chips.map(chip => (
                  <button
                    key={chip.value}
                    onClick={() => handleVibeChip(chip)}
                    className="font-zodiak"
                    style={{
                      background: 'none',
                      border: '1px solid #1a1a1a',
                      color: '#1a1a1a',
                      padding: '0.6rem 1rem',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
