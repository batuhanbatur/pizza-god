import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useOrder } from '../../context/OrderContext'
import { BALLOONS } from './balloons'
import { usePizzaBotFlow } from './usePizzaBotFlow'
import { ResultCards, AddToCartButton } from './ResultCards'
import PartySizeChips from './steps/PartySizeChips'
import AllergenChips from './steps/AllergenChips'
import VibeChips from './steps/VibeChips'
import PizzaBotBubble from './PizzaBotBubble'
import UserBubble from './UserBubble'
import useIsMobile from '../../hooks/useIsMobile'

// Three staggered dots inside a small balloon
function TypingIndicator({ avatar }) {
  const isMobile = useIsMobile()
  const avatarSize = 125
  const backdropSize = 110
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '6px' : '12px', marginBottom: '1.25rem' }}>
      <div style={{ position: 'relative', width: avatarSize, height: avatarSize, flexShrink: 0 }}>
        <div style={{
          position: 'absolute', width: backdropSize, height: backdropSize,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          backgroundColor: '#F2E0B6',
        }} />
        <img src={avatar} alt="" style={{ position: 'relative', width: avatarSize, height: avatarSize, borderRadius: '50%', objectFit: 'cover' }} />
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
  const isMobile = useIsMobile()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages.length, state.pendingBot])

  const handleAddToCart = () => {
    if (!state.recommendation) return
    const { pick } = state.recommendation
    orderDispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: pick.pizza.id,
        name: pick.pizza.name,
        price: pick.pizza.price,
        // Per the api/pizzabot.js prompt contract, the model omits a build key
        // entirely when it means regular dough / mozzarella — these fallbacks
        // decode that contract, they are not guesses at a missing value.
        dough: pick.build?.dough || 'regular',
        cheese: pick.build?.cheese || 'mozzarella',
        extras: {},
        allergens: pick.effectiveAllergens,
      },
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
        backgroundColor: '#F2E0B6',
        width: isMobile ? '100vw' : '1000px',
        maxWidth: isMobile ? '100vw' : '95vw',
        height: isMobile ? '100dvh' : '700px',
        maxHeight: isMobile ? '100dvh' : '90vh',
        borderRadius: isMobile ? 0 : '4px',
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

        {/* MESSAGES AREA: plain chronological transcript, scrolls to bottom on new message.
            backgroundColor set explicitly (not inherited from the shell) — a scroll
            container with no paint of its own can flash the browser's default white
            canvas during mobile Safari's rubber-band overscroll. */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#F2E0B6',
          paddingTop: isMobile ? '20px' : '1.25rem',
          paddingBottom: isMobile ? '20px' : '1rem',
          paddingRight: isMobile ? '20px' : '1.5rem',
          paddingLeft: isMobile ? '10px' : '1.5rem',
        }}>
          {state.messages.map((msg, i) => (
            <div key={i}>
              {msg.role === 'bot' ? <PizzaBotBubble text={msg.text} avatar={msg.avatar} />
                : msg.role === 'note' ? (
                  <div className="font-zodiak" style={{ fontSize: '0.8rem', color: '#777', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                    {msg.text}
                  </div>
                )
                : <UserBubble text={msg.text} />
              }
            </div>
          ))}

          {state.pendingBot && (
            <TypingIndicator avatar={AVATAR.thinking} />
          )}

          {state.step === 'result' && state.recommendation && (
            <ResultCards recommendation={state.recommendation} onPromote={handlers.handlePromoteAlternate} />
          )}

          <div ref={bottomRef} />
        </div>

        {/* Footer — fixed minHeight keeps layout stable across steps */}
        <div style={{
          minHeight: 140,
          padding: isMobile ? '20px' : '1rem 1.5rem',
          borderTop: '1px solid #C2A572',
          backgroundColor: '#E8D7A3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>

          {state.step === 'party_size' && (
            <PartySizeChips
              stepper={state.stepper}
              dispatch={dispatch}
              onPartySizeChip={handlers.handlePartySizeChip}
            />
          )}

          {state.step === 'constraints' && (
            <AllergenChips
              allergens={state.allergens}
              dispatch={dispatch}
              onConstraintsDone={handlers.handleConstraintsDone}
            />
          )}

          {state.step === 'vibe' && (
            <VibeChips onVibeChip={handlers.handleVibeChip} />
          )}

          {state.step === 'result' && (
            <AddToCartButton onAddToCart={handleAddToCart} />
          )}

        </div>
      </div>
    </div>
  )
}
