import { slugify } from '../utils/slugify'

export const API_URL = 'https://fits-me-right-api-6d1474833fcd.herokuapp.com/api/products'

// The bundled catalog is only needed when the API can't be reached, so it is loaded
// on demand instead of shipping inside the main JavaScript file.
// The broader catalog (products.json) uses shirtSizes/pantsSizes while the
// verified/marketplace records use availableShirtSizes/availablePantsSizes —
// line the field names up so every product behaves identically once merged.
async function loadBundledCatalog() {
  const [{ default: mockProducts }, { default: verifiedProducts }, { default: marketplaceInventory }, { default: apiSnapshot }] = await Promise.all([
    import('../data/products.json'),
    import('../data/verifiedProducts'),
    import('../data/marketplaceInventory'),
    // The real items the product API holds (shoes, resale finds, luxury pieces), saved in the site so they
    // still show when the API can't be reached. Refresh with: node work/snapshot-api.mjs
    import('../data/apiSnapshot.json'),
  ])
  const normalizedMockProducts = mockProducts.map((product) => ({
    ...product,
    availableShirtSizes: product.shirtSizes,
    availablePantsSizes: product.pantsSizes,
  }))
  // The snapshot comes first, and a product that appears in more than one source is kept once.
  const seen = new Set()
  return [...apiSnapshot, ...verifiedProducts, ...marketplaceInventory, ...normalizedMockProducts].filter((product) => !seen.has(product.id) && seen.add(product.id))
}

// Stores don't publish body-type fit, so feed items list every body type for their gender.
const FEED_BODY_TYPES = {
  Women: ['Straight', 'Curvy', 'Athletic', 'Petite', 'Tall', 'Plus'],
  Men: ['Slim', 'Athletic', 'Regular', 'Broad', 'Big & Tall', 'Short'],
  Children: ['Slim', 'Regular', 'Tall', 'Short'],
}

// Real products pulled from stores' public product feeds (see work/build-extra-catalog.mjs),
// shipped as a static file next to the site and added to whatever the API returns. Every visitor
// downloads that file, so it is stored as tables of repeated values plus one short row per item;
// this puts each row back together (keep in step with compactCatalog() in the builder).
function expandExtraCatalog(data) {
  const { checkedOn, firstId, stores, vendors, colors, categories, genders, dress, shirt, pants, brands, imageBases, imageTails, rows } = data
  return rows.map(([vendorAt, genderAt, categoryAt, price, name, colorAt, dressAt, shirtAt, pantsAt, brandAt, imageBaseAt, imageFile, imageTailAt, page], index) => {
    const vendor = vendors[vendorAt]
    const gender = genders[genderAt]
    const pantsSizes = pants[pantsAt]
    return {
      id: firstId + index,
      name,
      gender,
      category: categories[categoryAt],
      price,
      priceTier: price < 60 ? 'budget' : price < 180 ? 'treat' : 'splurge',
      imageUrl: imageBases[imageBaseAt] + imageFile + imageTails[imageTailAt],
      vendor,
      brand: brands[brandAt] || vendor,
      color: colors[colorAt],
      storeTier: 'Everyday & Designer',
      bodyType: FEED_BODY_TYPES[gender] || FEED_BODY_TYPES.Women,
      dressCode: dress[dressAt],
      availableShirtSizes: shirt[shirtAt],
      ...(pantsSizes.length ? { availablePantsSizes: pantsSizes } : {}),
      productUrl: page.startsWith('http') ? page : `${stores[vendor]}${page || slugify(name)}`,
      verifiedAt: checkedOn,
      fitNote: 'Listing details from the retailer; fit guidance not provided',
      fromFeed: true,
    }
  })
}

async function loadExtraCatalog() {
  try {
    // The host lets browsers keep static files for 30 days; "no-cache" makes the browser check
    // for a newer copy every time (a quick "unchanged" reply when there isn't one).
    const response = await fetch('/catalog-extra.json', { cache: 'no-cache' })
    if (!response.ok) return []
    const data = await response.json()
    return data.v === 2 ? expandExtraCatalog(data) : []
  } catch {
    return []
  }
}

// The feed file lists one store after another. A fixed-seed shuffle spreads the stores out so a
// page of results isn't 24 items from the same shop, and it comes out the same on every visit.
function mixStores(items) {
  let seed = 20261020
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const mixed = [...items]
  for (let i = mixed.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[mixed[i], mixed[j]] = [mixed[j], mixed[i]]
  }
  return mixed
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
  const [base, extra, { default: curated }] = await Promise.all([fetchBaseCatalog(), loadExtraCatalog(), import('../data/curatedProducts')])
  // A store's product may already be in the catalog (same page), so skip repeats.
  const knownIds = new Set(base.map((product) => product.id))
  const knownPages = new Set(base.map((product) => product.productUrl).filter(Boolean))
  // Hand-checked listings (tuxedos) are always included, even when the product API is down.
  const curatedNew = curated.filter((product) => !knownIds.has(product.id) && !knownPages.has(product.productUrl))
  curatedNew.forEach((product) => { knownIds.add(product.id); knownPages.add(product.productUrl) })
  const merged = [...base, ...curatedNew, ...extra.filter((product) => !knownIds.has(product.id) && !knownPages.has(product.productUrl))]
  // Items with a real store photo come first (mixed across stores); the rest use an illustration placeholder.
  const hasPhoto = (product) => /^https?:\/\//.test(product.imageUrl || '')
  return [...mixStores(merged.filter(hasPhoto)), ...merged.filter((product) => !hasPhoto(product))]
}

// Serves the live Postgres-backed catalog when reachable, falling back to the
// bundled static data (kept in sync via 03-Server-Code/prisma/seed.mjs) if the
// API is unreachable — e.g. the Heroku dyno waking up from sleep, or an outage.
export function getProducts() {
  if (!catalogPromise) catalogPromise = fetchCatalog()
  return catalogPromise
}

// A sample listing is an illustration of what a store typically sells (example name and price)
// with no exact product page. Real listings always carry the store's own product URL.
export const isSampleListing = (product) => !product.productUrl

// What visitors see by default: real products only. The shop can opt back in to samples.
export async function getRealProducts() {
  const catalog = await getProducts()
  return catalog.filter((product) => !isSampleListing(product))
}

// Called after an admin create/edit/delete so the next getProducts() call
// re-fetches instead of serving the stale in-memory copy.
export function invalidateCatalogCache() {
  catalogPromise = null
}

export async function getRecommendedProducts(selections) {
  const catalog = await getRealProducts()
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

// The stores that really have the most items in each price level, so the quiz names stores that exist
// in the marketplace instead of a fixed list.
export async function getTopStoresByTier(limit = 4) {
  const catalog = await getRealProducts()
  const counts = { budget: {}, treat: {}, splurge: {} }
  catalog.forEach((product) => {
    if ((!product.currency || product.currency === 'USD') && counts[product.priceTier]) {
      counts[product.priceTier][product.vendor] = (counts[product.priceTier][product.vendor] || 0) + 1
    }
  })
  return Object.fromEntries(Object.entries(counts).map(([tier, vendors]) => [tier, Object.entries(vendors).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([vendor]) => vendor)]))
}

const TIER_UP = { budget: 'treat', treat: 'splurge' }
const FORMAL = ['Black Tie', 'Formal Attire', 'Cocktail Dress', 'Semi-Formal', 'Professional/Formal Business']

// The exact matches, plus honest next-best groups when there are few of them: the most formal pieces
// inside the same budget, and the same choices one price level up. Nothing here is loosened silently:
// each group is labelled with what changed.
export async function getRecommendedWithFallbacks(selections) {
  const exact = await getRecommendedProducts(selections)
  const alternatives = []
  if (exact.length >= 12) return { exact, alternatives }

  const seen = new Set(exact.map((product) => product.id))
  if (FORMAL.includes(selections.dressCode)) {
    const order = [selections.dressCode, ...FORMAL.filter((code) => code !== selections.dressCode)]
    const lists = await Promise.all(order.map((code) => getRecommendedProducts({ ...selections, dressCode: code })))
    const merged = []
    lists.forEach((list) => list.forEach((product) => { if (!seen.has(product.id) && !merged.some((item) => item.id === product.id)) merged.push(product) }))
    if (merged.length) {
      alternatives.push({ title: 'The most formal pieces in your budget', note: `Pieces labelled ${selections.dressCode} are rare at this price, so these are the closest dressy options that fit the rest of your choices.`, products: merged.slice(0, 24) })
      merged.forEach((product) => seen.add(product.id))
    }
  }
  const up = TIER_UP[selections.priceTier]
  if (up) {
    const list = (await getRecommendedProducts({ ...selections, priceTier: up })).filter((product) => !seen.has(product.id))
    if (list.length) alternatives.push({ title: up === 'treat' ? 'A step up: $60 to $179' : 'A step up: $180 and over', note: 'Your same choices, one price level higher.', products: list.slice(0, 24) })
  }
  return { exact, alternatives }
}
