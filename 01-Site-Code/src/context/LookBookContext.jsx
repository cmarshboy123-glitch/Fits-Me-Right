import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readStorage, writeStorage } from '../utils/persist'

// The Look Book: looks the shopper puts together from items they have saved, with their own notes on how
// each piece fits and looks on them. It lives only in this browser (localStorage), like the wishlist.
// Nothing here is sent to us or anyone else.
const LOOKBOOK_KEY = 'fits-me-right:lookbook'

// Only what the page needs to show an item again later, so a look keeps working even if the catalog changes.
const snapshot = (product) => ({
  id: product.id,
  name: product.name,
  vendor: product.vendor,
  brand: product.brand,
  price: product.price,
  currency: product.currency,
  imageUrl: product.imageUrl,
  productUrl: product.productUrl,
  verifiedAt: product.verifiedAt,
  category: product.category,
  color: product.color,
  gender: product.gender,
})

const newId = () => `look-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

const LookBookContext = createContext(null)

export function LookBookProvider({ children }) {
  const [looks, setLooks] = useState(() => {
    const saved = readStorage(LOOKBOOK_KEY, [])
    return Array.isArray(saved) ? saved : []
  })

  useEffect(() => { writeStorage(LOOKBOOK_KEY, looks) }, [looks])

  const createLook = useCallback(({ name, occasion }) => {
    const id = newId()
    setLooks((current) => [...current, { id, name: name.trim() || 'Untitled look', occasion: occasion || '', note: '', items: [], createdAt: new Date().toISOString().slice(0, 10) }])
    return id
  }, [])

  const updateLook = useCallback((lookId, patch) => {
    setLooks((current) => current.map((look) => (look.id === lookId ? { ...look, ...patch } : look)))
  }, [])

  const deleteLook = useCallback((lookId) => {
    setLooks((current) => current.filter((look) => look.id !== lookId))
  }, [])

  const addItems = useCallback((lookId, products) => {
    setLooks((current) => current.map((look) => {
      if (look.id !== lookId) return look
      const have = new Set(look.items.map((item) => item.product.id))
      const added = products.filter((product) => !have.has(product.id)).map((product) => ({ product: snapshot(product), size: '', fit: '', rating: 0, note: '' }))
      return { ...look, items: [...look.items, ...added] }
    }))
  }, [])

  const removeItem = useCallback((lookId, productId) => {
    setLooks((current) => current.map((look) => (look.id === lookId ? { ...look, items: look.items.filter((item) => item.product.id !== productId) } : look)))
  }, [])

  const updateItem = useCallback((lookId, productId, patch) => {
    setLooks((current) => current.map((look) => (look.id === lookId
      ? { ...look, items: look.items.map((item) => (item.product.id === productId ? { ...item, ...patch } : item)) }
      : look)))
  }, [])

  const value = useMemo(() => ({ looks, count: looks.length, createLook, updateLook, deleteLook, addItems, removeItem, updateItem }), [looks, createLook, updateLook, deleteLook, addItems, removeItem, updateItem])

  return <LookBookContext.Provider value={value}>{children}</LookBookContext.Provider>
}

export function useLookBook() {
  const context = useContext(LookBookContext)
  if (!context) throw new Error('useLookBook must be used within LookBookProvider')
  return context
}
