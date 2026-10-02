import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className={styles.wrapper} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  )
}
