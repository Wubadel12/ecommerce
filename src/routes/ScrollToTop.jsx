import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Resets scroll when the page changes. Query-string changes (filters, search) are ignored on purpose.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
