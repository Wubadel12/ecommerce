

import { useEffect, useState } from 'react'
import { getProductBySlug } from '../services/productService'

// Result is stored together with the slug it belongs to, so "loading" can be derived
// (the stored slug no longer matches) instead of needing a separate flag set inside the effect.
export function useProduct(slug) {
  const [result, setResult] = useState({ slug: null, product: null })

  useEffect(() => {
    let ignore = false
    getProductBySlug(slug).then((product) => {
      if (!ignore) setResult({ slug, product })
    })
    return () => {
      ignore = true
    }
  }, [slug])

  return {
    product: result.slug === slug ? result.product : null,
    isLoading: result.slug !== slug,
  }
}
