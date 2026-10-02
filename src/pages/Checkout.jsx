import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency } from '../utils/formatters'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'
import styles from './Checkout.module.css'

const steps = ['Contact', 'Address', 'Delivery', 'Payment', 'Review']
const emptyContact = { name: '', email: '', phone: '' }
const emptyAddress = { street: '', city: '', region: '', postalCode: '', country: 'United States' }

export default function Checkout() {
  const cart = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [contact, setContact] = useState({ ...emptyContact, name: user?.name ?? '', email: user?.email ?? '' })
  const [address, setAddress] = useState(emptyAddress)
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('card')
  const [error, setError] = useState('')
  const [savedAddresses] = useState(() => readStorage(STORAGE_KEYS.addresses, [], Array.isArray))
  const lines = cart.items.map((item) => ({ item, product: products.find((product) => product.id === item.productId) })).filter((line) => line.product)
  const unavailable = lines.some((line) => line.product.stock === 0)
  const shipping = cart.shipping + (delivery === 'express' ? 12.95 : 0)
  const total = cart.total + (delivery === 'express' ? 12.95 : 0)

  if (!lines.length) return <Navigate to="/cart" replace />

  function continueStep(event) {
    event.preventDefault()
    setError('')
    setStep((current) => Math.min(steps.length - 1, current + 1))
  }

  function placeOrder() {
    if (unavailable) return setError('Remove unavailable products from your bag before placing the order.')
    const id = 'NV-' + new Date().toISOString().slice(2, 10).replaceAll('-', '') + '-' + globalThis.crypto.randomUUID().slice(0, 8).toUpperCase()
    const previousOrders = readStorage(STORAGE_KEYS.orders, [], Array.isArray)
    const order = {
      id, date: new Date().toISOString(), status: 'Confirmed',
      contact: { ...contact }, shippingAddress: { ...address },
      delivery: { method: delivery, fee: shipping }, paymentMethod: payment,
      items: lines.map(({ item, product }) => ({ key: item.key, productId: product.id, name: product.name, slug: product.slug, image: product.images[0], quantity: item.quantity, color: item.color, size: item.size, unitPrice: product.price, total: product.price * item.quantity })),
      subtotal: cart.subtotal, discount: cart.discount, coupon: cart.coupon?.code ?? null, shipping, tax: cart.tax, total,
    }
    if (!writeStorage(STORAGE_KEYS.orders, [...previousOrders, order])) return setError('We could not save this demo order. Check local storage and try again.')
    cart.clearCart()
    navigate('/order-success/' + id)
  }

  return <section className={`container ${styles.page}`}>
    <div className={styles.pageHeading}><p className={styles.eyebrow}>NOVA CHECKOUT</p><h1>Complete your order</h1><p>Your payment will not be processed. This is a portfolio demo.</p></div>
    <ol className={styles.steps} aria-label="Checkout progress">{steps.map((label, index) => <li className={index === step ? styles.currentStep : index < step ? styles.completedStep : ''} key={label}><span>{index < step ? <Check size={15} /> : index + 1}</span><small>{label}</small></li>)}</ol>
    <div className={styles.layout}><div className={styles.formColumn}><form className={styles.stepPanel} onSubmit={continueStep}>
      {step === 0 && <><p className={styles.stepEyebrow}>STEP 1 OF 5</p><h2>Contact information</h2><p className={styles.stepIntro}>We’ll use this to send your order confirmation.</p><label>Full name<input autoComplete="name" required value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} /></label><label>Email address<input type="email" autoComplete="email" required value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} /></label><label>Phone number<input type="tel" autoComplete="tel" required value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} /></label>{!user && <p className={styles.accountPrompt}>Have an account? <Link to="/login">Sign in</Link> to save your details.</p>}</>}
      {step === 1 && <><p className={styles.stepEyebrow}>STEP 2 OF 5</p><h2>Shipping address</h2><p className={styles.stepIntro}>Where should we send your order?</p>{savedAddresses.length > 0 && <label>Use a saved address<select defaultValue="" onChange={(event) => { const selected = savedAddresses.find((item) => item.id === event.target.value); if (selected) setAddress({ ...address, street: selected.street, city: selected.city, postalCode: selected.postalCode }) }}><option value="">Choose an address</option>{savedAddresses.map((item) => <option key={item.id} value={item.id}>{item.label} — {item.city}</option>)}</select></label>}<label>Street address<input autoComplete="street-address" required value={address.street} onChange={(event) => setAddress({ ...address, street: event.target.value })} /></label><div className={styles.twoColumns}><label>City<input autoComplete="address-level2" required value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} /></label><label>State / region<input autoComplete="address-level1" required value={address.region} onChange={(event) => setAddress({ ...address, region: event.target.value })} /></label></div><div className={styles.twoColumns}><label>Postal code<input autoComplete="postal-code" required value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value })} /></label><label>Country<input autoComplete="country-name" required value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} /></label></div></>}
      {step === 2 && <><p className={styles.stepEyebrow}>STEP 3 OF 5</p><h2>Choose delivery</h2><p className={styles.stepIntro}>Select the delivery speed that works for you.</p><div className={styles.radioOptions}><label><input type="radio" name="delivery" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} /><span><strong>Standard delivery</strong><small>2–5 business days</small></span><b>{cart.shipping ? formatCurrency(cart.shipping) : 'Free'}</b></label><label><input type="radio" name="delivery" checked={delivery === 'express'} onChange={() => setDelivery('express')} /><span><strong>Express delivery</strong><small>1–2 business days</small></span><b>{formatCurrency(cart.shipping + 12.95)}</b></label></div></>}
      {step === 3 && <><p className={styles.stepEyebrow}>STEP 4 OF 5</p><h2>Payment method</h2><p className={styles.stepIntro}>Choose a demo payment option. No payment will be taken.</p><div className={styles.radioOptions}><label><input type="radio" name="payment" checked={payment === 'card'} onChange={() => setPayment('card')} /><span><strong>Credit or debit card</strong><small>Mock card form for demonstration only</small></span></label><label><input type="radio" name="payment" checked={payment === 'paypal'} onChange={() => setPayment('paypal')} /><span><strong>PayPal</strong><small>Simulated checkout, no redirect</small></span></label></div>{payment === 'card' && <div className={styles.cardFields}><label>Name on card<input autoComplete="cc-name" required /></label><label>Card number<input inputMode="numeric" autoComplete="cc-number" placeholder="Do not enter a real card number" required /></label><div className={styles.twoColumns}><label>Expiry date<input autoComplete="cc-exp" placeholder="MM / YY" required /></label><label>Security code<input inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" required /></label></div><p className={styles.cardNote}>Payment is simulated. Card details are not stored or transmitted.</p></div>}</>}
      {step === 4 && <><p className={styles.stepEyebrow}>STEP 5 OF 5</p><h2>Review your order</h2><p className={styles.stepIntro}>Check the details before placing your demo order.</p><div className={styles.reviewBlock}><h3>Contact</h3><p>{contact.name}<br />{contact.email}<br />{contact.phone}</p></div><div className={styles.reviewBlock}><h3>Ship to</h3><p>{address.street}<br />{address.city}, {address.region} {address.postalCode}<br />{address.country}</p></div><div className={styles.reviewBlock}><h3>Delivery and payment</h3><p>{delivery === 'express' ? 'Express delivery' : 'Standard delivery'} · {payment === 'card' ? 'Card (demo)' : 'PayPal (demo)'}</p></div><div className={styles.reviewItems}>{lines.map(({ item, product }) => <div key={item.key}><span>{product.name} × {item.quantity}</span><strong>{formatCurrency(product.price * item.quantity)}</strong></div>)}</div>{unavailable && <p className={styles.error} role="alert">An item in your bag is unavailable. Go back to your bag and remove it.</p>}</>}
      {error && <p className={styles.error} role="alert">{error}</p>}<div className={styles.formActions}>{step > 0 && <button type="button" className="btn btn--secondary" onClick={() => { setError(''); setStep((current) => current - 1) }}><ArrowLeft size={15} /> Back</button>}{step < steps.length - 1 ? <button className="btn btn--primary" type="submit">Continue <ArrowRight size={15} /></button> : <button className="btn btn--primary" type="button" onClick={placeOrder} disabled={unavailable}>Place demo order <ArrowRight size={15} /></button>}</div>
    </form></div>
    <aside className={styles.summary}><h2>Order summary</h2>{lines.map(({ item, product }) => <div className={styles.summaryItem} key={item.key}><img src={product.images[0]} alt="" /><span>{product.name}<small>Qty {item.quantity}</small></span><strong>{formatCurrency(product.price * item.quantity)}</strong></div>)}<dl><div><dt>Subtotal</dt><dd>{formatCurrency(cart.subtotal)}</dd></div>{cart.discount > 0 && <div><dt>Discount</dt><dd>−{formatCurrency(cart.discount)}</dd></div>}<div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</dd></div><div><dt>Estimated tax</dt><dd>{formatCurrency(cart.tax)}</dd></div><div className={styles.total}><dt>Total</dt><dd>{formatCurrency(total)}</dd></div></dl><p className={styles.secure}><LockKeyhole size={14} /> Demo checkout. No charge will be made.</p></aside></div>
  </section>
}
