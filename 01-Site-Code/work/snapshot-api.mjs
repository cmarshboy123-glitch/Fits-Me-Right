// Refreshes src/data/apiSnapshot.json: the real (non-sample) items from the product API, kept in the site as a
// fallback for when the API cannot be reached (for example the private preview, whose address the API does not
// allow, or a sleeping server). Run: node work/snapshot-api.mjs
import fs from 'node:fs'

const API = 'https://fits-me-right-api-6d1474833fcd.herokuapp.com/api/products'
const items = await (await fetch(API)).json()
if (!Array.isArray(items) || items.length === 0) throw new Error('The API returned no products; the snapshot was not changed.')

// Real items only: they carry the store's own product page. Sample listings stay hidden by default anyway.
const real = items.filter((product) => product.productUrl).map(({ createdAt, updatedAt, ...rest }) => rest)
fs.writeFileSync(new URL('../src/data/apiSnapshot.json', import.meta.url), `${JSON.stringify(real)}\n`)
console.log(`Saved ${real.length} real items (of ${items.length} from the API) on ${new Date().toISOString().slice(0, 10)}.`)
