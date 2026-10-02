import { products } from '../data/products.js'
import { categories } from '../data/categories.js'

// The catalog is local, but every call is async and slightly delayed so the UI
// handles loading states exactly as it would with a real API. To connect a backend,
// replace the bodies of these functions with fetch() calls; callers stay the same.
const SIMULATED_LATENCY_MS = 350

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getProducts() {
  await wait(SIMULATED_LATENCY_MS)
  return products
}

export async function getProductBySlug(slug) {
  await wait(SIMULATED_LATENCY_MS)
  return products.find((product) => product.slug === slug) ?? null
}

export async function getCategories() {
  await wait(SIMULATED_LATENCY_MS / 2)
  return categories
}
