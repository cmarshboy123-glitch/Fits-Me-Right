// Sanity-checks every product record before it ships: unique ids, a category
// from the canonical taxonomy, and the fields the UI actually renders on.
// Run with: npm run audit:catalog
import mockProducts from '../src/data/products.json' with { type: 'json' }
import verifiedProducts from '../src/data/verifiedProducts.js'
import marketplaceInventory from '../src/data/marketplaceInventory.js'
import { shoppingCategories } from '../src/utils/searchIntent.js'

const catalog = [...verifiedProducts, ...marketplaceInventory, ...mockProducts]
const errors = []

const seenIds = new Map()
for (const product of catalog) {
  const where = `#${product.id} "${product.name}"`

  if (seenIds.has(product.id)) errors.push(`Duplicate id ${product.id}: "${seenIds.get(product.id)}" and "${product.name}"`)
  seenIds.set(product.id, product.name)

  if (!product.name) errors.push(`${where}: missing name`)
  if (!['Women', 'Men', 'Children'].includes(product.gender)) errors.push(`${where}: unexpected gender "${product.gender}"`)
  if (!product.category) errors.push(`${where}: missing category`)
  else if (!shoppingCategories.includes(product.category) && !['Bottoms', 'Active', 'Tailoring'].includes(product.category)) {
    errors.push(`${where}: category "${product.category}" is not in the canonical taxonomy (${shoppingCategories.join(', ')})`)
  }
  if (typeof product.price !== 'number' || product.price <= 0) errors.push(`${where}: invalid price "${product.price}"`)
  if (!product.imageUrl) errors.push(`${where}: missing imageUrl`)
  if (!product.color) errors.push(`${where}: missing color — breaks color-word search for this item`)
  if (!product.vendor) errors.push(`${where}: missing vendor`)
  if (!Array.isArray(product.bodyType) || product.bodyType.length === 0) errors.push(`${where}: missing bodyType list`)
}

console.log(`Checked ${catalog.length} products across verifiedProducts, marketplaceInventory, and products.json.`)
if (errors.length) {
  console.error(`\n${errors.length} issue(s) found:\n`)
  errors.forEach((e) => console.error(' - ' + e))
  process.exit(1)
}
console.log('Catalog looks good — no issues found.')
