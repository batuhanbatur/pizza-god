import logo from '../../assets/pizza-god-logo.png'
import logoOrder from '../../assets/order-yourself.png'
import logoAi from '../../assets/order-ai.png'
import GraffitiButton from '../ui/GraffitiButton'

export default function Hero({ hoveredButton, setHoveredButton, scrollProgress, windowHeight, handleOrderYourself, navVisible }) {
  const currentLogo = hoveredButton === 'order'
    ? logoOrder
    : hoveredButton === 'ai'
    ? logoAi
    : logo

  const logoTopPx = navVisible ? 60 : (windowHeight / 2 - 320) * (1 - scrollProgress) + 60 * scrollProgress
  const logoScale = navVisible ? 0.5 : 1 - scrollProgress * 0.35
  const logoLeft = navVisible ? 'calc(25vw - 150px)' : '50%'
  const logoTranslateX = navVisible ? '0%' : '-50%'

  const slideProgress = Math.min(scrollProgress / 0.4, 1)
  const leftTranslate = -slideProgress * 200
  const rightTranslate = slideProgress * 200

  const buttonOpacity = scrollProgress < 0.4
    ? 1
    : Math.max(0, 1 - (scrollProgress - 0.4) / 0.3)

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
          transformOrigin: 'top left',
          width: '320px',
          zIndex: 50,
          pointerEvents: 'none',
          transition: 'left 0.4s ease',
        }}
      />

      {/* Hero section */}
      <div
        className="flex items-end justify-center overflow-hidden"
        style={{ height: '100vh', paddingBottom: '20vh', backgroundColor: 'black' }}
      >
        <div className="flex items-start gap-0">

          {/* Left button */}
          <div
            className="flex flex-col items-center gap-3 px-12"
            onMouseEnter={() => setHoveredButton('order')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              transform: `translateX(${leftTranslate}px)`,
              opacity: buttonOpacity,
              pointerEvents: buttonOpacity === 0 ? 'none' : 'auto',
            }}
          >
            <GraffitiButton onClick={handleOrderYourself}>Order Yourself</GraffitiButton>
            <p className="font-zodiak text-white/50 text-sm text-center">
              You know what you want.
            </p>
          </div>

          <div
            className="w-px bg-white/20 self-stretch mt-1"
            style={{ opacity: scrollProgress > 0 ? 0 : 1 }}
          />

          {/* Right button */}
          <div
            className="flex flex-col items-center gap-3 px-12"
            onMouseEnter={() => setHoveredButton('ai')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              transform: `translateX(${rightTranslate}px)`,
              opacity: buttonOpacity,
              pointerEvents: buttonOpacity === 0 ? 'none' : 'auto',
            }}
          >
            <GraffitiButton onClick={() => console.log('ai')}>AI Powered</GraffitiButton>
            <p className="font-zodiak text-white/50 text-sm text-center">
              You have no idea what you want.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
