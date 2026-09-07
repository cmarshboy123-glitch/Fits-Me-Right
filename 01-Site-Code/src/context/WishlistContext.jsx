import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readStorage, writeStorage } from '../utils/persist'

const WishlistContext = createContext(null)
const WISHLIST_KEY = 'fits-me-right:wishlist'

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => readStorage(WISHLIST_KEY, []))

  useEffect(() => { writeStorage(WISHLIST_KEY, items) }, [items])

  const isSaved = (id) => items.some((item) => item.id === id)

  const toggle = (product) => {
    setItems((current) => (
      current.some((item) => item.id === product.id)
        ? current.filter((item) => item.id !== product.id)
        : [...current, product]
    ))
  }

  const remove = (id) => setItems((current) => current.filter((item) => item.id !== id))
  const clear = () => setItems([])

  const value = useMemo(() => ({ items, count: items.length, isSaved, toggle, remove, clear }), [items])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}
