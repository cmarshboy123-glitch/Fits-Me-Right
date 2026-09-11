import mockProducts from '../data/products.json'
import verifiedProducts from '../data/verifiedProducts'
import marketplaceInventory from '../data/marketplaceInventory'

export const API_URL = 'https://fits-me-right-api-6d1474833fcd.herokuapp.com/api/products'

// The broader catalog (products.json) uses shirtSizes/pantsSizes while the
// verified/marketplace records use availableShirtSizes/availablePantsSizes —
// line the field names up so every product behaves identically once merged.
const normalizedMockProducts = mockProducts.map((product) => ({
  ...product,
  availableShirtSizes: product.shirtSizes,
  availablePantsSizes: product.pantsSizes,
}))

const bundledCatalog = [...verifiedProducts, ...marketplaceInventory, ...normalizedMockProducts]

let cachedCatalog = null

// Serves the live Postgres-backed catalog when reachable, falling back to the
// bundled static data (kept in sync via 03-Server-Code/prisma/seed.mjs) if the
// API is unreachable — e.g. the Heroku dyno waking up from sleep, or an outage.
export async function getProducts() {
  if (cachedCatalog) return cachedCatalog

  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error(`API responded with ${response.status}`)
    const products = await response.json()
    if (!Array.isArray(products) || products.length === 0) throw new Error('API returned no products')
    cachedCatalog = products
  } catch (error) {
    console.warn('Falling back to bundled catalog — live API unreachable:', error)
    cachedCatalog = bundledCatalog
  }

  return cachedCatalog
}

// Called after an admin create/edit/delete so the next getProducts() call
// re-fetches instead of serving the stale in-memory copy.
export function invalidateCatalogCache() {
  cachedCatalog = null
}

export async function getRecommendedProducts(selections) {
  const catalog = await getProducts()
  const catalogBodyType = selections.bodyType === 'Balanced' ? 'Regular' : selections.bodyType

  const matchesSelectedSize = (product) => {
    const shirtSelected = selections.shirtSize && selections.shirtSize !== 'Not sure'
    const pantsSelected = selections.pantsSize && selections.pantsSize !== 'Not sure'

    if (product.category === 'Dresses' && product.availablePantsSizes) {
      return !pantsSelected || product.availablePantsSizes.includes(selections.pantsSize)
    }
    if (product.availableShirtSizes) {
      return !shirtSelected || product.availableShirtSizes.includes(selections.shirtSize)
    }
    return true
  }

  return catalog.filter((product) =>
    !['Shoes', 'Jewelry', 'Accessories'].includes(product.category) &&
    product.gender === selections.gender &&
    product.bodyType.includes(catalogBodyType) &&
    product.priceTier === selections.priceTier &&
    product.dressCode.includes(selections.dressCode) &&
    matchesSelectedSize(product),
  )
}
