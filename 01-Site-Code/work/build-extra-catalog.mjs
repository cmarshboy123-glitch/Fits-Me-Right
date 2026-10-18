// Builds public/catalog-extra.json: real, in-stock products from clothing stores that
// publish a public Shopify-style product feed (/products.json). Every item keeps the
// store's own name, price, photo and exact product page; nothing is invented.
//
//   node work/build-extra-catalog.mjs              fetch the feeds live
//   node work/build-extra-catalog.mjs --cache=DIR  reuse feeds saved earlier in DIR
//
// Re-run it to refresh prices and stock. Retailers don't publish body-type fit or dress
// codes, so those two fields are assigned generically (every body type for the gender;
// dress code guessed from the garment), and fitNote says where the data came from.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { productColorFamily, shoppingColors } from '../src/utils/searchIntent.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT = path.resolve(here, '..', 'public', 'catalog-extra.json')
const cacheArg = process.argv.find((arg) => arg.startsWith('--cache='))
const CACHE_DIR = cacheArg ? cacheArg.slice('--cache='.length) : ''
const CHECKED_ON = new Date().toISOString().slice(0, 10)
const FIRST_ID = 100000
const PER_STORE_CAP = 110
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const stores = [
  { name: 'Stüssy', base: 'https://www.stussy.com' },
  { name: 'Princess Polly', base: 'https://us.princesspolly.com' },
  { name: 'Kith', base: 'https://kith.com' },
  { name: 'Alo Yoga', base: 'https://www.aloyoga.com' },
  { name: 'Outdoor Voices', base: 'https://www.outdoorvoices.com' },
  { name: 'Taylor Stitch', base: 'https://www.taylorstitch.com' },
  { name: 'Faherty', base: 'https://fahertybrand.com' },
  { name: 'Everlane', base: 'https://www.everlane.com' },
  { name: 'Marine Layer', base: 'https://www.marinelayer.com' },
  { name: 'Pangaia', base: 'https://pangaia.com' },
  { name: 'Girlfriend Collective', base: 'https://girlfriend.com' },
  { name: 'Culture Kings', base: 'https://www.culturekings.com' },
  { name: 'Mack Weldon', base: 'https://mackweldon.com' },
]

const slugOf = (name) => name.replace(/[^a-z0-9]/gi, '_')

async function loadFeed(store) {
  if (CACHE_DIR) return JSON.parse(fs.readFileSync(path.join(CACHE_DIR, `${slugOf(store.name)}.json`), 'utf8'))
  const all = []
  for (let page = 1; page <= 6; page += 1) {
    const response = await fetch(`${store.base}/products.json?limit=250&page=${page}`, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) })
    if (!response.ok) break
    const { products = [] } = await response.json()
    all.push(...products)
    if (products.length < 250) break
    await new Promise((resolve) => setTimeout(resolve, 400))
  }
  return all
}

const tagsOf = (product) => (Array.isArray(product.tags) ? product.tags : String(product.tags || '').split(',')).map((tag) => tag.trim()).filter(Boolean)

// ---- gender -----------------------------------------------------------------
function genderOf(store, product, tags) {
  const type = String(product.product_type || '')
  const has = (pattern) => tags.some((tag) => pattern.test(tag))
  switch (store) {
    case 'Alo Yoga':
      if (/^women/i.test(type) || has(/^master-woman-all$/i)) return 'Women'
      if (/^men/i.test(type) || has(/^master-man-all$/i)) return 'Men'
      return ''
    case 'Culture Kings':
      if (has(/^gender-mens$/i)) return 'Men'
      if (has(/^gender-womens$/i)) return 'Women'
      if (has(/^gender-kids$/i)) return 'Children'
      return ''
    case 'Everlane':
      if (has(/^female$/i)) return 'Women'
      if (has(/^male$/i)) return 'Men'
      return ''
    case 'Faherty':
      if (/^kid/i.test(type) || has(/^age:Kids?$/i)) return 'Children'
      if (/^women/i.test(type) || has(/^division:Womens$/i)) return 'Women'
      if (/^men/i.test(type) || has(/^division:Mens$/i)) return 'Men'
      return ''
    case 'Girlfriend Collective':
    case 'Princess Polly':
      return 'Women'
    case 'Kith':
      if (has(/^kith womens?$/i)) return 'Women'
      if (has(/^kids$/i)) return 'Children'
      if (has(/^mens$|^ea\d+mens$|^mens_/i)) return 'Men'
      return ''
    case 'Mack Weldon':
    case 'Taylor Stitch':
      return 'Men'
    case 'Marine Layer':
      if (/^womens/i.test(type)) return 'Women'
      if (/^mens/i.test(type)) return 'Men'
      return ''
    case 'Outdoor Voices':
      if (has(/^(womens|woman)$/i)) return 'Women'
      if (has(/^(mens|man|men's)$/i)) return 'Men'
      return ''
    case 'Pangaia':
      if (has(/^gender:Women$/i)) return 'Women'
      if (has(/^gender:Men$/i)) return 'Men'
      if (has(/^gender:Kids$/i)) return 'Children'
      return ''
    case 'Stüssy':
      if (has(/^WOMENS$/i)) return 'Women'
      if (has(/^(MENS|UNISEX)$/i)) return 'Men'
      return ''
    default:
      return ''
  }
}

// ---- category ---------------------------------------------------------------
const rules = [
  ['skip', /gift ?card|e-?gift|sample|insurance|shipping|bundle|sticker|poster|candle|\bmug\b|keychain|phone case|fragrance|perfume|skateboard|\bdeck\b|\bbook\b|vinyl|lighter|towel|blanket|pillow|customi[sz]ation|\bpatch\b|\bpin\b|\bkit\b/i],
  ['Accessories', /\bsocks?\b/i],
  ['Shoes', /sneaker|trainer|\bboots?\b|sandal|loafer|\bslides?\b|clog|\bmules?\b|flip.?flop|footwear|\bshoes?\b/i],
  ['Jewelry', /necklace|earring|bracelet|\brings?\b|pendant|anklet/i],
  ['Accessories', /\b(cap(?! sleeve)|hat|beanie|snapback|strapback|bucket|visor|socks?|bag|tote|backpack|belt|scarf|gloves?|wallet|sunglass(es)?|headband|bandana|duffle|pouch|crossbody|lanyard|umbrella|balaclava|neck gaiter)\b/i],
  ['Swimwear', /swim|bikini|trunks|boardshort|rash ?guard/i],
  ['Intimates', /underwear|\bbriefs?\b|\bboxers?\b(?! ?(short|pant))|bralette|\bthong\b|panty|panties|lingerie|undershirt/i],
  ['Activewear', /sports? bra|legging|bike short|tracksuit|\bbra\b/i],
  ['Outerwear', /jacket|\bcoat|overcoat|parka|puffer|anorak|windbreaker|trench|bomber|blazer|shacket|poncho|\bcape\b|gilet/i],
  ['Knitwear', /sweater|cardigan|hoodie|sweatshirt|crewneck|crew neck|pullover|jumper|turtleneck|fleece/i],
  ['Outerwear', /\bvest\b/i],
  ['Jeans', /\bjeans?\b|\bdenim\b(?!.*(jacket|shirt|vest|top|dress|skirt|short|cap|hat|bag))/i],
  ['Skirts', /\bskirts?\b|\bskort/i],
  ['Shorts', /\bshorts?\b(?![ -]?sleeve)|sweatshorts/i],
  ['Dresses', /\bdress(es)?\b(?! (shirt|pant|sock|shoe|trouser|belt))|jumpsuit|playsuit|romper|\bgown\b|\bmuumuu\b/i],
  ['Pants', /\bpants?\b|trouser|chino|cargo|jogger|sweatpant|slacks?|culotte|\bbottoms?\b/i],
  ['Tops', /\btees?\b|t-shirt|shirt|\bcrop top|\btank\b|\bpolo\b|henley|blouse|\btop\b|bodysuit|\bcami|singlet|tube|\bknit\b/i],
]

// The product's own name is more reliable than the store's internal type field, so it
// is tried first and the type is only a fallback for names that say nothing ("Slim Jean" vs "Denim").
function categoryOf(title, type) {
  for (const text of [title, type]) {
    for (const [category, pattern] of rules) {
      if (pattern.test(text)) return category === 'skip' ? '' : category
    }
  }
  return ''
}

// ---- color ------------------------------------------------------------------
const colorWords = new Set(shoppingColors.flatMap((color) => color.aliases))
const titleCase = (value) => value.toLowerCase().replace(/(^|[\s/\-–])([a-z])/g, (_, a, b) => a + b.toUpperCase())

function colorOf(product, tags, variants) {
  const options = product.options || []
  const colorIndex = options.findIndex((option) => /colou?r/i.test(option.name))
  const raw = []
  if (colorIndex >= 0) {
    const value = variants.find((variant) => variant[`option${colorIndex + 1}`])?.[`option${colorIndex + 1}`]
    if (value) raw.push(value)
  }
  for (const tag of tags) {
    const match = tag.match(/^(?:primary )?colou?r(?:-family)?\s*[:\-]\s*(.+)$/i) || tag.match(/^(?:colorgroup|palette)\s*:\s*(.+)$/i)
    if (match) raw.push(match[1])
  }
  const titleTail = String(product.title).split(/\s+[-–—|]\s+|\s+in\s+/i).slice(1).join(' ')
  if (titleTail) raw.push(titleTail)

  for (const candidate of raw) {
    const clean = String(candidate).replace(/\s+/g, ' ').trim()
    if (clean && productColorFamily(clean)) return titleCase(clean.split(/[,]/)[0])
  }
  // Last resort: a color word in the product name itself ("Tynen Baggy Sweatshorts Grey Marle").
  const words = String(product.title).toLowerCase().split(/[^a-z]+/)
  const hit = words.find((word) => colorWords.has(word) && productColorFamily(word))
  return hit ? titleCase(hit) : ''
}

// ---- sizes ------------------------------------------------------------------
const LETTER = {
  xxs: 'XXS', xs: 'XS', s: 'S', m: 'M', l: 'L', xl: 'XL', xxl: '2XL', '2xl': '2XL', xxxl: '3XL', '3xl': '3XL', '4xl': '4XL',
  extrasmall: 'XS', small: 'S', medium: 'M', large: 'L', extralarge: 'XL',
}
const LETTER_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', 'ONE SIZE']

// "S", "Small", "XS - 36", "S || 2", "S/M" -> the letter sizes they stand for.
function letterSizesIn(raw) {
  const text = String(raw).trim()
  if (/^(one ?size|one|os|o\/s)$/i.test(text)) return ['ONE SIZE']
  const head = text.split(/\s*\|\||\s+-\s+\d/)[0].trim()
  return head.split(/\/|\s+-\s+/).map((part) => LETTER[part.toLowerCase().replace(/[\s-]+/g, '')]).filter(Boolean)
}

function numericSizeIn(raw, category) {
  const text = String(raw).trim().replace(/^(shoe )?us\s*/i, '')
  if (category === 'Shoes' || category === 'Accessories') return /^\d{1,2}(\.5)?$/.test(text) && Number(text) >= 3 && Number(text) <= 15 ? text : ''
  return /^(0?0|[0-9]|1[0-9]|2[0-4])$/.test(text) ? text : ''
}

function sizesOf(product, variants, category) {
  const options = product.options || []
  const indexOf = (pattern) => options.findIndex((option) => pattern.test(option.name))
  const sizeIndex = indexOf(/^size$/i)
  const inseamIndex = indexOf(/^(inseam|length)$/i)
  const shirt = new Set()
  const pants = new Set()
  if (sizeIndex < 0) return { shirt: [], pants: [] }

  for (const variant of variants) {
    const value = String(variant[`option${sizeIndex + 1}`] || '').trim()
    letterSizesIn(value).forEach((size) => shirt.add(size))
    if (/^\d{1,2}-\d{1,2}YR$/i.test(value)) shirt.add(value.toUpperCase())

    const numeric = numericSizeIn(value, category)
    if (numeric) pants.add(numeric)

    // Waist plus inseam ("32" and "32") is the "32 × 32" form the style flow uses.
    const waist = Number(value)
    const inseam = inseamIndex >= 0 ? Number(String(variant[`option${inseamIndex + 1}`] || '').replace(/[^0-9]/g, '')) : 0
    if (['Pants', 'Jeans', 'Shorts'].includes(category) && waist >= 26 && waist <= 48 && inseam >= 26 && inseam <= 38) pants.add(`${waist} × ${inseam}`)
  }
  return {
    shirt: [...shirt].sort((a, b) => (LETTER_ORDER.indexOf(a) === -1 ? 99 : LETTER_ORDER.indexOf(a)) - (LETTER_ORDER.indexOf(b) === -1 ? 99 : LETTER_ORDER.indexOf(b)) || a.localeCompare(b)),
    pants: [...pants].sort((a, b) => parseFloat(a) - parseFloat(b)),
  }
}

// ---- the rest ---------------------------------------------------------------
const WOMEN_BODY = ['Straight', 'Curvy', 'Athletic', 'Petite', 'Tall', 'Plus']
const MEN_BODY = ['Slim', 'Athletic', 'Regular', 'Broad', 'Big & Tall', 'Short']
const CHILD_BODY = ['Slim', 'Regular', 'Tall', 'Short']

function dressCodesOf(category, name) {
  const text = name.toLowerCase()
  if (category === 'Activewear' || /legging|sports bra|training|\byoga\b|\brun(ning)?\b|athletic/.test(text)) return ['Casual', 'Active Wear']
  const codes = ['Casual']
  if (category === 'Suits' || /blazer|trouser|tailored|oxford|button|dress shirt|chino|merino|cashmere|poplin|wool/.test(text)) codes.push('Business Casual')
  if (category === 'Dresses' && /satin|silk|gown|cocktail|evening|sequin|velvet|slip/.test(text)) codes.push('Cocktail Dress', 'Semi-Formal')
  if (/boho|peasant|crochet|embroider/.test(text)) codes.push('Bohemian')
  return codes
}

const priceTierOf = (price) => (price < 60 ? 'budget' : price < 180 ? 'treat' : 'splurge')

function cleanName(title) {
  const name = String(title).replace(/\s*\|\s*/g, ' – ').replace(/\s+/g, ' ').trim()
  return name === name.toUpperCase() ? titleCase(name) : name
}

function imageOf(product) {
  const src = product.images?.[0]?.src || product.image?.src
  if (!src) return ''
  return src.includes('cdn.shopify.com') ? `${src}${src.includes('?') ? '&' : '?'}width=640` : src
}

function convert(store, product) {
  const tags = tagsOf(product)
  const variants = (product.variants || []).filter((variant) => variant.available)
  if (variants.length === 0) return null

  const gender = genderOf(store.name, product, tags)
  const category = categoryOf(product.title, product.product_type)
  const image = imageOf(product)
  const price = Math.min(...variants.map((variant) => Number(variant.price)).filter((value) => value > 0))
  if (!gender || !category || !image || !Number.isFinite(price)) return null

  const color = colorOf(product, tags, variants)
  if (!color) return null

  const name = cleanName(product.title)
  const sizes = sizesOf(product, variants, category)
  return {
    name,
    gender,
    category,
    price: Math.round(price * 100) / 100,
    priceTier: priceTierOf(price),
    imageUrl: image,
    vendor: store.name,
    brand: store.name,
    color,
    storeTier: 'Everyday & Designer',
    bodyType: gender === 'Men' ? MEN_BODY : gender === 'Children' ? CHILD_BODY : WOMEN_BODY,
    dressCode: dressCodesOf(category, name),
    availableShirtSizes: sizes.shirt,
    ...(sizes.pants.length ? { availablePantsSizes: sizes.pants } : {}),
    productUrl: `${store.base}/products/${product.handle}`,
    verifiedAt: CHECKED_ON,
    fitNote: 'Listing details from the retailer; fit guidance not provided',
  }
}

// Interleave categories so a store's cap isn't spent on a single kind of item.
function balanced(items, cap) {
  const groups = new Map()
  for (const item of items) groups.set(item.category, [...(groups.get(item.category) || []), item])
  const queues = [...groups.values()]
  const picked = []
  while (picked.length < cap && queues.some((queue) => queue.length)) {
    for (const queue of queues) {
      if (queue.length && picked.length < cap) picked.push(queue.shift())
    }
  }
  return picked
}

const catalog = []
const summary = []
for (const store of stores) {
  const feed = await loadFeed(store)
  const seen = new Set()
  const converted = []
  for (const product of feed) {
    if (seen.has(product.handle)) continue
    seen.add(product.handle)
    const item = convert(store, product)
    const key = item && `${item.name}|${item.color}`
    if (item && !seen.has(key)) { seen.add(key); converted.push(item) }
  }
  const chosen = balanced(converted, PER_STORE_CAP)
  catalog.push(...chosen)
  summary.push(`${store.name.padEnd(22)} feed ${String(feed.length).padStart(4)}  usable ${String(converted.length).padStart(4)}  added ${String(chosen.length).padStart(3)}`)
}

catalog.forEach((item, index) => { item.id = FIRST_ID + index })
fs.writeFileSync(OUTPUT, JSON.stringify(catalog))

const count = (key) => catalog.reduce((acc, item) => { acc[item[key]] = (acc[item[key]] || 0) + 1; return acc }, {})
console.log(summary.join('\n'))
console.log(`\nTotal ${catalog.length} items -> ${path.relative(process.cwd(), OUTPUT)} (${Math.round(fs.statSync(OUTPUT).size / 1024)} KB)`)
console.log('gender', JSON.stringify(count('gender')))
console.log('category', JSON.stringify(count('category')))
console.log('tier', JSON.stringify(count('priceTier')))
console.log('color families', JSON.stringify(catalog.reduce((acc, item) => { const f = productColorFamily(item.color); acc[f] = (acc[f] || 0) + 1; return acc }, {})))
