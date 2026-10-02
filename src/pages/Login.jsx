import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Auth.module.css'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/account" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    const form = new FormData(event.currentTarget)
    const result = await login({ email: form.get('email'), password: form.get('password') })
    setIsSubmitting(false)
    if (!result.ok) return setError(result.message)
    navigate(location.state?.from || '/account', { replace: true })
  }

  return <section className={styles.page}>
    <div className={styles.panel}><p className={styles.eyebrow}>WELCOME BACK</p><h1>Sign in to NOVA</h1><p className={styles.intro}>Access your orders, saved products and account details.</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email address</label><input id="login-email" name="email" type="email" autoComplete="email" required />
        <div className={styles.passwordLabel}><label htmlFor="login-password">Password</label><Link to="/forgot-password">Forgot password?</Link></div><input id="login-password" name="password" type="password" autoComplete="current-password" required />
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className="btn btn--primary btn--lg" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'} <ArrowRight size={16} /></button>
      </form>
      <p className={styles.switch}>New to NOVA? <Link to="/register">Create an account</Link></p>
      <p className={styles.demoNote}>This is a local demo account. No information is sent to a server.</p>
    </div>
  </section>
}
