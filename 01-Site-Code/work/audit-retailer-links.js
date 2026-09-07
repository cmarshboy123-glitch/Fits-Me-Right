// Every product must open somewhere real when clicked: an exact, verified
// productUrl, or a live retailer search via retailerSearchUrl(). Catches
// vendor-name typos that would silently produce a dead "#" link.
// Run with: npm run audit:links
import mockProducts from '../src/data/products.json' with { type: 'json' }
import verifiedProducts from '../src/data/verifiedProducts.js'
import marketplaceInventory from '../src/data/marketplaceInventory.js'
import { retailerSearchUrl } from '../src/utils/retailers.js'

const catalog = [...verifiedProducts, ...marketplaceInventory, ...mockProducts]
const errors = []

for (const product of catalog) {
  const where = `#${product.id} "${product.name}" (${product.vendor})`

  if (product.productUrl) {
    try {
      const url = new URL(product.productUrl)
      if (!/^https?:$/.test(url.protocol)) errors.push(`${where}: productUrl is not http(s): ${product.productUrl}`)
    } catch {
      errors.push(`${where}: productUrl is not a valid URL: ${product.productUrl}`)
    }
    continue
  }

  const fallback = retailerSearchUrl(product)
  if (!fallback || fallback === '#') {
    errors.push(`${where}: no productUrl AND no retailerSearchUrl mapping for vendor "${product.vendor}" — this item dead-ends`)
  }
}

console.log(`Checked ${catalog.length} products for a working outbound link.`)
if (errors.length) {
  console.error(`\n${errors.length} issue(s) found:\n`)
  errors.forEach((e) => console.error(' - ' + e))
  process.exit(1)
}
console.log('Every product resolves to a real destination — no dead links.')
