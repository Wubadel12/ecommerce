import { useState } from 'react'
import { readStorage, STORAGE_KEYS, writeStorage } from '../../utils/storage'
import styles from './AccountPages.module.css'

export default function AccountSettings() {
  const [preferences, setPreferences] = useState(() => readStorage(STORAGE_KEYS.preferences, { productUpdates: false }, (value) => value && typeof value.productUpdates === 'boolean'))
  const [saved, setSaved] = useState(false)

  function toggleUpdates(event) {
    const next = { ...preferences, productUpdates: event.target.checked }
    setPreferences(next)
    setSaved(writeStorage(STORAGE_KEYS.preferences, next))
  }

  return <section className={styles.page}><p className={styles.eyebrow}>YOUR PREFERENCES</p><h1>Account settings</h1><p className={styles.intro}>Choose how NOVA can keep in touch.</p><div className={styles.settingRow}><div><strong>Product updates and offers</strong><p>Receive occasional news about new collections and selected offers.</p></div><input type="checkbox" checked={preferences.productUpdates} onChange={toggleUpdates} aria-label="Receive product updates and offers" /></div>{saved && <p className={styles.success} role="status">Preference saved on this device.</p>}<p className={styles.helper}>Email notifications are not sent in this demo.</p></section>
}
