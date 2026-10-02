import { useState } from 'react'
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { formatCurrency } from '../utils/formatters'
import { useCart } from '../hooks/useCart'
import styles from './Cart.module.css'

function CartLine({ item, product, saved = false, cart }) {
  if (!product) return null
  return (
    <article className={styles.lineItem}>
      <Link to={`/product/${product.slug}`} className={styles.itemImage}><img src={product.images[0]} alt={product.name} /></Link>
      <div className={styles.itemDetails}><p className={styles.brand}>{product.brand}</p><Link to={`/product/${product.slug}`} className={styles.itemName}>{product.name}</Link>{(item.color || item.size) && <p className={styles.variant}>{[item.color, item.size].filter(Boolean).join(' / ')}</p>}<p className={product.stock > 0 ? styles.stock : styles.stockOut}>{product.stock > 0 ? 'In stock' : 'Currently unavailable'}</p><div className={styles.itemActions}>{saved ? <button onClick={() => cart.moveToCart(item.key)}>Move to bag</button> : <button onClick={() => cart.saveForLater(item.key)}>Save for later</button>}<button className={styles.removeButton} onClick={() => saved ? cart.removeSavedItem(item.key) : cart.removeFromCart(item.key)}><Trash2 size={14} /> Remove</button></div></div>
      {!saved && <div className={styles.itemPrice}><strong>{formatCurrency(product.price)}</strong><div className={styles.quantity}><button aria-label={`Decrease ${product.name} quantity`} disabled={item.quantity <= 1} onClick={() => cart.decreaseQuantity(item.key)}><Minus size={14} /></button><output aria-label="Quantity">{item.quantity}</output><button aria-label={`Increase ${product.name} quantity`} disabled={item.quantity >= product.stock || product.stock === 0} onClick={() => cart.increaseQuantity(item.key)}><Plus size={14} /></button></div><span>Subtotal {formatCurrency(product.price * item.quantity)}</span></div>}
    </article>
  )
}

function Summary({ cart, checkoutDisabled }) {
  const [couponText, setCouponText] = useState('')
  const [couponMessage, setCouponMessage] = useState(null)

  function applyCoupon(event) {
    event.preventDefault()
    const result = cart.applyCoupon(couponText)
    setCouponMessage(result)
    if (result.ok) setCouponText('')
  }

  return <aside className={styles.summary} aria-labelledby="summary-title">
    <h2 id="summary-title">Order summary</h2>
    <form className={styles.coupon} onSubmit={applyCoupon}><label htmlFor="coupon-code">Promo code</label><div><input id="coupon-code" value={couponText} onChange={(event) => setCouponText(event.target.value)} placeholder="Enter code" /><button type="submit">Apply</button></div>{couponMessage && <p className={couponMessage.ok ? styles.couponSuccess : styles.couponError} role="status">{couponMessage.message}</p>}{cart.coupon && <button type="button" className={styles.removeCoupon} onClick={() => { cart.removeCoupon(); setCouponMessage(null) }}>Remove {cart.coupon.code}</button>}</form>
    <dl className={styles.totals}><div><dt>Subtotal</dt><dd>{formatCurrency(cart.subtotal)}</dd></div>{cart.discount > 0 && <div className={styles.discountRow}><dt>Discount ({cart.coupon.code})</dt><dd>−{formatCurrency(cart.discount)}</dd></div>}<div><dt>Shipping</dt><dd>{cart.shipping === 0 ? 'Free' : formatCurrency(cart.shipping)}</dd></div><div><dt>Estimated tax</dt><dd>{formatCurrency(cart.tax)}</dd></div><div className={styles.grandTotal}><dt>Total</dt><dd>{formatCurrency(cart.total)}</dd></div></dl>
    <p className={styles.taxNote}>Tax is estimated for this demo storefront.</p>
    {checkoutDisabled ? <button type="button" className={`btn btn--primary btn--lg ${styles.checkoutButton}`} disabled>Continue to checkout</button> : <Link to="/checkout" className={`btn btn--primary btn--lg ${styles.checkoutButton}`}>Continue to checkout</Link>}
    <p className={styles.secureNote}><ShoppingBag size={15} /> Secure checkout · Payment is not processed in this demo</p>
  </aside>
}

export default function Cart() {
  const cart = useCart()
  const lines = cart.items.map((item) => ({ item, product: products.find((product) => product.id === item.productId) })).filter((line) => line.product)
  const savedLines = cart.savedForLater.map((item) => ({ item, product: products.find((product) => product.id === item.productId) })).filter((line) => line.product)
  const hasUnavailableItem = lines.some(({ product }) => product.stock === 0)

  return (
    <section className={`container ${styles.page}`}>
      <div className={styles.heading}><div><p className={styles.eyebrow}>YOUR SELECTION</p><h1>Your bag <span>({cart.itemCount})</span></h1></div>{lines.length > 0 && <button className={styles.clearButton} onClick={cart.clearCart}><Trash2 size={15} /> Clear bag</button>}</div>
      {lines.length === 0 ? <div className={styles.empty}><div className={styles.emptyIcon}><ShoppingBag size={26} /></div><h2>Your bag is taking a little break.</h2><p>Browse the NOVA collection and add something useful to your everyday.</p><Link to="/shop" className="btn btn--primary">Explore products <ArrowLeft size={16} /></Link></div> : <div className={styles.layout}>
        <div className={styles.items}><div className={styles.itemsHead}><span>Product</span><span>Price · quantity · subtotal</span></div>{lines.map(({ item, product }) => <CartLine item={item} product={product} cart={cart} key={item.key} />)}<Link className={styles.continue} to="/shop"><ArrowLeft size={15} /> Continue shopping</Link>
          {savedLines.length > 0 && <section className={styles.saved}><h2>Saved for later <span>({savedLines.length})</span></h2>{savedLines.map(({ item, product }) => <CartLine item={item} product={product} cart={cart} saved key={item.key} />)}</section>}
          {hasUnavailableItem && <p className={styles.unavailableNote} role="status">Remove unavailable items before continuing to checkout.</p>}
        </div>
        <Summary cart={cart} checkoutDisabled={hasUnavailableItem || lines.length === 0} />
      </div>}
      {lines.length === 0 && savedLines.length > 0 && <section className={styles.savedEmpty}><h2>Saved for later ({savedLines.length})</h2>{savedLines.map(({ item, product }) => <CartLine item={item} product={product} cart={cart} saved key={item.key} />)}</section>}
    </section>
  )
}
