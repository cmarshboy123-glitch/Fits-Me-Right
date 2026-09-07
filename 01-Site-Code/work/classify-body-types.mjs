// Every product in the catalog currently lists ALL six body types for its
// gender, which makes the "Body type" filter purely decorative — it never
// actually narrows anything. This assigns each product a realistic subset
// based on its actual silhouette (category + name keywords), the way a
// stylist would recommend a cut, so the filter genuinely filters.
//
// Body-neutral categories (Shoes, Jewelry, Accessories) keep every body
// type — a shoe or a necklace doesn't have a body-type-specific fit the
// way a garment's cut does, so universal fit there is correct, not a bug.

const womenFits = ['Straight', 'Curvy', 'Athletic', 'Petite', 'Tall', 'Plus']
const menFits = ['Slim', 'Regular', 'Athletic', 'Broad', 'Big & Tall', 'Short']

const fittedWomen = ['Straight', 'Athletic', 'Petite', 'Tall']
const relaxedWomen = ['Curvy', 'Plus', 'Petite', 'Tall']
const structuredWomen = ['Straight', 'Athletic', 'Tall']
const broadWomen = ['Curvy', 'Plus', 'Tall']
const universalWomen = ['Straight', 'Curvy', 'Athletic', 'Plus']

const fittedMen = ['Slim', 'Athletic', 'Regular']
const relaxedMen = ['Regular', 'Big & Tall', 'Short']
const structuredMen = ['Broad', 'Athletic', 'Regular']
const universalMen = ['Slim', 'Regular', 'Athletic', 'Broad']

const relaxedKeywords = /wide[- ]leg|palazzo|relaxed|oversized|wrap|a-line|flowy|pleated|flare|barrel|utility|trench|chunky|bermuda|boyfriend/i
const fittedKeywords = /skinny|slim|bodycon|column|sheath|pencil|fitted|tailored|structured|slim-fit|straight[- ]leg/i
const bigTallKeywords = /relaxed|big|tall|oversized|down|puffer/i

const bodyNeutralCategories = new Set(['Shoes', 'Jewelry', 'Accessories'])

export function classifyBodyType(product) {
  const category = product.category
  const gender = product.gender
  const name = product.name || ''

  if (gender === 'Children' || bodyNeutralCategories.has(category)) {
    return gender === 'Men' ? menFits : gender === 'Women' ? womenFits : product.bodyType
  }

  const isWomen = gender === 'Women'
  const fitted = isWomen ? fittedWomen : fittedMen
  const relaxed = isWomen ? relaxedWomen : relaxedMen
  const structured = isWomen ? structuredWomen : structuredMen
  const broad = isWomen ? broadWomen : null
  const universal = isWomen ? universalWomen : universalMen

  // Function-first categories fit broadly regardless of cut.
  if (['Activewear', 'Swimwear', 'Intimates', 'Shorts'].includes(category)) return universal

  // Suits and tailored outerwear read structured.
  if (['Suits'].includes(category)) return structured
  if (category === 'Outerwear') return fittedKeywords.test(name) ? structured : relaxed

  if (relaxedKeywords.test(name)) return isWomen ? (broad ?? relaxed) : relaxed
  if (fittedKeywords.test(name)) return fitted
  if (bigTallKeywords.test(name) && !isWomen) return relaxed

  // Category-level defaults when the name doesn't give a strong cue.
  if (['Dresses', 'Skirts'].includes(category)) return isWomen ? relaxed : universal
  if (['Jeans', 'Pants'].includes(category)) return fitted
  if (['Tops', 'Knitwear'].includes(category)) return fitted

  return universal
}
