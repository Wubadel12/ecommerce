import { useState } from 'react'
import { MapPin, Plus, Trash2 } from 'lucide-react'
import { readStorage, STORAGE_KEYS, writeStorage } from '../../utils/storage'
import styles from './AccountPages.module.css'

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState(() => readStorage(STORAGE_KEYS.addresses, [], Array.isArray))
  const [showForm, setShowForm] = useState(addresses.length === 0)
  const [message, setMessage] = useState('')

  function saveAddress(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const entry = { id: globalThis.crypto.randomUUID(), label: form.get('label').trim(), street: form.get('street').trim(), city: form.get('city').trim(), postalCode: form.get('postalCode').trim() }
    const next = [...addresses, entry]
    if (!writeStorage(STORAGE_KEYS.addresses, next)) return setMessage('Local storage is unavailable. The address was not saved.')
    setAddresses(next)
    setShowForm(false)
    setMessage('Address saved on this device.')
    event.currentTarget.reset()
  }

  function removeAddress(id) {
    const next = addresses.filter((address) => address.id !== id)
    writeStorage(STORAGE_KEYS.addresses, next)
    setAddresses(next)
  }

  return <section className={styles.page}><p className={styles.eyebrow}>DELIVERY DETAILS</p><div className={styles.titleRow}><div><h1>Saved addresses</h1><p className={styles.intro}>Manage where your orders should be delivered.</p></div><button className="btn btn--secondary" onClick={() => setShowForm((visible) => !visible)}><Plus size={16} /> Add address</button></div>
    {message && <p className={styles.success} role="status">{message}</p>}
    {showForm && <form className={styles.form} onSubmit={saveAddress}><label htmlFor="address-label">Address label</label><input id="address-label" name="label" placeholder="Home, work..." required /><label htmlFor="address-street">Street address</label><input id="address-street" name="street" autoComplete="street-address" required /><label htmlFor="address-city">City</label><input id="address-city" name="city" autoComplete="address-level2" required /><label htmlFor="address-postal">Postal code</label><input id="address-postal" name="postalCode" autoComplete="postal-code" required /><div className={styles.formActions}><button className="btn btn--primary" type="submit">Save address</button><button className="btn btn--ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button></div></form>}
    {addresses.length > 0 && <div className={styles.addressGrid}>{addresses.map((address) => <article className={styles.addressCard} key={address.id}><div><MapPin size={17} /><strong>{address.label}</strong></div><p>{address.street}<br />{address.city}, {address.postalCode}</p><button onClick={() => removeAddress(address.id)}><Trash2 size={14} /> Remove</button></article>)}</div>}
  </section>
}
