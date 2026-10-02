import { Check, Package, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { products } from '../data/products'
import { readStorage, STORAGE_KEYS } from '../utils/storage'
import { formatCurrency, formatDate } from '../utils/formatters'
import styles from './OrderSuccess.module.css'

function estimateDelivery(order) {
  const days = order.delivery?.method === 'express' ? 2 : 5
  const date = new Date(order.date)
  date.setDate(date.getDate() + days)
  return formatDate(date)
}

export default function OrderSuccess() {
  const { orderId } = useParams()
  const order = readStorage(STORAGE_KEYS.orders, [], Array.isArray).find((item) => item.id === orderId)

  if (!order) return <section className={`container ${styles.missing}`}><h1>We couldn’t find this order.</h1><p>Order details are only available in this browser’s local demo storage.</p><Link to="/shop" className="btn btn--primary">Continue shopping</Link></section>

  return <section className={`container ${styles.page}`}>
    <div className={styles.successIcon}><Check size={26} /></div><p className={styles.eyebrow}>ORDER CONFIRMED</p><h1>Thank you, {order.contact?.name?.split(' ')[0] ?? 'your order is in'}.</h1><p className={styles.intro}>Your demo order has been saved. No payment was processed.</p>
    <div className={styles.orderBanner}><span>Order number<strong>{order.id}</strong></span><span>Estimated delivery<strong>{estimateDelivery(order)}</strong></span></div>
    <div className={styles.content}>
      <div className={styles.orderItems}><h2><Package size={18} /> Order summary</h2>{order.items.map((item) => { const product = products.find((entry) => entry.id === item.productId); return <div className={styles.item} key={item.key}><img src={product?.images[0] ?? item.image} alt={item.name || product?.name || 'Product'} /><span><strong>{item.name || product?.name}</strong><small>Quantity {item.quantity}{item.color ? ' · ' + item.color : ''}</small></span><strong>{formatCurrency(item.total ?? (item.unitPrice * item.quantity))}</strong></div> })}<dl><div><dt>Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div>{order.discount > 0 && <div><dt>Discount</dt><dd>−{formatCurrency(order.discount)}</dd></div>}<div><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</dd></div><div><dt>Estimated tax</dt><dd>{formatCurrency(order.tax)}</dd></div><div className={styles.total}><dt>Total</dt><dd>{formatCurrency(order.total)}</dd></div></dl></div>
      <aside className={styles.deliveryCard}><h2><Truck size={18} /> Delivery details</h2><p>{order.contact?.name}<br />{order.contact?.email}<br />{order.contact?.phone}</p><p>{order.shippingAddress?.street}<br />{order.shippingAddress?.city}{order.shippingAddress?.region ? ', ' + order.shippingAddress.region : ''} {order.shippingAddress?.postalCode}<br />{order.shippingAddress?.country}</p><p className={styles.payment}>Payment: {order.paymentMethod === 'card' ? 'Card (demo)' : 'PayPal (demo)'}</p><span className={styles.deliveryDate}>Estimated by {estimateDelivery(order)}</span></aside>
    </div>
    <div className={styles.actions}><Link to="/shop" className="btn btn--primary">Continue shopping</Link><Link to={"/account/orders/" + order.id} className="btn btn--secondary">View order history</Link></div>
    <p className={styles.demoNote}>Portfolio demo order. This confirmation is not proof of payment.</p>
  </section>
}
