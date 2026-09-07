import verifiedProducts from '../src/data/verifiedProducts.js'
import marketplaceInventory from '../src/data/marketplaceInventory.js'
import mockProducts from '../src/data/products.json' with { type: 'json' }

const categoryFix = { Bottoms: 'Pants', Active: 'Activewear', Tailoring: 'Suits' }
const normalized = mockProducts.map((p) => ({ ...p, category: categoryFix[p.category] || p.category }))
const all = [...verifiedProducts, ...marketplaceInventory, ...normalized]

console.log('TOTAL:', all.length)

const categories = [...new Set(all.map((p) => p.category))].sort()
const genders = ['Women', 'Men', 'Children']
const tiers = ['budget', 'treat', 'splurge']

console.log('\n=== Coverage grid: category x gender x priceTier (count) ===')
for (const cat of categories) {
  for (const g of genders) {
    const row = tiers.map((t) => all.filter((p) => p.category === cat && p.gender === g && p.priceTier === t).length)
    if (row.some((n) => n > 0)) {
      console.log(cat.padEnd(12), g.padEnd(8), 'budget:', row[0], 'treat:', row[1], 'splurge:', row[2])
    }
  }
}

console.log('\n=== Missing category x gender combos entirely ===')
for (const cat of categories) {
  for (const g of genders) {
    const count = all.filter((p) => p.category === cat && p.gender === g).length
    if (count === 0) console.log('MISSING:', cat, g)
  }
}

console.log('\n=== Price/tier sanity check ===')
all.forEach((p) => {
  if (p.priceTier === 'splurge' && p.price < 150) console.log('LOW-PRICED SPLURGE:', p.id, p.name, p.price, p.category, p.gender)
  if (p.priceTier === 'budget' && p.price > 150) console.log('HIGH-PRICED BUDGET:', p.id, p.name, p.price, p.category, p.gender)
})

console.log('\n=== Activewear items specifically ===')
all.filter((p) => p.category === 'Activewear').forEach((p) => console.log(p.id, p.name, p.gender, p.priceTier, '$' + p.price, p.vendor, p.imageUrl))

console.log('\n=== bodyType distinctness check (sample) ===')
const bodyTypeSets = new Set(all.map((p) => JSON.stringify([...p.bodyType].sort())))
console.log('distinct bodyType arrays used across whole catalog:', bodyTypeSets.size)
console.log([...bodyTypeSets])
