import { Routes, Route } from 'react-router-dom'
import { OrderProvider } from './context/OrderContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
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
      </OrderProvider>
    </AccessibilityProvider>
  )
}

export default App