import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Package } from 'lucide-react'
import { readStorage, STORAGE_KEYS } from '../../utils/storage'
import { formatCurrency, formatDate } from '../../utils/formatters'
import styles from './AccountPages.module.css'

export default function AccountOrderDetail() {
  const { orderId } = useParams()
  const orders = readStorage(STORAGE_KEYS.orders, [], Array.isArray)
  const order = orders.find((item) => item.id === orderId)

  if (!order) return <section className={styles.page}><p className={styles.eyebrow}>ORDER HISTORY</p><h1>Order not found</h1><p className={styles.intro}>We couldn’t find that order in this demo account.</p><Link to="/account/orders" className={styles.back}><ArrowLeft size={15} /> Back to orders</Link></section>

  return <section className={styles.page}><Link to="/account/orders" className={styles.back}><ArrowLeft size={15} /> All orders</Link><p className={styles.eyebrow}>ORDER DETAILS</p><h1>{order.id}</h1><p className={styles.intro}>Placed {order.date ? formatDate(order.date) : 'recently'} · {order.status || 'Processing'}</p>
    <div className={styles.orderDetail}><h2><Package size={18} /> Items</h2>{(order.items || []).map((item) => <div className={styles.orderItem} key={item.key || item.productId}><span>{item.name || item.productName || 'Store item'} × {item.quantity || 1}</span><strong>{typeof item.total === 'number' ? formatCurrency(item.total) : ''}</strong></div>)}<div className={styles.orderTotal}><span>Order total</span><strong>{typeof order.total === 'number' ? formatCurrency(order.total) : order.total}</strong></div></div>
  </section>
}
