import { Suspense } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import styles from './AccountLayout.module.css'
import { LogOut } from 'lucide-react'

const accountLinks = [
  { to: '/account', label: 'Overview', end: true },
  { to: '/account/profile', label: 'Profile' },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/wishlist', label: 'Wishlist' },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/settings', label: 'Settings' },
]

export default function AccountLayout() {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return (
    <div className={`container ${styles.layout}`}>
      <nav aria-label="Account" className={styles.nav}>
        <div className={styles.accountIntro}><span>YOUR ACCOUNT</span><strong>{user.name}</strong></div>
        <ul className={styles.list} role="list">
          {accountLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={styles.link}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button className={styles.logout} onClick={logout}><LogOut size={16} /> Sign out</button>
      </nav>
      <div className={styles.content}>
        <Suspense fallback={<LoadingSpinner label="Loading account" />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}
