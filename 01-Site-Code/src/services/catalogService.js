import mockProducts from '../data/products.json'
import verifiedProducts from '../data/verifiedProducts'
import marketplaceInventory from '../data/marketplaceInventory'

// The broader catalog (products.json) uses shirtSizes/pantsSizes while the
// verified/marketplace records use availableShirtSizes/availablePantsSizes —
// line the field names up so every product behaves identically once merged.
const normalizedMockProducts = mockProducts.map((product) => ({
  ...product,
  availableShirtSizes: product.shirtSizes,
  availablePantsSizes: product.pantsSizes,
}))

// Keep the page contract async so a vendor/affiliate API can replace this implementation later.
export async function getProducts() {
  return Promise.resolve([...verifiedProducts, ...marketplaceInventory, ...normalizedMockProducts])
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
