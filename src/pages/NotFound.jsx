import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <section className={`container ${styles.page}`}>
      <h1>Page not found</h1>
      <p className={styles.message}>
        The page you are looking for does not exist or has moved.
      </p>
      <div className={styles.actions}>
        <Link to="/" className="btn btn--primary">
          Go to home
        </Link>
        <Link to="/shop" className="btn btn--secondary">
          Browse the shop
        </Link>
      </div>
    </section>
  )
}
