import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container" style={{ paddingBlock: 'var(--space-8)' }}>
      <h1>Page not found</h1>
      <p style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-muted)' }}>
        The page you are looking for does not exist or has moved.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
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
