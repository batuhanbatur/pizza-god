import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'pizza-god-reduce-graffiti'

export const AccessibilityContext = createContext(null)

export function AccessibilityProvider({ children }) {
  const [reduceGraffiti, setReduceGraffiti] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, reduceGraffiti)
  }, [reduceGraffiti])

  return (
    <AccessibilityContext.Provider value={{ reduceGraffiti, setReduceGraffiti }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  return useContext(AccessibilityContext)
}
