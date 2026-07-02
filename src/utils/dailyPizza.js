import { MENU } from '../data/menu'

export function getDailyPizza() {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return MENU.classics.items[seed % MENU.classics.items.length]
}

export function getTodayKey() {
  const today = new Date()
  return `potd-remaining-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
}
