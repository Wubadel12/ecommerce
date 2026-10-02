import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './Auth.module.css'

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)

  return <section className={styles.page}><div className={styles.panel}><p className={styles.eyebrow}>ACCOUNT SUPPORT</p><h1>Reset your password</h1><p className={styles.intro}>Enter the email associated with your account.</p>{submitted ? <p className={styles.demoNote} role="status">Password reset is not connected in this frontend demo. No email was sent.</p> : <form className={styles.form} onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}><label htmlFor="reset-email">Email address</label><input id="reset-email" name="email" type="email" autoComplete="email" required /><button className="btn btn--primary btn--lg" type="submit">Continue <ArrowRight size={16} /></button></form>}<Link className={styles.backLink} to="/login"><ArrowLeft size={15} /> Back to sign in</Link></div></section>
}
