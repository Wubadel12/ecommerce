import { ArrowRight, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { readStorage, STORAGE_KEYS } from '../../utils/storage'
import { formatCurrency, formatDate } from '../../utils/formatters'
import styles from './AccountPages.module.css'

export default function AccountOrders() {
  const orders = readStorage(STORAGE_KEYS.orders, [], Array.isArray).slice().reverse()
  return <section className={styles.page}><p className={styles.eyebrow}>PURCHASE HISTORY</p><h1>Your orders</h1><p className={styles.intro}>View recent purchases and their details.</p>
    {orders.length ? <div className={styles.orderList}>{orders.map((order) => <Link key={order.id} to={"/account/orders/" + order.id}><span><strong>{order.id}</strong><small>{order.date ? formatDate(order.date) : 'Date unavailable'}</small></span><span className={styles.status}>{order.status || 'Processing'}</span><strong>{typeof order.total === 'number' ? formatCurrency(order.total) : order.total || ''}</strong><ArrowRight size={16} /></Link>)}</div> : <div className={styles.empty}><span><Package size={24} /></span><h2>No orders yet</h2><p>When you place an order, you’ll find its details here.</p><Link to="/shop" className="btn btn--primary">Browse the collection</Link></div>}
  </section>
}
