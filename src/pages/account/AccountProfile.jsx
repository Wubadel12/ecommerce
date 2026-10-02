import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import styles from './AccountPages.module.css'

export default function AccountProfile() {
  const { user, updateProfile } = useAuth()
  const [message, setMessage] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setMessage(updateProfile({ name: form.get('name'), email: form.get('email') }))
  }

  return <section className={styles.page}><p className={styles.eyebrow}>PERSONAL INFORMATION</p><h1>Your profile</h1><p className={styles.intro}>Keep your contact details up to date.</p>
    <form className={styles.form} onSubmit={handleSubmit}><label htmlFor="profile-name">Full name</label><input id="profile-name" name="name" defaultValue={user.name} minLength="2" required /><label htmlFor="profile-email">Email address</label><input id="profile-email" name="email" type="email" defaultValue={user.email} required />{message && <p className={message.ok ? styles.success : styles.error} role="status">{message.message}</p>}<button className="btn btn--primary" type="submit">Save changes</button></form>
    <p className={styles.helper}>This demo updates the account stored in this browser only.</p>
  </section>
}
