const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatCurrency(amount) {
  return currencyFormatter.format(amount)
}

export function formatDate(value, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  return new Date(value).toLocaleDateString('en-US', options)
}

export function calculateDiscountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}
