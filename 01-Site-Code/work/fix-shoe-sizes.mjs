// Every Shoes-category product listed generic clothing sizes (XXS-4XL,
// 00-24W) instead of actual shoe sizes — a real accuracy bug, not just an
// Activewear/body-type one. Fixes it across all three data sources.
import fs from 'node:fs'
import verifiedProducts from '../src/data/verifiedProducts.js'
import marketplaceInventory from '../src/data/marketplaceInventory.js'

const shoeSizesWomen = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11']
const shoeSizesMen = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13']
const shoeSizesKids = ['10C', '11C', '12C', '13C', '1Y', '2Y', '3Y', '4Y', '5Y', '6Y']

function sizesFor(gender) {
  if (gender === 'Men') return shoeSizesMen
  if (gender === 'Children') return shoeSizesKids
  return shoeSizesWomen
}

// products.json: plain JSON, edit directly.
const jsonPath = new URL('../src/data/products.json', import.meta.url)
let raw = fs.readFileSync(jsonPath, 'utf8')
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1)
const mockProducts = JSON.parse(raw)
let jsonFixed = 0
const updatedMock = mockProducts.map((p) => {
  if (p.category !== 'Shoes') return p
  jsonFixed++
  const { shirtSizes, ...rest } = p
  return { ...rest, pantsSizes: sizesFor(p.gender) }
})
fs.writeFileSync(jsonPath, '﻿' + JSON.stringify(updatedMock, null, 2).replace(/\n/g, '\r\n'), 'utf8')
console.log('products.json: fixed', jsonFixed, 'shoe entries')

// verifiedProducts.js / marketplaceInventory.js: text-patch like the body-type pass.
function patchSizesInFile(filePath, products) {
  let text = fs.readFileSync(filePath, 'utf8')
  const idAnchor = /(\{\s*\r?\n\s*id: (\d+),)/g
  const anchors = [...text.matchAll(idAnchor)]
  let patched = 0

  for (let i = anchors.length - 1; i >= 0; i--) {
    const id = Number(anchors[i][2])
    const start = anchors[i].index
    const end = i + 1 < anchors.length ? anchors[i + 1].index : text.length
    const product = products.find((p) => p.id === id)
    if (!product || product.category !== 'Shoes') continue

    let chunk = text.slice(start, end)
    const sizes = sizesFor(product.gender)
    const sizesLiteral = `[${sizes.map((s) => `'${s}'`).join(', ')}]`
    // Remove availableShirtSizes entirely (a shoe has no shirt size) and
    // replace availablePantsSizes with real shoe sizes.
    chunk = chunk.replace(/availableShirtSizes:\s*\[[^\]]*\],?\s*/, '')
    chunk = chunk.replace(/availablePantsSizes:\s*\[[^\]]*\]/, `availablePantsSizes: ${sizesLiteral}`)
    if (chunk !== text.slice(start, end)) {
      text = text.slice(0, start) + chunk + text.slice(end)
      patched++
    }
  }
  fs.writeFileSync(filePath, text, 'utf8')
  console.log(filePath.pathname.split('/').pop(), '- fixed', patched, 'shoe entries')
}

patchSizesInFile(new URL('../src/data/verifiedProducts.js', import.meta.url), verifiedProducts)
patchSizesInFile(new URL('../src/data/marketplaceInventory.js', import.meta.url), marketplaceInventory)
