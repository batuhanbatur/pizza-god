import { useState, useEffect } from 'react'
import logo from '../assets/pizza-god-logo.png'
import logoOrder from '../assets/logo-order.png'
import GraffitiButton from '../components/ui/GraffitiButton'

export default function Landing() {
  const [hoveredButton, setHoveredButton] = useState(null)

  useEffect(() => {
    const img = new Image()
    img.src = logoOrder
  }, [])

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center" style={{ paddingBottom: '8vh' }}>

      <img
        key={hoveredButton}
        src={hoveredButton === 'order' ? logoOrder : logo}
        alt="Pizza God"
        className="w-80"
      />

      <div className="flex items-start gap-0 mt-6">

        <div
          className="flex flex-col items-center gap-3 px-12"
          onMouseEnter={() => setHoveredButton('order')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <GraffitiButton onClick={() => console.log('classic')}>Order Yourself</GraffitiButton>
          <p className="font-zodiak text-white/50 text-sm text-center">
            Classic pizza ordering experience
          </p>
        </div>

        <div className="w-px bg-white/20 self-stretch mt-1" />

        <div className="flex flex-col items-center gap-3 px-12">
          <GraffitiButton onClick={() => console.log('ai')}>AI Powered</GraffitiButton>
          <p className="font-zodiak text-white/50 text-sm text-center">
            Let us help you decide what to eat
          </p>
        </div>

      </div>
    </div>
  )
}