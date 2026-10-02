import { ArrowRight, Heart, Package, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useWishlist } from '../../hooks/useWishlist'
import { readStorage, STORAGE_KEYS } from '../../utils/storage'
import styles from './AccountPages.module.css'

export default function AccountDashboard() {
  const { user } = useAuth()
  const { count: wishlistCount } = useWishlist()
  const orders = readStorage(STORAGE_KEYS.orders, [], Array.isArray)
  const recentOrders = orders.slice(-3).reverse()

  return <section className={styles.page}>
    <p className={styles.eyebrow}>ACCOUNT OVERVIEW</p><h1>Good to see you, {user.name.split(' ')[0]}.</h1><p className={styles.intro}>Manage your details, orders and saved products from one place.</p>
    <div className={styles.stats}><Link to="/account/orders"><span><Package size={19} /></span><strong>{orders.length}</strong><small>Orders</small></Link><Link to="/wishlist"><span><Heart size={19} /></span><strong>{wishlistCount}</strong><small>Saved products</small></Link><Link to="/account/profile"><span><UserRound size={19} /></span><strong>Profile</strong><small>Personal details</small></Link></div>
    <div className={styles.dashboardSection}><div className={styles.sectionHeading}><h2>Recent orders</h2><Link to="/account/orders">View all <ArrowRight size={15} /></Link></div>{recentOrders.length ? <div className={styles.orderList}>{recentOrders.map((order) => <Link key={order.id} to={"/account/orders/" + order.id}><span><strong>{order.id}</strong><small>{order.date || 'Order placed'}</small></span><span>{order.status || 'Processing'}</span><strong>{order.total ?? ''}</strong></Link>)}</div> : <div className={styles.emptyInline}><p>You haven’t placed an order yet.</p><Link to="/shop">Find something useful <ArrowRight size={15} /></Link></div>}</div>
    <div className={styles.dashboardSection}><div className={styles.sectionHeading}><h2>Your details</h2><Link to="/account/profile">Edit profile <ArrowRight size={15} /></Link></div><div className={styles.profileSummary}><div><span>Name</span><strong>{user.name}</strong></div><div><span>Email</span><strong>{user.email}</strong></div></div></div>
  </section>
}
