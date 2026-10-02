import { products } from '../src/data/products.js'
import { categories } from '../src/data/categories.js'

const errors = []
const categorySlugs = new Set(categories.map((category) => category.slug))
const seenIds = new Set()
const seenSlugs = new Set()

const requiredTextFields = ['slug', 'name', 'brand', 'category', 'shortDescription', 'description', 'createdAt']

for (const product of products) {
  const label = `#${product.id} ${product.slug}`
  const fail = (message) => errors.push(`${label}: ${message}`)

  if (seenIds.has(product.id)) fail('duplicate id')
  if (seenSlugs.has(product.slug)) fail('duplicate slug')
  seenIds.add(product.id)
  seenSlugs.add(product.slug)

  for (const field of requiredTextFields) {
    if (typeof product[field] !== 'string' || product[field].trim() === '') fail(`missing ${field}`)
  }
  if (!categorySlugs.has(product.category)) fail(`unknown category "${product.category}"`)
  if (!(product.price > 0)) fail('price must be positive')
  if (product.oldPrice !== null && product.oldPrice <= product.price) fail('oldPrice must be higher than price')
  if (product.discount !== (product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0)) {
    fail('discount does not match prices')
  }
  if (!(product.rating >= 0 && product.rating <= 5)) fail('rating must be between 0 and 5')
  if (!Number.isInteger(product.reviewCount) || product.reviewCount < 0) fail('invalid reviewCount')
  if (!Number.isInteger(product.stock) || product.stock < 0) fail('invalid stock')
  if (product.images.length < 1) fail('needs at least one image')
  if (product.colors.length < 1) fail('needs at least one color')
  if (product.tags.length < 1) fail('needs tags')
  if (Object.keys(product.specifications).length < 4) fail('needs at least 4 specifications')
  if (Number.isNaN(Date.parse(product.createdAt))) fail('invalid createdAt')
}

for (const category of categories) {
  const count = products.filter((product) => product.category === category.slug).length
  if (count < 4) errors.push(`category "${category.slug}" has only ${count} products`)
}

if (products.length < 30) errors.push(`expected at least 30 products, found ${products.length}`)

const count = (predicate) => products.filter(predicate).length
console.log(`Products: ${products.length} across ${categories.length} categories`)
console.log(
  `Featured: ${count((p) => p.featured)}, Best sellers: ${count((p) => p.bestseller)}, ` +
    `New arrivals: ${count((p) => p.newArrival)}, On sale: ${count((p) => p.discount > 0)}`,
)
console.log(`Out of stock: ${count((p) => p.stock === 0)}, Low stock (1-5): ${count((p) => p.stock > 0 && p.stock <= 5)}`)

if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s) found:`)
  errors.forEach((message) => console.error(` - ${message}`))
  process.exit(1)
}
console.log('Data looks good.')
