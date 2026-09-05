import mockProducts from '../data/products.json'
import verifiedProducts from '../data/verifiedProducts'
import marketplaceInventory from '../data/marketplaceInventory'

// Keep the page contract async so a vendor/affiliate API can replace this implementation later.
export async function getProducts() {
  const previewShoesAndJewels = mockProducts
    .filter((product) => product.id >= 15 && product.id <= 25)
    .map((product) => ({ ...product, isPreview: true }))
  return Promise.resolve([...verifiedProducts, ...marketplaceInventory, ...previewShoesAndJewels])
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
