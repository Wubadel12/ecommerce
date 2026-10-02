import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import styles from './CheckoutLayout.module.css'

// Checkout drops the full navigation so shoppers stay focused on finishing the order.
export default function CheckoutLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className={styles.header}>
        <div className={`container ${styles.inner}`}>
          <Link to="/" className={styles.logo} aria-label="NOVA home">
            NOVA
          </Link>
          <Link to="/cart" className={styles.back}>
            Back to cart
          </Link>
        </div>
      </header>
      <main id="main-content" className={styles.main}>
        <Suspense fallback={<LoadingSpinner label="Loading checkout" />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  )
}
