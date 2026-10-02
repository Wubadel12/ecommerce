import { useEffect, useMemo, useReducer } from 'react'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'
import { WishlistContext } from './wishlistContext'

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': return state.includes(action.id) ? state.filter((id) => id !== action.id) : [action.id, ...state]
    case 'REMOVE': return state.filter((id) => id !== action.id)
    case 'CLEAR': return []
    default: return state
  }
}

export function WishlistProvider({ children }) {
  const [items, dispatch] = useReducer(wishlistReducer, undefined, () => readStorage(STORAGE_KEYS.wishlist, [], (value) => Array.isArray(value) && value.every(Number.isInteger)))

  useEffect(() => { writeStorage(STORAGE_KEYS.wishlist, items) }, [items])

  const value = useMemo(() => ({
    items,
    count: items.length,
    isWishlisted: (id) => items.includes(id),
    toggleWishlist: (id) => dispatch({ type: 'TOGGLE', id }),
    removeFromWishlist: (id) => dispatch({ type: 'REMOVE', id }),
    clearWishlist: () => dispatch({ type: 'CLEAR' }),
  }), [items])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
