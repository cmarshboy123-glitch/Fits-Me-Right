export const API_URL = 'https://fits-me-right-api-6d1474833fcd.herokuapp.com/api/products'

// The bundled catalog is only needed when the API can't be reached, so it is loaded
// on demand instead of shipping inside the main JavaScript file.
// The broader catalog (products.json) uses shirtSizes/pantsSizes while the
// verified/marketplace records use availableShirtSizes/availablePantsSizes —
// line the field names up so every product behaves identically once merged.
async function loadBundledCatalog() {
  const [{ default: mockProducts }, { default: verifiedProducts }, { default: marketplaceInventory }] = await Promise.all([
    import('../data/products.json'),
    import('../data/verifiedProducts'),
    import('../data/marketplaceInventory'),
  ])
  const normalizedMockProducts = mockProducts.map((product) => ({
    ...product,
    availableShirtSizes: product.shirtSizes,
    availablePantsSizes: product.pantsSizes,
  }))
  return [...verifiedProducts, ...marketplaceInventory, ...normalizedMockProducts]
}

// Real products pulled from stores' public product feeds (see work/build-extra-catalog.mjs),
// shipped as a static file next to the site and added to whatever the API returns.
async function loadExtraCatalog() {
  try {
    const response = await fetch('/catalog-extra.json')
    if (!response.ok) return []
    const items = await response.json()
    return Array.isArray(items) ? items.map((item) => ({ ...item, fromFeed: true })) : []
  } catch {
    return []
  }
}

// Hold the in-flight request itself, not just the finished result, so the header and
// the page both asking for the catalog at once share one download.
let catalogPromise = null

async function fetchBaseCatalog() {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error(`API responded with ${response.status}`)
    const products = await response.json()
    if (!Array.isArray(products) || products.length === 0) throw new Error('API returned no products')
    return products
  } catch (error) {
    console.warn('Falling back to bundled catalog — live API unreachable:', error)
    return loadBundledCatalog()
  }
}

async function fetchCatalog() {
  const [base, extra] = await Promise.all([fetchBaseCatalog(), loadExtraCatalog()])
  const known = new Set(base.map((product) => product.id))
  return [...base, ...extra.filter((product) => !known.has(product.id))]
}

// Serves the live Postgres-backed catalog when reachable, falling back to the
// bundled static data (kept in sync via 03-Server-Code/prisma/seed.mjs) if the
// API is unreachable — e.g. the Heroku dyno waking up from sleep, or an outage.
export function getProducts() {
  if (!catalogPromise) catalogPromise = fetchCatalog()
  return catalogPromise
}

// Called after an admin create/edit/delete so the next getProducts() call
// re-fetches instead of serving the stale in-memory copy.
export function invalidateCatalogCache() {
  catalogPromise = null
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
