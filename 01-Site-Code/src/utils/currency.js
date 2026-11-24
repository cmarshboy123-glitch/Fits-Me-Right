// Prices are shown in the currency the store itself lists. Dollar is the default; a product from a store that
// lists in another currency carries `currency` (for example GBP or NGN) and is never converted or mixed into
// dollar totals or dollar price ranges.
const SYMBOLS = { USD: '$', GBP: '£', NGN: '₦' }

export const isDollar = (product) => !product.currency || product.currency === 'USD'
export const currencySymbol = (product) => SYMBOLS[product.currency] || '$'

export function formatPrice(product, { whole = false } = {}) {
  const digits = whole ? 0 : 2
  return `${currencySymbol(product)}${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}
