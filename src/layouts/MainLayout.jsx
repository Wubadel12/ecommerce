import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className={styles.main}>
        <Suspense fallback={<LoadingSpinner label="Loading page" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
