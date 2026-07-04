import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BOT_LINES } from '../../data/pizzaBotScript'
import { useOrder } from '../../context/OrderContext'
import { BALLOONS } from '../pizza-bot/balloons'
import { usePizzaBotFlow } from '../pizza-bot/usePizzaBotFlow'
import PizzaBotBubble from './PizzaBotBubble'
import UserBubble from './UserBubble'

const FONT_MAP = {
  'heavy-metal-queen': 'font-metal-mania',
  'mushroom-samba': 'font-kablammo',
}

// Three staggered dots inside a small balloon
function TypingIndicator({ avatar }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1.25rem' }}>
      <div style={{ position: 'relative', width: 125, height: 125, flexShrink: 0 }}>
        <div style={{
          position: 'absolute', width: 110, height: 110,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          backgroundColor: '#F2E0B6',
        }} />
        <img src={avatar} alt="" style={{ position: 'relative', width: 125, height: 125, borderRadius: '50%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'relative', width: 'fit-content' }}>
        <svg
          viewBox={BALLOONS.s.viewBox}
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          fill="none"
        >
          <path fill="#F2E0B6" stroke="#1a1a1a" strokeWidth="5" strokeLinejoin="round" d={BALLOONS.s.d} />
        </svg>
        <div style={{
          position: 'relative', zIndex: 1,
          padding: '1.25rem 1.5rem 1.75rem 1.5rem',
          display: 'flex', gap: '7px', alignItems: 'center',
        }}>
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#555', display: 'inline-block' }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, delay: i * 0.22, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PizzaBotModal({ isOpen, onClose, onComplete }) {
  const { state, dispatch, handlers, AVATAR } = usePizzaBotFlow(isOpen)
  const { dispatch: orderDispatch } = useOrder()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages.length, state.pendingBot])

  const submitStepper = () => {
    const n = state.stepper
    const chatLabel = n === 4
      ? BOT_LINES.party_size.chips[3].chatLabel
      : BOT_LINES.party_size.chatLabelMany(n)
    handlers.handlePartySizeChip({ value: n, chatLabel })
  }

  const handleAddToCart = () => {
    if (!state.recommendation) return
    state.recommendation.picks.forEach((rec, i) => {
      if (!state.resultSelections[i]) return
      orderDispatch({
        type: 'ADD_TO_CART',
        payload: {
          id: rec.pizza.id,
          name: rec.pizza.name,
          price: rec.pizza.price,
          quantity: rec.quantity,
          dough: rec.modifications.dough || 'regular',
          cheese: rec.modifications.cheese || 'mozzarella',
          extras: {},
          allergens: rec.effectiveAllergens,
        },
      })
    })
    onComplete()
    onClose()
  }

  if (!isOpen) return null

  const footerLabelStyle = {
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    color: '#555',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: '0.75rem',
  }

  const inlineFooterLabelStyle = {
    fontSize: '1.4rem',
    letterSpacing: '0.15em',
    color: '#555',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }

  const chipBtn = {
    background: 'none',
    border: '1px solid #1a1a1a',
    color: '#1a1a1a',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '1rem',
  }

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
        width: '1000px',
        maxWidth: '95vw',
        height: '700px',
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

        {/* MESSAGES AREA: plain chronological transcript, scrolls to bottom on new message */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem 1rem' }}>
          {state.messages.map((msg, i) => (
            <div key={i}>
              {msg.role === 'bot'
                ? <PizzaBotBubble text={msg.text} avatar={msg.avatar} />
                : <UserBubble text={msg.text} />
              }
            </div>
          ))}

          {state.pendingBot && (
            <TypingIndicator avatar={AVATAR.thinking} />
          )}

          {state.step === 'result' && state.recommendation && (
            <div style={{ marginTop: '0.25rem' }}>
              {state.recommendation.picks.map((rec, i) => {
                const nameFont = FONT_MAP[rec.pizza.id] || 'font-zodiak'
                return (
                  <div
                    key={i}
                    onClick={() => dispatch({ type: 'TOGGLE_RESULT_SELECTION', payload: i })}
                    style={{
                      border: `1px solid ${state.resultSelections[i] ? '#1a1a1a' : '#ddd'}`,
                      borderRadius: '3px',
                      padding: '0.75rem 1rem',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      backgroundColor: state.resultSelections[i] ? '#fafafa' : '#fff',
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
                    {(rec.modifications.dough || rec.modifications.cheese) && (
                      <div className="font-zodiak" style={{ fontSize: '0.8rem', color: '#777', fontStyle: 'italic', marginTop: '0.2rem' }}>
                        · {[
                          rec.modifications.dough && `${rec.modifications.dough} dough`,
                          rec.modifications.cheese && `${rec.modifications.cheese} cheese`,
                        ].filter(Boolean).join(' · ')}
                      </div>
                    )}
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
                  marginTop: '0.25rem',
                }}
              >
                Add to cart &amp; go to menu →
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Footer — fixed minHeight keeps layout stable across steps */}
        <div style={{
          minHeight: 140,
          padding: '1rem 1.5rem',
          borderTop: '1px solid #eee',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>

          {state.step === 'party_size' && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
              <span className="font-zodiak" style={inlineFooterLabelStyle}>{BOT_LINES.party_size.footerLabel}</span>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem' }}>
              {BOT_LINES.party_size.chips.slice(0, 3).map(chip => (
                <button
                  key={chip.value}
                  onClick={() => handlers.handlePartySizeChip(chip)}
                  className="font-zodiak"
                  style={{ ...chipBtn, padding: '0.55rem 0', minWidth: 56, fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  {chip.label}
                </button>
              ))}

              {state.stepper === null ? (
                <button
                  onClick={() => dispatch({ type: 'SET_STEPPER', payload: 4 })}
                  className="font-zodiak"
                  style={{ ...chipBtn, padding: '0.55rem 0', minWidth: 56, fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  4+
                </button>
              ) : (
                <>
                  <button
                    onClick={() => dispatch({ type: 'SET_STEPPER', payload: Math.max(4, state.stepper - 1) })}
                    style={{ ...chipBtn, padding: '0.45rem 0.7rem' }}
                  >−</button>
                  <span className="font-zodiak" style={{ minWidth: 28, textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                    {state.stepper}
                  </span>
                  <button
                    onClick={() => dispatch({ type: 'SET_STEPPER', payload: Math.min(10, state.stepper + 1) })}
                    style={{ ...chipBtn, padding: '0.45rem 0.7rem' }}
                  >+</button>
                  <button
                    onClick={submitStepper}
                    className="font-zodiak"
                    style={{ backgroundColor: '#1a1a1a', color: '#fff', border: 'none', padding: '0.45rem 1rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.9rem' }}
                  >→</button>
                </>
              )}
              </div>
            </div>
          )}

          {state.step === 'constraints' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <span className="font-zodiak" style={inlineFooterLabelStyle}>{BOT_LINES.constraints.footerLabel}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem' }}>
                {BOT_LINES.constraints.chips.map(allergen => {
                  const selected = state.allergens.includes(allergen)
                  return (
                    <button
                      key={allergen}
                      onClick={() => dispatch({ type: 'TOGGLE_ALLERGEN', payload: allergen })}
                      className="font-zodiak"
                      style={{
                        background: selected ? '#933C3C' : 'none',
                        border: `1px solid ${selected ? '#933C3C' : '#ccc'}`,
                        color: selected ? '#E6D6E3' : '#555',
                        padding: '0.3rem 0.8rem',
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
              </div>
              <button
                onClick={handlers.handleConstraintsDone}
                className="font-zodiak"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  padding: '0.45rem 1.5rem',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {state.allergens.length > 0 ? 'Next →' : 'No Allergies'}
              </button>
            </div>
          )}

          {state.step === 'vibe' && (
            <>
              <div className="font-zodiak" style={footerLabelStyle}>{BOT_LINES.vibe.footerLabel}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {BOT_LINES.vibe.chips.map(chip => (
                <button
                  key={chip.value}
                  onClick={() => handlers.handleVibeChip(chip)}
                  className="font-zodiak"
                  style={{
                    background: 'none',
                    border: '1px solid #1a1a1a',
                    color: '#1a1a1a',
                    padding: '0.5rem 1rem',
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
            </>
          )}

        </div>
      </div>
    </div>
  )
}
