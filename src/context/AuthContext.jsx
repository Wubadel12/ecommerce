import { useEffect, useMemo, useReducer } from 'react'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'
import { AuthContext } from './authContext'

function authReducer(state, action) {
  switch (action.type) {
    case 'SIGN_IN': return { ...state, user: action.user }
    case 'UPDATE_PROFILE': return { ...state, user: { ...state.user, ...action.profile } }
    case 'SIGN_OUT': return { ...state, user: null }
    default: return state
  }
}

function isUser(value) {
  return value === null || (value && typeof value.id === 'string' && typeof value.name === 'string' && typeof value.email === 'string')
}

async function hashPassword(password, savedSalt) {
  if (!globalThis.crypto?.subtle) throw new Error('Secure demo sign-in is not available in this browser context.')
  const salt = savedSalt ? Uint8Array.from(savedSalt.match(/.{2}/g), (byte) => Number.parseInt(byte, 16)) : globalThis.crypto.getRandomValues(new Uint8Array(16))
  const key = await globalThis.crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const digest = await globalThis.crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, key, 256)
  const passwordHash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
  const saltHex = Array.from(salt, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return { salt: saltHex, passwordHash }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, undefined, () => ({ user: readStorage(STORAGE_KEYS.user, null, isUser) }))

  useEffect(() => { writeStorage(STORAGE_KEYS.user, state.user) }, [state.user])

  const value = useMemo(() => ({
    user: state.user,
    isAuthenticated: Boolean(state.user),
    async register({ name, email, password }) {
      const normalizedEmail = email.trim().toLowerCase()
      const users = readStorage(STORAGE_KEYS.users, [], Array.isArray)
      if (users.some((account) => account.email === normalizedEmail)) return { ok: false, message: 'An account with this email already exists. Sign in instead.' }
      try {
        const credential = await hashPassword(password)
        const account = { id: globalThis.crypto.randomUUID(), name: name.trim(), email: normalizedEmail, passwordHash: credential.passwordHash, passwordSalt: credential.salt, createdAt: new Date().toISOString() }
        if (!writeStorage(STORAGE_KEYS.users, [...users, account])) return { ok: false, message: 'Local storage is unavailable, so a demo account cannot be saved.' }
        const user = { id: account.id, name: account.name, email: account.email }
        dispatch({ type: 'SIGN_IN', user })
        return { ok: true, user }
      } catch (error) {
        return { ok: false, message: error.message || 'We could not create your demo account.' }
      }
    },
    async login({ email, password }) {
      const normalizedEmail = email.trim().toLowerCase()
      const users = readStorage(STORAGE_KEYS.users, [], Array.isArray)
      const account = users.find((item) => item.email === normalizedEmail)
      if (!account) return { ok: false, message: 'We couldn’t find an account with that email.' }
      try {
        const credential = await hashPassword(password, account.passwordSalt)
        if (account.passwordHash !== credential.passwordHash) return { ok: false, message: 'That password doesn’t match this account.' }
        const user = { id: account.id, name: account.name, email: account.email }
        dispatch({ type: 'SIGN_IN', user })
        return { ok: true, user }
      } catch (error) {
        return { ok: false, message: error.message || 'We could not sign you in.' }
      }
    },
    updateProfile(profile) {
      const updated = { ...state.user, name: profile.name.trim(), email: profile.email.trim().toLowerCase() }
      const users = readStorage(STORAGE_KEYS.users, [], Array.isArray)
      const existing = users.find((account) => account.id === updated.id)
      if (users.some((account) => account.email === updated.email && account.id !== updated.id)) return { ok: false, message: 'That email is already in use.' }
      if (existing) writeStorage(STORAGE_KEYS.users, users.map((account) => account.id === updated.id ? { ...account, name: updated.name, email: updated.email } : account))
      dispatch({ type: 'UPDATE_PROFILE', profile: { name: updated.name, email: updated.email } })
      return { ok: true, message: 'Your profile has been updated.' }
    },
    logout() { dispatch({ type: 'SIGN_OUT' }) },
  }), [state.user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
