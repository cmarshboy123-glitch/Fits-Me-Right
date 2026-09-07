// One-time (and re-runnable) migration: loads the 124 products currently
// bundled into the frontend's static data files and writes them into
// Postgres. Safe to re-run — each product is upserted by its existing id.
//
// Usage:
//   npm run db:seed            (writes to whatever DATABASE_URL points at)
//   node prisma/seed.mjs --dry-run   (prints what would be written, no DB needed)
import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const siteDataDir = path.resolve(here, '..', '..', '01-Site-Code', 'src', 'data')

const { default: verifiedProducts } = await import(pathToFileURL(path.join(siteDataDir, 'verifiedProducts.js')).href)
const { default: marketplaceInventory } = await import(pathToFileURL(path.join(siteDataDir, 'marketplaceInventory.js')).href)
const mockProducts = JSON.parse(readFileSync(path.join(siteDataDir, 'products.json'), 'utf8').replace(/^﻿/, ''))

// Same field-name reconciliation catalogService.js does at runtime today —
// done once here instead, since the database will store one consistent shape.
function normalize(product) {
  return {
    id: product.id,
    name: product.name,
    gender: product.gender,
    category: product.category,
    price: product.price,
    priceTier: product.priceTier,
    imageUrl: product.imageUrl,
    vendor: product.vendor,
    brand: product.brand,
    color: product.color || '',
    storeTier: product.storeTier,
    bodyType: product.bodyType || [],
    dressCode: product.dressCode || [],
    availableShirtSizes: product.availableShirtSizes || product.shirtSizes || [],
    availablePantsSizes: product.availablePantsSizes || product.pantsSizes || [],
    productUrl: product.productUrl || null,
    verifiedAt: product.verifiedAt || null,
    fitNote: product.fitNote || null,
  }
}

const allProducts = [...verifiedProducts, ...marketplaceInventory, ...mockProducts].map(normalize)

const dryRun = process.argv.includes('--dry-run')

if (dryRun) {
  console.log(`Dry run — ${allProducts.length} products would be written. Sample:`)
  console.log(JSON.stringify(allProducts[0], null, 2))
  console.log('...')
  console.log(JSON.stringify(allProducts[allProducts.length - 1], null, 2))
  process.exit(0)
}

const { prisma } = await import('../src/lib/prisma.js')

let count = 0
for (const product of allProducts) {
  await prisma.product.upsert({
    where: { id: product.id },
    create: product,
    update: product,
  })
  count++
}

console.log(`Seeded ${count} products.`)
await prisma.$disconnect()
