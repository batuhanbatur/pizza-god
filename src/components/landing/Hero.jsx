import { useState, useEffect, useRef } from 'react'
import logo from '../../assets/pizza-god-logo.webp'
import logoOrder from '../../assets/order-yourself.webp'
import logoAi from '../../assets/order-ai.webp'
import GraffitiButton from '../ui/GraffitiButton'
import PizzaBotModal from '../pizza-bot/PizzaBotModal'
import useIsMobile from '../../hooks/useIsMobile'

const MOBILE_LOGO_END_SCALE = 0.4
const MOBILE_LOGO_BASE_SCALE = 0.55

// Mobile "connected group" composition — logo + both buttons read as one cluster.
const LOGO_WIDTH_PX = 320 // matches the <img> width
const LOGO_ASPECT_RATIO = 1319 / 1024 // natural pizza-god-logo image proportions (height/width)
const MOBILE_BUTTON_BLOCK_HEIGHT_PX = 100 // GraffitiButton (68px) + gap-3 (12px) + caption line-height (~20px)
const MOBILE_GAP_LOGO_TO_BUTTON1 = 50 // logo bottom edge -> first button, within the requested 40-60px
const MOBILE_GAP_BUTTON1_TO_BUTTON2 = 28 // first button -> second button, within the requested 24-32px
const MOBILE_GROUP_CENTER_FRACTION = 0.45 // group's vertical center sits at 45% of viewport height

// Mobile one-time hover auto-play (mobile users never trigger a real hover).
const MOBILE_AUTOPLAY_START_DELAY_MS = 1000 // wait after mount before Order Yourself auto-plays
const MOBILE_AUTOPLAY_REVEAL_MS = 1200 // matches GraffitiButton's marker-text reveal transition
const MOBILE_AUTOPLAY_HOLD_MS = 700 // how long the revealed marker text stays visible before reverting
const MOBILE_AUTOPLAY_GAP_MS = 1000 // pause after Order Yourself's cycle finishes before AI Powered starts

export default function Hero({ hoveredButton, setHoveredButton, scrollProgress, windowHeight, handleOrderYourself, navVisible }) {
  const [modalOpen, setModalOpen] = useState(false)
  const isMobile = useIsMobile()

  const [orderAutoHover, setOrderAutoHover] = useState(false)
  const [aiAutoHover, setAiAutoHover] = useState(false)
  const hasAutoPlayedRef = useRef(false)

  useEffect(() => {
    if (!isMobile || hasAutoPlayedRef.current) return

    let orderRevertTimer, aiStartTimer, aiRevertTimer
    const startTimer = setTimeout(() => {
      if (window.scrollY > 0) return // user already scrolled — skip the whole sequence

      hasAutoPlayedRef.current = true
      setOrderAutoHover(true)
      setHoveredButton('order')
      orderRevertTimer = setTimeout(() => {
        setOrderAutoHover(false)
        setHoveredButton(null)

        aiStartTimer = setTimeout(() => {
          setAiAutoHover(true)
          setHoveredButton('ai')
          aiRevertTimer = setTimeout(() => {
            setAiAutoHover(false)
            setHoveredButton(null)
          }, MOBILE_AUTOPLAY_REVEAL_MS + MOBILE_AUTOPLAY_HOLD_MS)
        }, MOBILE_AUTOPLAY_GAP_MS)
      }, MOBILE_AUTOPLAY_REVEAL_MS + MOBILE_AUTOPLAY_HOLD_MS)
    }, MOBILE_AUTOPLAY_START_DELAY_MS)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(orderRevertTimer)
      clearTimeout(aiStartTimer)
      clearTimeout(aiRevertTimer)
    }
  }, [isMobile, setHoveredButton])
  const currentLogo = hoveredButton === 'order'
    ? logoOrder
    : hoveredButton === 'ai'
    ? logoAi
    : logo

  // Desktop logo: interpolates toward top-left, snaps to top:10/left:30px/scale:0.5 once navVisible.
  const logoTopPxDesktop = navVisible ? 10 : (windowHeight / 2 - 320) * (1 - scrollProgress) + 60 * scrollProgress
  const logoScaleDesktop = navVisible ? 0.5 : 1 - scrollProgress * 0.35
  const logoLeftDesktop = navVisible ? '30px' : '50%'
  const logoTranslateXDesktop = navVisible ? '0%' : '-50%'

  // Mobile group layout: logo + button 1 + button 2 stacked with fixed gaps, the
  // whole cluster's vertical center resting at MOBILE_GROUP_CENTER_FRACTION of the
  // viewport height. Uses the logo's initial (scrollProgress 0) scale, since this is
  // the group's *resting* composition, not a per-frame scroll value.
  const logoHeightMobileInitial = LOGO_WIDTH_PX * LOGO_ASPECT_RATIO * MOBILE_LOGO_BASE_SCALE
  const mobileGroupHeight =
    logoHeightMobileInitial +
    MOBILE_GAP_LOGO_TO_BUTTON1 +
    MOBILE_BUTTON_BLOCK_HEIGHT_PX +
    MOBILE_GAP_BUTTON1_TO_BUTTON2 +
    MOBILE_BUTTON_BLOCK_HEIGHT_PX
  const mobileGroupTop = windowHeight * MOBILE_GROUP_CENTER_FRACTION - mobileGroupHeight / 2

  const logoInitialTopMobile = mobileGroupTop
  const orderButtonTopMobile = mobileGroupTop + logoHeightMobileInitial + MOBILE_GAP_LOGO_TO_BUTTON1
  const aiButtonTopMobile = orderButtonTopMobile + MOBILE_BUTTON_BLOCK_HEIGHT_PX + MOBILE_GAP_BUTTON1_TO_BUTTON2

  // Mobile logo: same scroll-interpolation shape as desktop (toward the top:10px
  // end state), just starting from the group-derived resting position above
  // instead of desktop's (windowHeight/2 - 320). Stays horizontally centered
  // throughout (left/translateX never switch), and scales across a smaller range
  // so it fits comfortably on a ~393px viewport.
  const logoTopPxMobile = navVisible ? 10 : logoInitialTopMobile * (1 - scrollProgress) + 60 * scrollProgress
  const logoScaleMobile = navVisible
    ? MOBILE_LOGO_END_SCALE
    : MOBILE_LOGO_BASE_SCALE - scrollProgress * (MOBILE_LOGO_BASE_SCALE - MOBILE_LOGO_END_SCALE)

  const logoTopPx = isMobile ? logoTopPxMobile : logoTopPxDesktop
  const logoScale = isMobile ? logoScaleMobile : logoScaleDesktop
  const logoLeft = isMobile ? '50%' : logoLeftDesktop
  const logoTranslateX = isMobile ? '-50%' : logoTranslateXDesktop

  const slideProgress = Math.min(scrollProgress / 0.4, 1)

  // Desktop: buttons sit side by side, slide apart horizontally by a fixed 200px.
  const leftTranslateDesktop = -slideProgress * 200
  const rightTranslateDesktop = slideProgress * 200

  // Mobile: buttons stack vertically at their fixed resting tops above. Top one
  // exits right, bottom one exits left, far enough (a full viewport width) to
  // fully clear the screen edge. Only the exit slide is scroll-driven — the
  // resting position itself is a constant, not reinterpolated per frame.
  const viewportWidth = window.innerWidth
  const topButtonTranslateMobile = slideProgress * viewportWidth
  const bottomButtonTranslateMobile = -slideProgress * viewportWidth

  const orderButtonTranslate = isMobile ? topButtonTranslateMobile : leftTranslateDesktop
  const aiButtonTranslate = isMobile ? bottomButtonTranslateMobile : rightTranslateDesktop

  // Mobile buttons are horizontally centered via left:50% + translateX(-50%), same
  // trick as the logo — but with no scale() involved here, so no origin mismatch.
  const orderButtonTransform = isMobile
    ? `translateX(-50%) translateX(${orderButtonTranslate}px)`
    : `translateX(${orderButtonTranslate}px)`
  const aiButtonTransform = isMobile
    ? `translateX(-50%) translateX(${aiButtonTranslate}px)`
    : `translateX(${aiButtonTranslate}px)`

  const buttonOpacity = scrollProgress < 0.4
    ? 1
    : Math.max(0, 1 - (scrollProgress - 0.4) / 0.3)

  // Mobile logo: stays fully opaque until 90% of the way to where navVisible
  // flips (i.e. where the hamburger/cart icons appear), then fades quickly over
  // the last 10%, reaching 0 exactly at that point. Note this "100%" is NOT
  // scrollProgress reaching 1 — navVisible flips at scrollY >= innerHeight - 1,
  // which is scrollProgress ≈ 1/1.2 (since scrollProgress = scrollY / (innerHeight
  // * 1.2)) — using scrollProgress 0.9-1.0 directly would fade the logo well
  // after the icons already appeared. Position/scale interpolation is untouched.
  const NAV_VISIBLE_PROGRESS = 1 / 1.2
  const logoFadeStartMobile = NAV_VISIBLE_PROGRESS * 0.9
  const logoOpacityMobile = scrollProgress < logoFadeStartMobile
    ? 1
    : Math.max(0, 1 - (scrollProgress - logoFadeStartMobile) / (NAV_VISIBLE_PROGRESS - logoFadeStartMobile))

  return (
    <>
      {/* Fixed logo */}
      <img
        src={currentLogo}
        alt="Pizza God"
        style={{
          position: 'fixed',
          top: `${logoTopPx}px`,
          left: logoLeft,
          transform: `translateX(${logoTranslateX}) scale(${logoScale})`,
          transformOrigin: isMobile ? 'top center' : 'top left',
          width: '320px',
          zIndex: 50,
          pointerEvents: 'none',
          // Mobile: stays fully opaque until late in the scroll, then fades quickly
          // (see logoOpacityMobile) — never persists fixed at the top afterward.
          // Desktop keeps its permanent top-left corner logo (opacity always 1).
          opacity: isMobile ? logoOpacityMobile : 1,
          transition: 'left 0.4s ease',
        }}
      />

      {/* Hero section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'hidden',
          height: '100vh',
          paddingBottom: '20vh',
          backgroundColor: 'black',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: 0,
        }}>

          {/* Order Yourself button */}
          <div
            onMouseEnter={() => setHoveredButton('order')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              paddingLeft: '3rem',
              paddingRight: '3rem',
              position: isMobile ? 'fixed' : undefined,
              top: isMobile ? `${orderButtonTopMobile}px` : undefined,
              left: isMobile ? '50%' : undefined,
              transform: orderButtonTransform,
              opacity: buttonOpacity,
              pointerEvents: buttonOpacity === 0 ? 'none' : 'auto',
            }}
          >
            <GraffitiButton onClick={handleOrderYourself} forceHover={orderAutoHover}>Order Yourself</GraffitiButton>
            <p className="font-zodiak" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: '1.25rem', textAlign: 'center' }}>
              You choose.
            </p>
          </div>

          {!isMobile && (
            <div
              style={{
                width: '1px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignSelf: 'stretch',
                marginTop: '0.25rem',
                opacity: scrollProgress > 0 ? 0 : 1,
              }}
            />
          )}

          {/* AI Powered button */}
          <div
            onMouseEnter={() => setHoveredButton('ai')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              paddingLeft: '3rem',
              paddingRight: '3rem',
              position: isMobile ? 'fixed' : undefined,
              top: isMobile ? `${aiButtonTopMobile}px` : undefined,
              left: isMobile ? '50%' : undefined,
              transform: aiButtonTransform,
              opacity: buttonOpacity,
              pointerEvents: buttonOpacity === 0 ? 'none' : 'auto',
            }}
          >
            <GraffitiButton onClick={() => setModalOpen(true)} forceHover={aiAutoHover}>AI Powered</GraffitiButton>
            <p className="font-zodiak" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: '1.25rem', textAlign: 'center' }}>
              We suggest.
            </p>
          </div>

        </div>
      </div>
      <PizzaBotModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onComplete={() => {
          setModalOpen(false)
          document.getElementById('pizzas')?.scrollIntoView({ behavior: 'smooth' })
        }}
      />
    </>
  )
}
