export const shoppingColors = [
  { value: 'black', label: 'Black', swatch: '#171717', aliases: ['black', 'onyx', 'jet', 'pepper'] },
  { value: 'white', label: 'White', swatch: '#fffdfa', aliases: ['white', 'ivory', 'off white', 'off-white', 'eggshell', 'bone'] },
  { value: 'grey', label: 'Grey', swatch: '#8b8b86', aliases: ['grey', 'gray', 'silver grey', 'heather', 'charcoal', 'anthracite', 'graphite', 'pewter', 'basalt'] },
  { value: 'brown', label: 'Brown', swatch: '#6f442d', aliases: ['brown', 'chocolate', 'cocoa', 'camel', 'espresso', 'mocha', 'tan', 'taupe', 'tobacco', 'cognac', 'sienna', 'chestnut', 'teak', 'coffee', 'habana', 'tortoise', 'mink', 'carafe', 'palisander', 'walnut', 'mahogany'] },
  { value: 'beige', label: 'Beige & Cream', swatch: '#d8c6a4', aliases: ['beige', 'cream', 'sand', 'ecru', 'oatmeal', 'natural', 'khaki', 'champagne', 'nude', 'desert'] },
  { value: 'red', label: 'Red', swatch: '#a82c2c', aliases: ['red', 'burgundy', 'wine', 'maroon', 'crimson', 'scarlet', 'zinfandel', 'cherry'] },
  { value: 'orange', label: 'Orange', swatch: '#d46a22', aliases: ['orange', 'rust', 'terracotta', 'coral', 'peach'] },
  { value: 'yellow', label: 'Yellow', swatch: '#d8ad23', aliases: ['yellow', 'mustard', 'goldenrod', 'lemon', 'honey', 'butterscotch'] },
  { value: 'green', label: 'Green', swatch: '#446348', aliases: ['green', 'olive', 'sage', 'emerald', 'mint', 'khaki green', 'lime', 'thyme', 'forest', 'hunter'] },
  { value: 'blue', label: 'Blue', swatch: '#355b82', aliases: ['blue', 'navy', 'cobalt', 'teal', 'turquoise', 'aqua', 'indigo', 'mid wash', 'light wash', 'dark wash', 'raw denim'] },
  { value: 'purple', label: 'Purple', swatch: '#745282', aliases: ['purple', 'violet', 'lavender', 'lilac', 'plum'] },
  { value: 'pink', label: 'Pink', swatch: '#d78fa3', aliases: ['pink', 'rose', 'blush', 'fuchsia', 'magenta'] },
  { value: 'metallic', label: 'Metallic', swatch: '#b7aa8c', aliases: ['metallic', 'gold', 'silver', 'bronze', 'copper'] },
  { value: 'multi', label: 'Multicolor', swatch: 'linear-gradient(135deg,#b83b3b,#d6a72b,#3f7550,#496ba8)', aliases: ['multicolor', 'multi color', 'multi-color', 'print', 'printed', 'patterned', 'floral', 'assorted'] },
]

// So "hermes" finds "Hermès" — most people won't type the accent.
const stripDiacritics = (value) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '')
// So "tshirt" finds "T-Shirt" and "offwhite" finds "off-white" — most people
// don't type the hyphen, the way Google doesn't require one either.
const stripSeparators = (value) => value.replace(/[-_]+/g, '')
const normalize = (value) => stripSeparators(stripDiacritics(value.toLowerCase()))

// Order matters here too: category is decided by whichever entry's aliases
// appear first in this object, so a category whose aliases are all
// unambiguous nouns should come before one with broad style/activity
// adjectives — otherwise "running shoes" or "sports jacket" would get
// claimed by Activewear's "running"/"sport" before Shoes/Outerwear ever get
// a look at "shoes"/"jacket". Activewear's activity-adjective aliases are
// listed last for exactly that reason.
const rawCategoryAliases = {
  Jeans: ['jeans', 'jean', 'denim'],
  Pants: ['pants', 'pant', 'trousers', 'trouser', 'slacks', 'slack', 'chinos', 'chino', 'khakis', 'khaki', 'culottes', 'culotte'],
  Dresses: ['dress', 'dresses', 'gown'],
  Tops: ['shirt', 'shirts', 'blouse', 'blouses', 'top', 'tops', 'tee', 'tees', 't-shirt', 't-shirts', 'polo', 'polos'],
  Skirts: ['skirt', 'skirts', 'skort', 'skorts'],
  Shorts: ['shorts', 'short'],
  Outerwear: ['coat', 'coats', 'jacket', 'jackets', 'blazer', 'blazers', 'parka', 'parkas', 'trench', 'trenchcoat'],
  Knitwear: ['sweater', 'sweaters', 'jumper', 'jumpers', 'cardigan', 'cardigans', 'knitwear', 'hoodie', 'hoodies', 'sweatshirt', 'sweatshirts', 'crewneck', 'crewnecks'],
  Suits: ['suit', 'suits', 'tuxedo', 'tuxedos'],
  Swimwear: ['swimwear', 'swimsuit', 'swimsuits', 'bikini', 'bikinis', 'trunks'],
  Intimates: ['underwear', 'lingerie', 'bra', 'bras', 'briefs', 'boxers'],
  Shoes: [
    'shoe', 'shoes', 'footwear', 'sneaker', 'sneakers', 'trainer', 'trainers', 'boot', 'boots', 'loafer', 'loafers',
    'sandal', 'sandals', 'heel', 'heels', 'pump', 'pumps', 'slipper', 'slippers', 'slide', 'slides', 'clog', 'clogs',
    'mule', 'mules', 'oxford', 'oxfords', 'espadrille', 'espadrilles', 'flat', 'flats', 'moccasin', 'moccasins',
  ],
  Jewelry: ['jewelry', 'jewellery', 'earrings', 'necklace', 'bracelet', 'ring'],
  Accessories: ['accessory', 'accessories', 'belt', 'belts', 'scarf', 'scarves', 'hat', 'hats', 'bag', 'bags'],
  Activewear: ['activewear', 'sportswear', 'joggers', 'jogger', 'leggings', 'legging', 'tracksuit', 'tracksuits', 'athletic', 'athleisure', 'sport', 'sports', 'gym', 'workout', 'fitness', 'exercise', 'yoga', 'running'],
}
// Hyphens stripped once here so "tshirt" matches the "t-shirt" alias the
// same way it matches a hyphen-stripped source string.
const categoryAliases = Object.fromEntries(
  Object.entries(rawCategoryAliases).map(([category, aliases]) => [category, aliases.map(stripSeparators)]),
)

// Order matters: more specific multi-word phrases are listed before the
// single words they contain (e.g. "Business Casual" before "Casual") so a
// query like "business casual" is recognized as one dress code, not two.
const rawDressCodeAliases = {
  'Business Casual': ['business casual'],
  'Professional/Formal Business': ['professional formal business', 'professional business', 'formal business'],
  'Cocktail Dress': ['cocktail dress', 'cocktail'],
  'Black Tie': ['black tie', 'blacktie'],
  'Formal Attire': ['formal attire', 'formal wear', 'formalwear'],
  'Semi-Formal': ['semi formal', 'semiformal'],
  'Bohemian': ['bohemian', 'boho'],
  'Active Wear': ['active wear', 'activewear'],
  'Casual': ['casual'],
}
const dressCodeAliases = Object.fromEntries(
  Object.entries(rawDressCodeAliases).map(([dressCode, aliases]) => [dressCode, aliases.map(stripSeparators)]),
)

const normalizeSize = (size) => String(size).trim().toLowerCase().replace(/^0+(?=\d)/, '')

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const colorAliases = shoppingColors
  .flatMap((color) => color.aliases.map((alias) => ({ ...color, alias: stripSeparators(alias) })))
  .sort((a, b) => b.alias.length - a.alias.length)

// Colors repeat across thousands of products, so each distinct one is worked out once.
const colorFamilyCache = new Map()
export function productColorFamily(color = '') {
  const source = normalize(String(color))
  if (colorFamilyCache.has(source)) return colorFamilyCache.get(source)
  const family = colorAliases.find(({ alias }) => new RegExp(`\\b${escapeRegExp(alias)}\\b`).test(source))?.value || ''
  colorFamilyCache.set(source, family)
  return family
}

export const shoppingCategories = ['Pants', 'Jeans', 'Tops', 'Dresses', 'Skirts', 'Shorts', 'Outerwear', 'Knitwear', 'Suits', 'Activewear', 'Swimwear', 'Intimates', 'Shoes', 'Jewelry', 'Accessories']

// Shoe-type words in a query ("boots", "heels") narrow within the Shoes
// category. Category alone can't — every shoe is category Shoes — and product
// names don't always spell out the type ("Air Max Pulse" is a sneaker, a
// "Derby Shoe" is an oxford), so each type also lists the model/style words
// that imply it.
const shoeTypes = [
  { query: /\b(sneakers?|trainers?)\b/, name: /sneaker|trainer|runner|running|air max|air force|ultraboost|cloud|jordan|dunk|court|slip-on|cup/ },
  { query: /\bboots?\b/, name: /boot|chelsea|chukka|combat/ },
  { query: /\bloafers?\b/, name: /loafer|moccasin|monolith|penny/ },
  { query: /\bsandals?\b/, name: /sandal|slide|gizeh|arizona|slingback|thong/ },
  { query: /\b(heels?|pumps?)\b/, name: /heel|pump|stiletto|slingback|kitten/ },
  { query: /\bslippers?\b/, name: /slipper|scuff|tasman|tazz|slide/ },
  { query: /\bslides?\b/, name: /slide|slipper|scuff/ },
  { query: /\bclogs?\b/, name: /clog|boston/ },
  { query: /\bmules?\b/, name: /mule|clog|slide/ },
  { query: /\boxfords?\b/, name: /oxford|derby|brogue/ },
  { query: /\bespadrilles?\b/, name: /espadrille/ },
  { query: /\bflats?\b/, name: /flat|ballet|mary jane/ },
  { query: /\bmoccasins?\b/, name: /moccasin|loafer/ },
]
function shoeTypeMatches(product, raw) {
  const wanted = shoeTypes.find(({ query }) => query.test(raw.toLowerCase()))
  return !wanted || wanted.name.test(`${product.name} ${product.fitNote || ''}`.toLowerCase())
}

const kidsWords = /\b(kids?|children|childrens|child|boys?|girls?|toddlers?)'?s?\b/

// Conversational filler ("show me some nice purple clothing") carries no
// filtering signal and, worse, never appears verbatim in any product's
// fields — left in, a single stray word like "clothing" or "please" would
// zero out results for an otherwise perfectly reasonable search. Stripped
// from the leftover text after every structured signal (price/size/dress
// code/color/category) has already claimed its words.
const stopwordList = ['clothing', 'clothes', 'wear', 'wearing', 'apparel', 'items?', 'stuff', 'things', 'gear', 'outfits?', 'garments?', 'pieces?', 'products?', 'wardrobe', 'fashion', 'looks?', 'style', 'styles', 'some', 'any', 'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'to', 'with', 'nice', 'good', 'cool', 'cute', 'pretty', 'want', 'wanting', 'looking', 'need', 'needs', 'find', 'show', 'me', 'please', 'for', 'something', 'anything', 'cheap', 'affordable', 'inexpensive', 'expensive', 'pricey', 'trendy', 'stylish', 'quality', 'best', 'super', 'really', 'very', 'price', 'prices', 'priced']
const stopwords = new RegExp(`\\b(${stopwordList.join('|')})\\b`, 'gi')

export function parseShoppingIntent(input = '') {
  const source = normalize(input.trim()).replace(/\bmngo\b/g, 'mango')
  let remainder = source
  const maxMatch = source.match(/(?:under|below|less than|up to|max(?:imum)?(?: of)?)\s*\$?\s*(\d+(?:\.\d{1,2})?)/)
  const minMatch = source.match(/(?:over|above|more than|at least)\s*\$?\s*(\d+(?:\.\d{1,2})?)/)
  const sizeMatch = source.match(/(?:in\s+)?size\s*[:#-]?\s*([a-z0-9]+(?:\s*[x×]\s*[a-z0-9]+)?)/i)

  // Detected first, and excluded from the text color/category checks below —
  // otherwise "black tie" reads as color "black" plus leftover text "tie"
  // and silently drops every black-tie item that isn't literally black.
  let dressCodeAlias = ''
  const dressCodeEntry = Object.entries(dressCodeAliases).find(([, aliases]) => {
    const found = aliases.find((alias) => new RegExp(`\\b${alias}\\b`).test(source))
    if (found) dressCodeAlias = found
    return Boolean(found)
  })
  const dressCode = dressCodeEntry?.[0] || ''
  const sourceWithoutDressCode = dressCodeAlias ? source.replace(new RegExp(`\\b${escapeRegExp(dressCodeAlias)}\\b`, 'g'), ' ') : source

  const colorMatch = colorAliases.find(({ alias }) => new RegExp(`\\b${escapeRegExp(alias)}\\b`).test(sourceWithoutDressCode))
  const color = colorMatch?.value || ''
  // Category still checks the full source (not sourceWithoutDressCode) — a
  // dress code phrase like "cocktail dress" should narrow to actual dresses,
  // not just drop the category the way it drops color's false "black" match.
  const categoryEntry = Object.entries(categoryAliases).find(([, aliases]) => aliases.some((alias) => new RegExp(`\\b${alias}\\b`).test(source)))
  const category = categoryEntry?.[0]
  // The exact word that picked the category ("hoodie", "trouser"), so items that
  // literally contain it can be ranked above the rest of that category.
  const categoryWord = categoryEntry ? categoryEntry[1].find((alias) => new RegExp(`\\b${alias}\\b`).test(source)) : ''

  if (maxMatch) remainder = remainder.replace(maxMatch[0], ' ')
  if (minMatch) remainder = remainder.replace(minMatch[0], ' ')
  if (sizeMatch) remainder = remainder.replace(sizeMatch[0], ' ')
  if (dressCodeAlias) remainder = remainder.replace(new RegExp(`\\b${escapeRegExp(dressCodeAlias)}\\b`, 'g'), ' ')
  if (colorMatch) remainder = remainder.replace(new RegExp(`\\b${escapeRegExp(colorMatch.alias)}\\b`, 'g'), ' ')
  // Activewear is a broad bucket ("black joggers" shouldn't list every black
  // tank top), so a specific item word in it stays in the search as a word to match.
  const keepCategoryWord = category === 'Activewear' && ['joggers', 'jogger', 'leggings', 'legging', 'tracksuit', 'tracksuits'].includes(categoryWord)
  if (category) categoryAliases[category].forEach((alias) => { if (!(keepCategoryWord && alias === categoryWord)) remainder = remainder.replace(new RegExp(`\\b${alias}\\b`, 'g'), ' ') })

  // Conversational filler ("show me some nice purple clothing") carries no
  // filtering signal and, worse, never appears verbatim in any product's
  // fields — left in, a single stray word like "clothing" or "please" would
  // zero out results for an otherwise perfectly reasonable search. Stripped
  // here, after every structured signal (price/size/dress code/color/
  // category) has already claimed its words from remainder.
  const text = remainder
    .replace(/\$|\bdollars?\b|\bfor women\b|\bfor men\b|\bwomen'?s?\b|\bmen'?s?\b/gi, ' ')
    .replace(new RegExp(kidsWords.source, 'gi'), ' ')
    .replace(stopwords, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return {
    raw: input,
    text,
    color,
    category,
    categoryWord,
    dressCode,
    maxPrice: maxMatch ? Number(maxMatch[1]) : null,
    minPrice: minMatch ? Number(minMatch[1]) : null,
    size: sizeMatch ? normalizeSize(sizeMatch[1]) : '',
    gender: /\bwomen'?s?\b/.test(source) ? 'Women' : /\bmen'?s?\b/.test(source) ? 'Men' : kidsWords.test(source) ? 'Children' : '',
  }
}

// ---------------------------------------------------------------------------
// Matching and ranking
//
// A search is split into hard filters (color, category, price, size, gender,
// dress code) that must hold, and the leftover descriptive words ("barrel",
// "wide leg") that are scored. Scoring is forgiving the way a web search is:
// plurals match, small typos match, and related style words match, and the best
// matches come first.
// ---------------------------------------------------------------------------

// Related style words. A word in a group also finds the others in it, but at a
// lower score than the word itself. Kept tight on purpose, so a group never
// drags in unrelated items.
// Crude singular form, applied to both sides, so "trousers" finds "trouser" and "dresses" finds "dress".
const stem = (word) => {
  if (word.length <= 3 || /(ss|us|is)$/.test(word)) return word
  if (/(sses|ches|shes|xes)$/.test(word)) return word.slice(0, -2)
  return word.endsWith('s') ? word.slice(0, -1) : word
}

const synonymGroups = [
  ['barrel', 'horseshoe', 'balloon', 'curved leg'],
  ['baggy', 'slouchy', 'loose fit', 'oversized'],
  ['wide leg', 'palazzo', 'wide'],
  ['skinny', 'slim fit', 'narrow'],
  ['bootcut', 'flare', 'flared'],
  ['straight leg', 'straight'],
  ['cargo', 'utility'],
  ['jogger', 'sweatpants', 'sweat pants', 'track pants', 'trackpants'],
  ['hoodie', 'hooded sweatshirt'],
  ['tee', 't shirt', 'tshirt'],
  ['trainers', 'sneakers', 'kicks'],
  ['purse', 'handbag', 'bag'],
  ['sunglasses', 'shades'],
  ['blazer', 'sport coat'],
  ['pullover', 'sweater', 'jumper'],
  ['gown', 'evening dress'],
  ['bikini', 'swimsuit'],
  ['mom jeans', 'high rise jeans'],
  ['button down', 'button up'],
]

const termKey = (term) => (term.includes(' ') ? term : stem(term))
const cleanTerm = (term) => normalize(term).replace(/\s+/g, ' ')
const synonymIndex = new Map()
synonymGroups.forEach((group) => group.forEach((term) => {
  const key = termKey(cleanTerm(term))
  const others = group.filter((other) => other !== term).map(cleanTerm)
  synonymIndex.set(key, [...new Set([...(synonymIndex.get(key) || []), ...others])])
}))

const wordsOf = (value) => value.split(/[^a-z0-9]+/).filter(Boolean)

// Number of single-letter edits (insert, delete, change, or swap two neighbors)
// between two words, or Infinity once it can't stay within `limit`.
function editDistance(a, b, limit) {
  if (Math.abs(a.length - b.length) > limit) return Infinity
  let beforePrevious = null
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j += 1) {
      let value = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      if (beforePrevious && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, beforePrevious[j - 2] + 1)
      current[j] = value
      if (value < rowMin) rowMin = value
    }
    if (rowMin > limit) return Infinity
    beforePrevious = previous
    previous = current
  }
  return previous[b.length] <= limit ? previous[b.length] : Infinity
}

const withinEdits = (a, b, limit) => editDistance(a, b, limit) <= limit

const searchIndex = new WeakMap()
function indexOf(product) {
  let entry = searchIndex.get(product)
  if (entry) return entry
  const spacedName = stripDiacritics(String(product.name || '').toLowerCase()).replace(/[-_]+/g, ' ')
  const rest = stripDiacritics(`${product.brand || ''} ${product.vendor || ''} ${product.category || ''} ${product.color || ''} ${product.fitNote || ''} ${(product.dressCode || []).join(' ')} ${(product.bodyType || []).join(' ')}`.toLowerCase()).replace(/[-_]+/g, ' ')
  const nameWords = new Set(wordsOf(spacedName).map(stem))
  const restWords = new Set(wordsOf(rest).map(stem))
  entry = {
    spacedName,
    joinedName: spacedName.replace(/\s+/g, ''),
    nameWords,
    restWords,
    joinedAll: `${spacedName} ${rest}`.replace(/\s+/g, ''),
    spacedAll: `${spacedName} ${rest}`,
  }
  searchIndex.set(product, entry)
  return entry
}

// How well one search word matches a product: 0 means not at all.
function scoreToken(entry, token) {
  const stemmed = stem(token)
  if (entry.nameWords.has(stemmed)) return 3
  if (entry.joinedName.includes(token)) return 2.5
  if (entry.restWords.has(stemmed) || entry.joinedAll.includes(token)) return 1

  const related = synonymIndex.get(stemmed) || []
  for (const term of related) {
    if (entry.spacedName.includes(term) || entry.joinedName.includes(term.replace(/\s+/g, ''))) return 1.6
  }
  for (const term of related) {
    if (entry.spacedAll.includes(term)) return 0.7
  }

  // Typos: only for words long enough that a one- or two-letter slip is unambiguous.
  if (token.length >= 4) {
    const limit = token.length >= 8 ? 2 : 1
    for (const word of entry.nameWords) if (withinEdits(stemmed, word, limit)) return 1.3
    for (const word of entry.restWords) if (withinEdits(stemmed, word, limit)) return 0.6
  }
  return 0
}

// The shared multi-word phrases ("wide leg", "mom jeans") get a chance to be treated as one unit.
function searchTokens(intent) {
  return intent.text.split(/\s+/).filter((token) => token.length > 1)
}

// Products are filed under one category, but shoppers don't think that way: joggers
// filed under Activewear are still pants, and a zip hoodie filed under Activewear
// is still a sweatshirt. A product in a neighboring category counts when its own
// name uses one of the category's words ("Tapered Jogger Pant" for "pants").
// Short, ambiguous words ("short", as in short sleeve) are left out on purpose.
const categoryNeighbors = {
  Pants: ['Jeans', 'Activewear', 'Bottoms'],
  Jeans: ['Pants', 'Bottoms'],
  Knitwear: ['Activewear', 'Outerwear', 'Tops'],
  Tops: ['Knitwear', 'Activewear'],
  Outerwear: ['Activewear', 'Knitwear', 'Suits'],
  Activewear: ['Pants', 'Knitwear', 'Tops'],
}

function inCategory(product, intent) {
  if (!intent.category || product.category === intent.category) return true
  if (intent.category === 'Jeans' && ['Bottoms', 'Pants'].includes(product.category) && indexOf(product).joinedAll.includes('jean')) return true
  if (intent.category === 'Pants' && ['Bottoms', 'Jeans'].includes(product.category)) return true

  if (!(categoryNeighbors[intent.category] || []).includes(product.category)) return false
  const { nameWords } = indexOf(product)
  return categoryAliases[intent.category].some((alias) => alias.length >= 3 && nameWords.has(stem(alias)))
}

function passesFilters(product, intent, { ignoreColor = false } = {}) {
  const sizes = [...(product.availablePantsSizes || []), ...(product.availableShirtSizes || [])].map(normalizeSize)
  return (ignoreColor || !intent.color || productColorFamily(product.color) === intent.color) &&
    inCategory(product, intent) &&
    (!intent.dressCode || (product.dressCode || []).includes(intent.dressCode)) &&
    (intent.maxPrice == null || product.price < intent.maxPrice) &&
    (intent.minPrice == null || product.price > intent.minPrice) &&
    (!intent.size || sizes.includes(intent.size)) &&
    (!intent.gender || product.gender === intent.gender) &&
    (intent.category !== 'Shoes' || !intent.raw || shoeTypeMatches(product, intent.raw))
}

// Returns null when the product fails a filter or matches none of the words,
// otherwise a score (higher is better) and whether every word matched.
function scoreProduct(product, intent, tokens, options) {
  if (!passesFilters(product, intent, options)) return null

  const entry = indexOf(product)
  // "hoodie" selects the whole Knitwear category, but items literally called a
  // hoodie should come before the cardigans.
  const categoryBonus = intent.categoryWord && (entry.nameWords.has(stem(intent.categoryWord)) || entry.joinedName.includes(intent.categoryWord)) ? 4 : 0
  if (tokens.length === 0) return { score: 1 + categoryBonus, matchedAll: true }

  let total = 0
  let matched = 0
  for (const token of tokens) {
    const value = scoreToken(entry, token)
    if (value > 0) { total += value; matched += 1 }
  }
  if (matched === 0) return null

  const matchedAll = matched === tokens.length
  const phrase = tokens.length > 1 && entry.spacedName.includes(tokens.join(' ')) ? 2 : 0
  return { score: total + (matchedAll ? 3 : 0) + phrase + categoryBonus, matchedAll }
}

// "Did you mean": swaps words that appear nowhere in the catalog for the closest
// word that does ("dresess" becomes "dresses"), preferring the commonest one.
const grammarWords = ['under', 'over', 'below', 'above', 'than', 'less', 'more', 'least', 'size', 'max', 'maximum', 'women', 'womens', 'men', 'mens', 'kids', 'boys', 'girls']
const knownWords = new Set([
  ...grammarWords,
  ...stopwordList.map((word) => word.replace('?', '')),
  ...Object.values(rawCategoryAliases).flat(),
  ...Object.values(rawDressCodeAliases).flat().flatMap((phrase) => phrase.split(' ')),
  ...shoppingColors.flatMap((color) => color.aliases.flatMap((alias) => alias.split(/[ -]/))),
].map((word) => stripSeparators(word.toLowerCase())))

const vocabularyCache = new WeakMap()
function vocabularyOf(products) {
  let vocabulary = vocabularyCache.get(products)
  if (vocabulary) return vocabulary
  vocabulary = new Map()
  // The words the search itself understands (categories, colors) are valid
  // corrections too, even when no product name happens to spell them that way.
  for (const word of knownWords) if (word.length >= 4) vocabulary.set(word, 500)
  for (const product of products) {
    for (const word of wordsOf(stripDiacritics(String(product.name || '').toLowerCase()))) {
      if (word.length >= 3) vocabulary.set(word, (vocabulary.get(word) || 0) + 1)
    }
  }
  vocabularyCache.set(products, vocabulary)
  return vocabulary
}

function correctQuery(products, query) {
  const vocabulary = vocabularyOf(products)
  let changed = false
  const corrected = stripDiacritics(query.toLowerCase()).split(/(\s+)/).map((part) => {
    const word = part.replace(/[^a-z']/g, '')
    if (word.length < 4 || part !== word || /\d/.test(part)) return part
    const plain = stripSeparators(word)
    if (vocabulary.has(plain) || vocabulary.has(stem(plain)) || knownWords.has(plain) || knownWords.has(stem(plain))) return part

    const limit = plain.length >= 8 ? 2 : 1
    let best = null
    for (const [candidate, count] of vocabulary) {
      if (candidate.length < 4) continue
      const distance = editDistance(plain, candidate, limit)
      if (distance === Infinity) continue
      if (!best || distance < best.distance || (distance === best.distance && count > best.count)) best = { candidate, count, distance }
    }
    if (best) { changed = true; return best.candidate }
    return part
  }).join('')
  return { query: changed ? corrected : query, changed }
}

export function productMatchesIntent(product, intent) {
  return scoreProduct(product, intent, searchTokens(intent)) !== null
}

const byScore = (a, b) => b.score - a.score

// A Google-style search over the catalog. Tries the strict reading first (every
// word matches); if that finds nothing it loosens the search step by step and
// says what it dropped, rather than showing an empty page.
export function searchCatalog(products, rawQuery) {
  const { query, changed } = correctQuery(products, rawQuery)
  const correctedQuery = changed ? query : null
  const intent = parseShoppingIntent(query)
  const tokens = searchTokens(intent)

  const scored = []
  for (const product of products) {
    const result = scoreProduct(product, intent, tokens)
    if (result) scored.push({ product, ...result })
  }

  const everyWord = scored.filter((item) => item.matchedAll)
  const strict = tokens.length > 1 && everyWord.length > 0 ? everyWord : scored
  if (strict.length > 0) {
    return { intent, correctedQuery, results: strict.sort(byScore).map((item) => item.product), relaxed: null, partial: strict === scored && tokens.length > 1 }
  }

  // Loosening only makes sense when something besides the unmatched words is
  // left to search on. Otherwise "dropping the word" would just list everything.
  const hasOtherFilters = Boolean(intent.color || intent.category || intent.dressCode || intent.maxPrice != null || intent.minPrice != null || intent.size || intent.gender)
  if (tokens.length > 0 && hasOtherFilters) {
    const withoutWords = products.filter((product) => passesFilters(product, intent))
    if (withoutWords.length > 0) return { intent, correctedQuery, results: withoutWords, relaxed: { dropped: [intent.text] }, partial: false }

    if (intent.color) {
      const withoutColor = products.filter((product) => passesFilters(product, intent, { ignoreColor: true }))
      if (withoutColor.length > 0) return { intent, correctedQuery, results: withoutColor, relaxed: { dropped: [intent.text, intent.color] }, partial: false }
    }
  }

  return { intent, correctedQuery, results: [], relaxed: null, partial: false }
}

// ---------------------------------------------------------------------------
// Live web listings
//
// Google Shopping returns whatever it likes for a query, so "grey henley" can come
// back with olive and black ones. These checks keep only the listings that fit the
// words that were actually typed: right color, right garment, right gender, right price.
// Titles often leave the color out, so a listing that names no color is kept but marked,
// and ones that confirm the searched color come first.
// ---------------------------------------------------------------------------
const colorFamilyPatterns = shoppingColors.map(({ value, aliases }) => [
  value,
  new RegExp(`\\b(${aliases.map((alias) => escapeRegExp(stripSeparators(alias.toLowerCase()))).join('|')})\\b`),
])

function titleHasWord(title, words, token) {
  const stemmed = stem(token)
  if (words.has(stemmed) || title.includes(token)) return true
  for (const term of synonymIndex.get(stemmed) || []) {
    if (title.includes(term) || title.includes(term.replace(/\s+/g, ''))) return true
  }
  if (token.length >= 5) {
    const limit = token.length >= 8 ? 2 : 1
    for (const word of words) if (withinEdits(stemmed, word, limit)) return true
  }
  return false
}

export function filterWebResults(results, intent) {
  const tokens = searchTokens(intent)
  const confirmsColor = (result) => {
    if (!intent.color) return true
    const title = normalize(String(result.title || ''))
    return colorFamilyPatterns.some(([value, pattern]) => value === intent.color && pattern.test(title))
  }

  const kept = results.filter((result) => {
    const title = normalize(String(result.title || ''))
    const words = new Set(wordsOf(stripDiacritics(String(result.title || '').toLowerCase()).replace(/[-_]+/g, ' ')).map(stem))
    for (const word of wordsOf(title)) words.add(stem(word))

    if (intent.color) {
      const mentioned = colorFamilyPatterns.filter(([, pattern]) => pattern.test(title)).map(([value]) => value)
      if (mentioned.length > 0 && !mentioned.includes(intent.color)) return false
    }
    if (intent.gender === 'Women' && /\bmen'?s?\b/.test(title) && !/\bwomen/.test(title)) return false
    if (intent.gender === 'Men' && /\bwomen/.test(title)) return false
    if (result.price != null && intent.maxPrice != null && result.price > intent.maxPrice) return false
    if (result.price != null && intent.minPrice != null && result.price < intent.minPrice) return false

    if (tokens.length > 0) return tokens.some((token) => titleHasWord(title, words, token))
    if (intent.category) return categoryAliases[intent.category].some((alias) => words.has(stem(alias)) || title.includes(alias))
    return true
  })

  return kept
    .map((result) => ({ ...result, colorConfirmed: confirmsColor(result) }))
    .sort((a, b) => Number(b.colorConfirmed) - Number(a.colorConfirmed))
}

export function intentLabels(intent) {
  return [
    intent.color && `${intent.color[0].toUpperCase()}${intent.color.slice(1)}`,
    intent.category,
    intent.dressCode,
    intent.maxPrice != null && `Under $${intent.maxPrice}`,
    intent.minPrice != null && `Above $${intent.minPrice}`,
    intent.size && `Size ${intent.size.toUpperCase()}`,
    intent.gender,
    intent.text && `“${intent.text}”`,
  ].filter(Boolean)
}
