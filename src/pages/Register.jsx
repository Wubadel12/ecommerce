import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Auth.module.css'

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/account" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const name = form.get('name')
    const email = form.get('email')
    const password = form.get('password')
    if (password !== form.get('confirmPassword')) return setError('Your passwords do not match.')
    setIsSubmitting(true)
    const result = await register({ name, email, password })
    setIsSubmitting(false)
    if (!result.ok) return setError(result.message)
    navigate('/account', { replace: true })
  }

  return <section className={styles.page}>
    <div className={styles.panel}><p className={styles.eyebrow}>MAKE YOURSELF AT HOME</p><h1>Create your account</h1><p className={styles.intro}>Keep track of orders and save the products you like.</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="register-name">Full name</label><input id="register-name" name="name" type="text" autoComplete="name" minLength="2" required />
        <label htmlFor="register-email">Email address</label><input id="register-email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="register-password">Password</label><input id="register-password" name="password" type="password" autoComplete="new-password" minLength="8" required /><span className={styles.hint}>Use at least 8 characters.</span>
        <label htmlFor="register-confirm">Confirm password</label><input id="register-confirm" name="confirmPassword" type="password" autoComplete="new-password" minLength="8" required />
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className="btn btn--primary btn--lg" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'} <ArrowRight size={16} /></button>
      </form>
      <p className={styles.switch}>Already have an account? <Link to="/login">Sign in</Link></p>
      <p className={styles.demoNote}>Demo only. Account details stay in this browser and are not sent to a server.</p>
    </div>
  </section>
}
