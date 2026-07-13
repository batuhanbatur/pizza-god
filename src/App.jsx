import { Routes, Route } from 'react-router-dom'
import { OrderProvider } from './context/OrderContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { Analytics } from "@vercel/analytics/react"
import Landing from './pages/Landing'
import OrderFlow from './pages/order/OrderFlow'

function App() {
  return (
    <AccessibilityProvider>
      <OrderProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/order/ai" element={<OrderFlow />} />
        </Routes>
        <Analytics />
      </OrderProvider>
    </AccessibilityProvider>
  )
}

export default App