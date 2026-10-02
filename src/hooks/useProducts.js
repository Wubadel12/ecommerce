import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'

export function useProducts() {
  const [state, setState] = useState({ products: [], isLoading: true, error: null })

  useEffect(() => {
    let cancelled = false
    getProducts()
      .then((products) => {
        if (!cancelled) setState({ products, isLoading: false, error: null })
      })
      .catch(() => {
        if (!cancelled) setState({ products: [], isLoading: false, error: 'We could not load the catalog. Please try again.' })
      })
    return () => { cancelled = true }
  }, [])

  return state
}
