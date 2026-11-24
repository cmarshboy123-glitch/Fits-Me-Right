import { isDollar } from './currency'
import { parseShoppingIntent, productColorFamily, shoppingColors } from './searchIntent'

// "Find my match": turns a description of one specific item into ranked, real products from our catalogue.
//
// How it works (and what it cannot do):
//   1. Understand: read the shopper's fields and free text into attributes (item, color, brand, material,
//      fit, style, design details, price range, size, collection). Only the attributes they filled in count.
//   2. Retrieve: look only at real catalogue items (they have a store page and a price). Nothing is invented.
//   3. Rank: score each item 0-100 against the attributes that were requested, and say what matched and what differs.
//   4. Validate: every result carries the real product id, price, store page and the listing's own sizes.
// We compare text (name, color, brand, listed sizes, notes). We do NOT compare photos and we cannot see stock,
// so results never claim an item is available: the store confirms that.

const STOP = new Set(['a', 'an', 'the', 'with', 'and', 'or', 'of', 'in', 'on', 'for', 'to', 'that', 'has', 'have', 'is', 'are', 'very', 'slightly', 'similar'])

const SYNONYMS = {
  cream: ['cream', 'ivory', 'ecru', 'vanilla', 'champagne', 'oatmeal', 'offwhite', 'bone'],
  ivory: ['ivory', 'cream', 'ecru', 'offwhite'],
  crop: ['crop', 'cropped', 'short', 'boxy'],
  tweed: ['tweed', 'boucle', 'bouclé', 'herringbone', 'textured'],
  button: ['button', 'buttoned', 'buttons'],
  gold: ['gold', 'golden', 'brass'],
  silver: ['silver', 'metallic'],
  leather: ['leather', 'nappa', 'calfskin', 'suede', 'patent'],
  silk: ['silk', 'satin', 'charmeuse'],
  satin: ['satin', 'silk'],
  wool: ['wool', 'cashmere', 'merino', 'mohair', 'barathea'],
  cashmere: ['cashmere', 'wool'],
  linen: ['linen', 'flax'],
  cotton: ['cotton', 'poplin', 'twill', 'jersey'],
  denim: ['denim', 'jean', 'jeans'],
  tailor: ['tailor', 'tailored', 'structured', 'fitted'],
  slim: ['slim', 'skinny', 'fitted', 'narrow'],
  oversize: ['oversize', 'oversized', 'relaxed', 'loose', 'boxy'],
  relax: ['relax', 'relaxed', 'loose', 'easy'],
  mini: ['mini', 'short'],
  midi: ['midi', 'tea'],
  maxi: ['maxi', 'long', 'floor', 'gown'],
  sleeveless: ['sleeveless', 'strapless', 'tank'],
  halter: ['halter', 'halterneck'],
  floral: ['floral', 'flower', 'print', 'printed'],
  stripe: ['stripe', 'striped', 'pinstripe'],
  vintage: ['vintage', 'retro', 'classic'],
  minimalist: ['minimalist', 'minimal', 'clean', 'simple'],
  classic: ['classic', 'timeless', 'traditional'],
  boot: ['boot', 'boots', 'bootie'],
  heel: ['heel', 'heels', 'pump', 'stiletto'],
  handbag: ['handbag', 'bag', 'clutch', 'tote', 'purse', 'satchel', 'shoulder'],
}

const stem = (word) => (word.length > 3 && word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word)
const norm = (text) => String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const tokensOf = (text) => norm(text).split(/[^a-z0-9]+/).filter(Boolean).map(stem)

const SIZE_WORDS = { 'extra small': 'XS', small: 'S', medium: 'M', large: 'L', 'extra large': 'XL', xxl: '2XL', xxxl: '3XL' }
export function normalizeSize(size) {
  const raw = norm(size).trim()
  if (!raw) return ''
  if (SIZE_WORDS[raw]) return SIZE_WORDS[raw]
  return raw.replace(/\s+/g, '').toUpperCase()
}

// "cropped tweed, gold buttons and round neckline" -> [["crop","tweed"],["gold","button"],["round","neckline"]]
function phrasesOf(text) {
  return String(text || '')
    .split(/[,;\n]|\band\b/i)
    .map((phrase) => tokensOf(phrase).filter((token) => !STOP.has(token) && token.length > 1))
    .filter((tokens) => tokens.length > 0)
}

const alternatives = (token) => SYNONYMS[token] || SYNONYMS[stem(token)] || [token]

function tokenPresent(haystack, token) {
  return alternatives(token).some((option) => haystack.has(stem(norm(option))))
}

function priceNumber(value) {
  const parsed = Number(String(value || '').replace(/[^0-9.]/g, ''))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

// Turn the form into the attributes we actually score. Blank fields are simply not requested.
export function buildRequest(form) {
  const intent = parseShoppingIntent([form.description, form.item].filter(Boolean).join(' '))
  const colorIntent = form.color ? parseShoppingIntent(form.color) : null
  const category = form.category || intent.category || ''
  const colorFamily = colorIntent?.color || (form.color ? '' : intent.color) || ''
  // The exact shade words: from the color box, or, when the color came from the free text, the words in it
  // that name that color ("black", "ivory"), so a plain "black" is an exact match, not just the same family.
  const familyAliases = new Set(shoppingColors.find((color) => color.value === colorFamily)?.aliases.flatMap((alias) => tokensOf(alias)) || [])
  const colorWords = form.color
    ? tokensOf(form.color).filter((token) => !STOP.has(token) && !['light', 'dark', 'pale', 'deep', 'soft'].includes(token))
    : tokensOf([form.description, form.item].filter(Boolean).join(' ')).filter((token) => familyAliases.has(token))
  // Words from the free-text description that no other field claimed are treated as design details.
  const leftover = intent.text ? intent.text : ''
  return {
    category,
    itemWord: intent.categoryWord ? stem(norm(intent.categoryWord)) : '',
    gender: form.gender || intent.gender || '',
    colorFamily,
    colorLabel: form.color || (colorFamily ? shoppingColors.find((color) => color.value === colorFamily)?.label : '') || '',
    colorWords,
    brand: norm(form.brand).trim(),
    material: phrasesOf(form.material),
    fit: phrasesOf(form.fit),
    style: phrasesOf(form.style),
    details: phrasesOf([form.details, leftover].filter(Boolean).join(', ')),
    minPrice: priceNumber(form.minPrice) ?? intent.minPrice ?? null,
    maxPrice: priceNumber(form.maxPrice) ?? intent.maxPrice ?? null,
    size: normalizeSize(form.size || intent.size),
  }
}

export function describeRequest(request) {
  const parts = []
  if (request.category) parts.push(request.category)
  if (request.colorLabel) parts.push(request.colorLabel)
  if (request.brand) parts.push(`brand “${request.brand}”`)
  ;[['material', 'material'], ['fit', 'fit'], ['style', 'style'], ['details', 'details']].forEach(([key, label]) => {
    if (request[key].length) parts.push(`${label}: ${request[key].map((tokens) => tokens.join(' ')).join(', ')}`)
  })
  if (request.minPrice != null || request.maxPrice != null) parts.push(`price ${request.minPrice != null ? `$${request.minPrice}` : '$0'}–${request.maxPrice != null ? `$${request.maxPrice}` : 'any'}`)
  if (request.size) parts.push(`size ${request.size}`)
  if (request.gender) parts.push(request.gender)
  return parts
}

export const hasRequirements = (request) => describeRequest(request).length > 0

const WEIGHTS = { category: 25, color: 20, details: 20, brand: 12, price: 10, size: 10, material: 8, fit: 8, style: 7 }


function termScore(haystack, phrases) {
  if (phrases.length === 0) return null
  let earned = 0
  const missing = []
  const found = []
  phrases.forEach((tokens) => {
    const hit = tokens.filter((token) => tokenPresent(haystack, token))
    earned += hit.length / tokens.length
    if (hit.length === tokens.length) found.push(tokens.join(' '))
    else missing.push(tokens.join(' '))
  })
  return { fraction: earned / phrases.length, found, missing }
}

function scoreProduct(product, request) {
  if (!product.productUrl || !product.id || !(product.price > 0)) return null
  if (request.gender && product.gender !== request.gender) return null

  const haystack = new Set(tokensOf(`${product.name} ${product.fitNote || ''} ${product.color || ''} ${product.brand || ''} ${product.vendor || ''} ${product.category || ''}`))
  const nameTokens = new Set(tokensOf(product.name))
  const matched = []
  const differences = []
  let earned = 0
  let possible = 0
  const add = (key, fraction) => { possible += WEIGHTS[key]; earned += WEIGHTS[key] * fraction }

  // Item type: the same garment category is required; the item word in the name confirms it.
  if (request.category) {
    const sameCategory = product.category === request.category
    const nameHasItem = request.itemWord ? nameTokens.has(request.itemWord) || alternatives(request.itemWord).some((option) => nameTokens.has(stem(norm(option)))) : false
    if (!sameCategory && !nameHasItem) return null
    if (sameCategory) {
      add('category', request.itemWord ? (nameHasItem ? 1 : 0.6) : 1)
      matched.push(`Same kind of item (${product.category}${nameHasItem ? `, named as a ${request.itemWord}` : ''})`)
      if (request.itemWord && !nameHasItem) differences.push(`The name doesn’t say “${request.itemWord}”, though it is filed under ${product.category}`)
    } else {
      add('category', 0.5)
      differences.push(`Filed under ${product.category}, not ${request.category}, but the name mentions “${request.itemWord}”`)
    }
  }

  // Price range: only dollar prices can be compared to a dollar range.
  if (request.minPrice != null || request.maxPrice != null) {
    if (!isDollar(product)) return null
    if (request.maxPrice != null && product.price > request.maxPrice) return null
    if (request.minPrice != null && product.price < request.minPrice) return null
    add('price', 1)
    matched.push('Price is inside your range')
  }

  // Color: the exact shade word is best, the same color family is close.
  if (request.colorFamily || request.colorWords.length) {
    // Whole words only: "bone" must not match inside "herringbone".
    const colorTokens = new Set(tokensOf(product.color))
    const shadeHit = request.colorWords.some((word) => alternatives(word).some((option) => colorTokens.has(stem(norm(option))) || nameTokens.has(stem(norm(option)))))
    const familyHit = request.colorFamily && productColorFamily(product.color) === request.colorFamily
    if (shadeHit) { add('color', 1); matched.push(`Color: ${product.color || 'as named'}`) }
    else if (familyHit) { add('color', 0.75); matched.push(`Color: ${product.color} (same color family as ${request.colorLabel})`) }
    else { add('color', 0); differences.push(`Color is ${product.color || 'not stated'}, not ${request.colorLabel}`) }
  }

  if (request.brand) {
    const brandTokens = new Set(tokensOf(`${product.brand || ''} ${product.vendor || ''}`))
    if (tokensOf(request.brand).every((token) => brandTokens.has(token))) { add('brand', 1); matched.push(`Brand or store: ${product.brand || product.vendor}`) }
    else { add('brand', 0); differences.push(`Not by ${request.brand} (it is ${product.brand || product.vendor})`) }
  }

  for (const [key, label] of [['material', 'Material'], ['fit', 'Fit'], ['style', 'Style'], ['details', 'Design detail']]) {
    const result = termScore(haystack, request[key])
    if (!result) continue
    add(key, result.fraction)
    result.found.forEach((term) => matched.push(`${label} “${term}” appears in the listing`))
    result.missing.forEach((term) => differences.push(`${label} “${term}” isn’t stated in the listing, so we can’t confirm it`))
  }

  // Size: only the sizes the listing itself shows.
  const listed = [...(product.availableShirtSizes || []), ...(product.availablePantsSizes || [])].map(normalizeSize)
  if (request.size) {
    if (listed.length === 0) { add('size', 0.5); differences.push('No sizes are listed here, so check the store for your size') }
    else if (listed.includes(request.size)) { add('size', 1); matched.push(`Listed sizes include ${request.size}`) }
    else { add('size', 0); differences.push(`Listed sizes (${[...new Set(listed)].join(', ')}) don’t include ${request.size}`) }
  }

  if (possible === 0) return null
  const score = Math.round((earned / possible) * 100)
  return { product, score, matched, differences, listedSizes: [...new Set([...(product.availableShirtSizes || []), ...(product.availablePantsSizes || [])])] }
}

// A match is called "exact" only when everything we are able to check lines up. Anything we could not check
// (for example a material the listing never mentions) keeps it in the "close alternatives" group.
export function rankProducts(products, request, limit = 12) {
  const results = []
  for (const product of products) {
    const scored = scoreProduct(product, request)
    if (scored && scored.score >= 35) results.push(scored)
  }
  results.sort((a, b) => b.score - a.score || (b.product.verifiedAt || '').localeCompare(a.product.verifiedAt || '') || a.product.price - b.product.price)
  return results.slice(0, limit).map((result) => ({ ...result, exact: result.score >= 95 && result.differences.length === 0 }))
}
