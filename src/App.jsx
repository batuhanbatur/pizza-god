import { Routes, Route } from 'react-router-dom'
import { OrderProvider } from './context/OrderContext'
import Landing from './pages/Landing'
import OrderFlow from './pages/order/OrderFlow'

function App() {
  return (
    <OrderProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/order/ai" element={<OrderFlow />} />
      </Routes>
    </OrderProvider>
  )
}

export default App