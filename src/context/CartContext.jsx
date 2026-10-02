import { useEffect, useMemo, useReducer } from 'react'
import { CartContext } from './cartContext'
import { products } from '../data/products'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'

const COUPONS = { NOVA10: 0.1, WELCOME15: 0.15 }

function validCart(value) {
  return value && Array.isArray(value.items) && Array.isArray(value.savedForLater)
    && [...value.items, ...value.savedForLater].every((item) => item && typeof item.key === 'string' && Number.isInteger(item.productId) && Number.isInteger(item.quantity) && item.quantity > 0)
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const item = action.payload
      const stock = products.find((product) => product.id === item.productId)?.stock ?? 0
      if (stock < 1) return state
      const existing = state.items.find((entry) => entry.key === item.key)
      return { ...state, items: existing ? state.items.map((entry) => entry.key === item.key ? { ...entry, quantity: Math.min(stock, entry.quantity + item.quantity) } : entry) : [...state.items, { ...item, quantity: Math.min(stock, item.quantity) }] }
    }
    case 'REMOVE_FROM_CART': return { ...state, items: state.items.filter((item) => item.key !== action.payload) }
    case 'INCREASE_QUANTITY': return { ...state, items: state.items.map((item) => {
      if (item.key !== action.payload) return item
      const stock = products.find((product) => product.id === item.productId)?.stock ?? item.quantity
      return { ...item, quantity: stock > 0 ? Math.min(stock, item.quantity + 1) : item.quantity }
    }) }
    case 'DECREASE_QUANTITY': return { ...state, items: state.items.map((item) => item.key === action.payload ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item) }
    case 'UPDATE_QUANTITY': return { ...state, items: state.items.map((item) => item.key === action.payload.key ? { ...item, quantity: Math.max(1, Math.min(products.find((product) => product.id === item.productId)?.stock || 1, action.payload.quantity)) } : item) }
    case 'CLEAR_CART': return { ...state, items: [], coupon: null }
    case 'APPLY_COUPON': return { ...state, coupon: action.payload }
    case 'REMOVE_COUPON': return { ...state, coupon: null }
    case 'SAVE_FOR_LATER': {
      const item = state.items.find((entry) => entry.key === action.payload)
      if (!item) return state
      return { ...state, items: state.items.filter((entry) => entry.key !== action.payload), savedForLater: [...state.savedForLater.filter((entry) => entry.key !== item.key), item] }
    }
    case 'MOVE_TO_CART': {
      const item = state.savedForLater.find((entry) => entry.key === action.payload)
      if (!item) return state
      const existing = state.items.find((entry) => entry.key === item.key)
      const stock = products.find((product) => product.id === item.productId)?.stock ?? item.quantity
      return { ...state, savedForLater: state.savedForLater.filter((entry) => entry.key !== item.key), items: existing ? state.items.map((entry) => entry.key === item.key ? { ...entry, quantity: Math.min(stock || entry.quantity, entry.quantity + item.quantity) } : entry) : [...state.items, item] }
    }
    case 'REMOVE_SAVED_ITEM': return { ...state, savedForLater: state.savedForLater.filter((item) => item.key !== action.payload) }
    default: return state
  }
}

function createItemKey(productId, color, size) {
  return [productId, color ?? '', size ?? ''].join(':')
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => readStorage(STORAGE_KEYS.cart, { items: [], savedForLater: [], coupon: null }, validCart))

  useEffect(() => { writeStorage(STORAGE_KEYS.cart, state) }, [state])

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.price ?? 0) * item.quantity, 0)
    const discount = state.coupon ? Math.round(subtotal * state.coupon.rate * 100) / 100 : 0
    const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8.95
    const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100
    const total = subtotal - discount + shipping + tax
    const itemCount = state.items.reduce((count, item) => count + item.quantity, 0)

    return {
      ...state,
      subtotal, discount, shipping, tax, total, itemCount,
      addToCart(product, quantity = 1, variant = {}) {
        dispatch({ type: 'ADD_TO_CART', payload: { key: createItemKey(product.id, variant.color, variant.size), productId: product.id, quantity, color: variant.color ?? null, size: variant.size ?? null } })
      },
      removeFromCart(key) { dispatch({ type: 'REMOVE_FROM_CART', payload: key }) },
      increaseQuantity(key) { dispatch({ type: 'INCREASE_QUANTITY', payload: key }) },
      decreaseQuantity(key) { dispatch({ type: 'DECREASE_QUANTITY', payload: key }) },
      updateQuantity(key, quantity) { dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } }) },
      clearCart() { dispatch({ type: 'CLEAR_CART' }) },
      applyCoupon(code) {
        const normalized = code.trim().toUpperCase()
        if (!COUPONS[normalized]) return { ok: false, message: 'That code is not valid. Try NOVA10 or WELCOME15.' }
        dispatch({ type: 'APPLY_COUPON', payload: { code: normalized, rate: COUPONS[normalized] } })
        return { ok: true, message: `${normalized} applied to your order.` }
      },
      removeCoupon() { dispatch({ type: 'REMOVE_COUPON' }) },
      saveForLater(key) { dispatch({ type: 'SAVE_FOR_LATER', payload: key }) },
      moveToCart(key) { dispatch({ type: 'MOVE_TO_CART', payload: key }) },
      removeSavedItem(key) { dispatch({ type: 'REMOVE_SAVED_ITEM', payload: key }) },
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

