// Every localStorage read/write in the app goes through this file so that
// corrupted or unavailable storage can never crash the UI.
export const STORAGE_KEYS = {
  cart: 'nova:cart:v1',
  wishlist: 'nova:wishlist:v1',
  user: 'nova:user:v1',
  users: 'nova:users:v1',
  orders: 'nova:orders:v1',
  reviews: 'nova:reviews:v1',
  theme: 'nova:theme:v1',
  recentSearches: 'nova:recent-searches:v1',
  recentlyViewed: 'nova:recently-viewed:v1',
  addresses: 'nova:addresses:v1',
  preferences: 'nova:preferences:v1',
}

export function readStorage(key, fallback, isValid = () => true) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    if (!isValid(parsed)) throw new Error('Unexpected data shape')
    return parsed
  } catch {
    removeStorage(key)
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); nothing to clean up.
  }
}
