// Builds public/catalog-extra.json: real, in-stock products from clothing stores that
// publish a public Shopify-style product feed (/products.json). Every item keeps the
// store's own name, price, photo and exact product page; nothing is invented.
//
//   node work/build-extra-catalog.mjs              fetch the feeds live
//   node work/build-extra-catalog.mjs --cache=DIR  reuse feeds saved earlier in DIR
//   node work/build-extra-catalog.mjs --save=DIR   also save the feeds into DIR
//   node work/build-extra-catalog.mjs --cap=300    most items to take from any one store
//
// Re-run it to refresh prices and stock. Retailers don't publish body-type fit or dress
// codes, so body types are filled in generically when the site loads the file (every body
// type for the gender) and the dress code is guessed from the garment here.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { productColorFamily, shoppingColors } from '../src/utils/searchIntent.js'
import { slugify } from '../src/utils/slugify.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT = path.resolve(here, '..', 'public', 'catalog-extra.json')
const argValue = (name) => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3) || ''
const CACHE_DIR = argValue('cache')
const SAVE_DIR = argValue('save')
const CHECKED_ON = new Date().toISOString().slice(0, 10)
const FIRST_ID = 100000
const PER_STORE_CAP = Number(argValue('cap')) || 260
const MAX_PAGES = 40
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

// `fallback` is the gender used when a product doesn't say (a store that sells to one gender).
const stores = [
  { name: 'Stüssy', base: 'https://www.stussy.com' },
  { name: 'Princess Polly', base: 'https://us.princesspolly.com', fallback: 'Women' },
  { name: 'Kith', base: 'https://kith.com' },
  { name: 'Alo Yoga', base: 'https://www.aloyoga.com' },
  { name: 'Outdoor Voices', base: 'https://www.outdoorvoices.com' },
  { name: 'Taylor Stitch', base: 'https://www.taylorstitch.com', fallback: 'Men' },
  { name: 'Faherty', base: 'https://fahertybrand.com' },
  { name: 'Everlane', base: 'https://www.everlane.com' },
  { name: 'Marine Layer', base: 'https://www.marinelayer.com' },
  { name: 'Pangaia', base: 'https://pangaia.com' },
  { name: 'Girlfriend Collective', base: 'https://girlfriend.com', fallback: 'Women' },
  { name: 'Culture Kings', base: 'https://www.culturekings.com' },
  { name: 'Mack Weldon', base: 'https://mackweldon.com', fallback: 'Men' },
  { name: 'Aimé Leon Dore', base: 'https://www.aimeleondore.com', fallback: 'Men' },
  { name: 'Show Me Your Mumu', base: 'https://www.showmeyourmumu.com', fallback: 'Women' },
  { name: 'Beyond Yoga', base: 'https://beyondyoga.com' },
  { name: 'Edikted', base: 'https://www.edikted.com', fallback: 'Women' },
  { name: 'White Fox', base: 'https://www.whitefoxboutique.com', fallback: 'Women' },
  { name: 'Meshki', base: 'https://meshki.us', fallback: 'Women' },
  { name: 'Los Angeles Apparel', base: 'https://losangelesapparel.net' },
  { name: 'Noah', base: 'https://noahny.com' },
  { name: 'Bode', base: 'https://bode.com' },
  { name: 'Tentree', base: 'https://www.tentree.com' },
  { name: 'Bonobos', base: 'https://bonobos.com', fallback: 'Men' },
  { name: 'Johnnie-O', base: 'https://johnnie-o.com', fallback: 'Men' },
  { name: 'Southern Tide', base: 'https://southerntide.com', fallback: 'Men' },
  { name: 'Set Active', base: 'https://setactive.co' },
  { name: 'Tommy John', base: 'https://tommyjohn.com' },
  { name: 'Ministry of Supply', base: 'https://ministryofsupply.com' },
  { name: 'Rails', base: 'https://www.rails.com' },
  { name: 'Saturday NYC', base: 'https://www.saturdaysnyc.com', fallback: 'Men' },
  { name: 'Ten Thousand', base: 'https://www.tenthousand.cc', fallback: 'Men' },
  { name: 'Steve Madden', base: 'https://www.stevemadden.com' },
  { name: 'MUJI', base: 'https://www.muji.us' },
  { name: 'The Sak', base: 'https://www.thesak.com', fallback: 'Women' },
  { name: 'Naadam', base: 'https://naadam.co' },
  { name: 'Cuyana', base: 'https://www.cuyana.com', fallback: 'Women' },
  { name: 'Nanushka', base: 'https://www.nanushka.com', fallback: 'Women' },
  { name: 'Doen', base: 'https://shopdoen.com', fallback: 'Women' },
  { name: 'Cult Gaia', base: 'https://cultgaia.com', fallback: 'Women' },
  { name: 'Christy Dawn', base: 'https://christydawn.com', fallback: 'Women' },
  { name: 'Staud', base: 'https://staud.clothing', fallback: 'Women' },
  { name: 'ASTR the Label', base: 'https://astrthelabel.com', fallback: 'Women' },
  { name: 'Reigning Champ', base: 'https://reigningchamp.com' },
  { name: 'Kotn', base: 'https://kotn.com' },
  { name: 'Cotopaxi', base: 'https://www.cotopaxi.com' },
  { name: 'Allbirds', base: 'https://www.allbirds.com' },
  { name: 'Outerknown', base: 'https://www.outerknown.com' },
  { name: 'Rowing Blazers', base: 'https://rowingblazers.com' },
  { name: 'Fear of God', base: 'https://fearofgod.com' },
  { name: 'Palace', base: 'https://www.palaceskateboards.com' },
  { name: 'Lack of Color', base: 'https://lackofcolor.com' },
  { name: 'Brain Dead', base: 'https://wearebraindead.com' },
  { name: 'BAPE', base: 'https://us.bape.com' },
  { name: 'Pleasures', base: 'https://pleasuresnow.com' },
  { name: 'Stampd', base: 'https://stampd.com' },
  { name: 'Alexander Wang', base: 'https://www.alexanderwang.com' },
  { name: 'Gorjana', base: 'https://www.gorjana.com', fallback: 'Women' },
  { name: 'Pura Vida', base: 'https://www.puravidabracelets.com', fallback: 'Women' },
  { name: 'Stance', base: 'https://www.stance.com' },
  { name: 'LNA', base: 'https://lnaclothing.com' },
  { name: 'Good American', base: 'https://www.goodamerican.com', fallback: 'Women' },
  { name: 'Agolde', base: 'https://agolde.com' },
  { name: 'Citizens of Humanity', base: 'https://citizensofhumanity.com' },
  { name: 'Mother Denim', base: 'https://motherdenim.com', fallback: 'Women' },
  { name: 'Re/Done', base: 'https://shopredone.com' },
  { name: 'Frame', base: 'https://frame-store.com' },
  { name: 'Public School', base: 'https://publicschoolnyc.com' },
  { name: 'Satisfy Running', base: 'https://satisfyrunning.com' },
  { name: 'Vessi', base: 'https://vessi.com' },
  { name: 'Rothy’s', base: 'https://rothys.com', fallback: 'Women' },
  { name: 'Birdies', base: 'https://birdies.com', fallback: 'Women' },
  { name: 'Dolce Vita', base: 'https://www.dolcevita.com', fallback: 'Women' },
  { name: 'Brandy Melville', base: 'https://www.brandymelvilleusa.com', fallback: 'Women' },
  { name: 'Matisse Footwear', base: 'https://matissefootwear.com', fallback: 'Women' },
]

const slugOf = (name) => name.replace(/[^a-z0-9]/gi, '_')

async function loadFeed(store) {
  const cacheFile = (dir) => path.join(dir, `${slugOf(store.name)}.json`)
  if (CACHE_DIR && fs.existsSync(cacheFile(CACHE_DIR))) return JSON.parse(fs.readFileSync(cacheFile(CACHE_DIR), 'utf8'))

  const all = []
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    let products = []
    try {
      const response = await fetch(`${store.base}/products.json?limit=250&page=${page}`, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(40000) })
      if (!response.ok) break
      products = (await response.json()).products || []
    } catch {
      break
    }
    all.push(...products)
    if (products.length < 250) break
    await new Promise((resolve) => setTimeout(resolve, 350))
  }
  if (SAVE_DIR) {
    fs.mkdirSync(SAVE_DIR, { recursive: true })
    fs.writeFileSync(cacheFile(SAVE_DIR), JSON.stringify(all))
  }
  return all
}

const tagsOf = (product) => (Array.isArray(product.tags) ? product.tags : String(product.tags || '').split(',')).map((tag) => tag.trim()).filter(Boolean)

// ---- gender -----------------------------------------------------------------
function genderOf(store, product, tags) {
  const type = String(product.product_type || '')
  const has = (pattern) => tags.some((tag) => pattern.test(tag))
  switch (store.name) {
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
    case 'Kith':
      if (has(/^kith womens?$/i)) return 'Women'
      if (has(/^kids$/i)) return 'Children'
      if (has(/^mens$|^ea\d+mens$|^mens_/i)) return 'Men'
      return ''
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
      return genericGender(store, product, tags)
  }
}

// For stores without their own rule: look for an explicit women's / men's / kids' signal in the
// tags, type and name, then fall back to the store's usual customer.
function genericGender(store, product, tags) {
  // Names can say "Women's" or "Men's", but words like "Hot Girl" or "Baby Pink" are just
  // product names, so kids are only recognized from the store's own tags and type.
  const structured = [...tags, product.product_type || ''].join(' | ').toLowerCase()
  const signals = `${structured} | ${String(product.title || '').toLowerCase()}`
  const women = /\b(women'?s?|womens|woman|ladies|female)\b/.test(signals)
  const men = /(^|[^a-z])(men'?s?|mens|man|male)([^a-z]|$)/.test(signals.replace(/women'?s?|womens|woman|female/g, ' '))
  const kids = /\b(kids?|boys?|girls?|toddler|youth)\b/.test(structured) && !women && !men
  if (kids) return 'Children'
  if (women && !men) return 'Women'
  if (men && !women) return 'Men'
  return store.fallback || ''
}

// ---- category ---------------------------------------------------------------
const rules = [
  ['skip', /gift ?card|e-?gift|sample|insurance|shipping|bundle|sticker|poster|candle|\bmug\b|keychain|phone case|fragrance|perfume|skateboard|\bdeck\b|\bbook\b|vinyl|lighter|towel|blanket|pillow|customi[sz]ation|\bpatch\b|\bpin\b|\bkit\b|\bsheet\b|duvet|\brug\b|mattress|\bsoap\b|\blotion\b|\bgift\b|water bottle|notebook|journal|\bpet\b|\bdog\b/i],
  ['Accessories', /\bsocks?\b/i],
  ['Shoes', /sneaker|trainer|\bboots?\b|sandal|loafer|\bslides?\b|clog|\bmules?\b|flip.?flop|footwear|\bshoes?\b|\bpumps?\b|\bhigh heels?\b|\bblock heels?\b|\bballet flats?\b|slipper|espadrille/i],
  ['Jewelry', /necklace|earring|bracelet|\brings?\b|pendant|anklet/i],
  ['Accessories', /\b(cap(?! sleeve)|hat|beanie|snapback|strapback|bucket|visor|bag|tote|backpack|belt|scarf|gloves?|wallet|sunglass(es)?|headband|bandana|duffle|pouch|crossbody|lanyard|umbrella|balaclava|neck gaiter|purse|clutch|satchel|hobo|handbag|scrunchie|hair clip)\b/i],
  ['Swimwear', /swim|bikini|trunks|boardshort|rash ?guard/i],
  ['Jeans', /\bjeans?\b/i],
  ['Intimates', /underwear|\bbriefs?\b|\bboxers?\b(?! ?(short|pant))|bralette|\bthong\b|panty|panties|lingerie|undershirt|shapewear/i],
  ['Activewear', /sports? bra|legging|bike short|tracksuit|\bbra\b/i],
  ['Suits', /\bsuits?\b(?!case)|tuxedo/i],
  ['Outerwear', /jacket|\bcoat|overcoat|parka|puffer|anorak|windbreaker|trench|bomber|blazer|shacket|poncho|\bcape\b(?![\w ]{0,14}\b(top|tee|tank)\b)|gilet/i],
  ['Knitwear', /sweater|cardigan|hoodie|sweatshirt|crewneck|crew neck|pullover|jumper|turtleneck|fleece/i],
  ['Outerwear', /\bvest\b/i],
  ['Jeans', /\bjeans?\b|\bdenim\b(?!.*(jacket|shirt|vest|top|dress|skirt|short|cap|hat|bag))/i],
  ['Skirts', /\bskirts?\b|\bskort/i],
  ['Shorts', /\bshorts?\b(?![ -]?sleeve)|sweatshorts/i],
  ['Dresses', /\bdress(es)?\b(?! (shirt|pant|sock|shoe|trouser|belt))|jumpsuit|playsuit|romper|\bgown\b|\bmuumuu\b|\bmaxi\b|\bmidi\b/i],
  ['Pants', /\bpants?\b|trouser|chino|cargo|jogger|sweatpant|slacks?|culotte|\bbottoms?\b/i],
  ['Tops', /\btees?\b|t-shirt|shirt|\bcrop top|\btank\b|\bpolo\b|henley|blouse|\btop\b|bodysuit|\bcami|singlet|tube|\bknit\b|\bcorset\b|\bbustier\b|\bhalter\b/i],
]

// The product's own name is more reliable than the store's internal type field, so it
// is tried first and the type is only a fallback for names that say nothing.
function categoryOf(title, type) {
  // Names like "Enchanted Dress ~ Ballet Slipper Ruffle Tulle" put the garment first and
  // describe it after a separator, so the part before the separator is tried before anything else.
  const head = String(title).split(/\s+(?:~|\||–|—|-)\s+/)[0]
  for (const text of [head, title, type]) {
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
    const match = tag.match(/^(?:primary )?colou?r(?:-family)?\s*[:\-]\s*(.+)$/i) || tag.match(/^(?:colorgroup|palette|colou?rway)\s*:\s*(.+)$/i)
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
  const rank = (size) => (LETTER_ORDER.indexOf(size) === -1 ? 99 : LETTER_ORDER.indexOf(size))
  return {
    shirt: [...shirt].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b)),
    pants: [...pants].sort((a, b) => parseFloat(a) - parseFloat(b)),
  }
}

// ---- the rest ---------------------------------------------------------------
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

// Compact on purpose: this file is downloaded by every visitor. Fields every item shares
// (body types, store tier, the check date, the store address) are filled in by the site.
function convert(store, product) {
  const tags = tagsOf(product)
  const variants = (product.variants || []).filter((variant) => variant.available)
  if (variants.length === 0) return null

  const gender = genderOf(store, product, tags)
  const category = categoryOf(product.title, product.product_type)
  const image = imageOf(product)
  const prices = variants.map((variant) => Number(variant.price)).filter((value) => value > 0)
  const price = prices.length ? Math.min(...prices) : NaN
  if (!gender || !category || !image || !Number.isFinite(price) || !product.handle) return null

  const color = colorOf(product, tags, variants)
  if (!color) return null

  const name = cleanName(product.title)
  const sizes = sizesOf(product, variants, category)
  const brand = String(product.vendor || '').trim()
  return {
    name,
    gender,
    category,
    price: Math.round(price * 100) / 100,
    priceTier: priceTierOf(price),
    imageUrl: image,
    vendor: store.name,
    ...(brand && brand.toLowerCase() !== store.name.toLowerCase() && brand.length < 40 ? { brand } : {}),
    color,
    dressCode: dressCodesOf(category, name),
    availableShirtSizes: sizes.shirt,
    ...(sizes.pants.length ? { availablePantsSizes: sizes.pants } : {}),
    handle: product.handle,
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

// ---- ME+EM ------------------------------------------------------------------
// ME+EM (meandem.com) isn't a Shopify store, so there is no product feed. Its robots.txt allows
// product pages, and each one carries standard schema.org product data plus the in-stock sizes.
// The pages are read gently (a few at a time) and what was extracted is saved to the cache.
const MEEM_BASE = 'https://www.meandem.com'
const MEEM_US = `${MEEM_BASE}/us`

async function fetchText(url, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(60000), redirect: 'follow' })
      if (response.ok) return await response.text()
      if (response.status === 404) return ''
    } catch { /* retry */ }
    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
  }
  return ''
}

function extractMeEmPage(html, url) {
  let product = null
  for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(match[1])
      if (data['@type'] === 'Product') { product = data; break }
    } catch { /* not valid JSON */ }
  }
  if (!product) return null

  const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers
  // The page also lists size choices for the products it recommends; only the block whose
  // SKUs start with this product's own SKU belongs to it.
  const flat = html.replace(/\\"/g, '"')
  let sizeLabels = []
  for (const match of flat.matchAll(/"sizes":\[((?:\{[^[\]{}]*\},?)+)\]/g)) {
    try {
      const sizes = JSON.parse(`[${match[1]}]`)
      if (String(sizes[0]?.sku || '').startsWith(product.productSku || '\u0000')) { sizeLabels = sizes.filter((size) => !size.disabled).map((size) => size.label); break }
    } catch { /* skip */ }
  }
  return {
    url,
    name: product.name,
    category: product.category,
    color: product.color,
    price: Number(offer?.price),
    currency: offer?.priceCurrency,
    inStock: /InStock/i.test(offer?.availability || ''),
    image: Array.isArray(product.image) ? product.image[0] : product.image,
    path: product.url,
    sizeLabels,
  }
}

async function loadMeEmPages() {
  const cacheFile = (dir) => path.join(dir, 'ME_EM_pages.json')
  if (CACHE_DIR && fs.existsSync(cacheFile(CACHE_DIR))) return JSON.parse(fs.readFileSync(cacheFile(CACHE_DIR), 'utf8'))

  const sitemap = await fetchText(`${MEEM_US}/sitemap-oms.xml`)
  // Product pages are single-segment slugs with several words; category pages are short.
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).filter((url) => /^https:\/\/www\.meandem\.com\/us\/[a-z0-9]+(?:-[a-z0-9]+){2,}$/.test(url))
  console.log(`ME+EM: ${urls.length} candidate product pages`)

  const pages = []
  let next = 0
  let done = 0
  const worker = async () => {
    while (next < urls.length) {
      const url = urls[next]
      next += 1
      const page = extractMeEmPage(await fetchText(url), url)
      if (page) pages.push(page)
      done += 1
      if (done % 100 === 0) console.log(`ME+EM: ${done}/${urls.length} pages read`)
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker))

  if (SAVE_DIR) {
    fs.mkdirSync(SAVE_DIR, { recursive: true })
    fs.writeFileSync(cacheFile(SAVE_DIR), JSON.stringify(pages))
  }
  return pages
}

function meEmSizes(labels, category) {
  const shirt = new Set()
  const pants = new Set()
  for (const label of labels) {
    letterSizesIn(label).forEach((size) => shirt.add(size))
    const number = String(label).match(/^(\d{1,2}(?:\.5)?)\b/)?.[1]
    if (number && (category === 'Shoes' ? Number(number) >= 3 : Number(number) <= 24)) pants.add(number)
  }
  const rank = (size) => (LETTER_ORDER.indexOf(size) === -1 ? 99 : LETTER_ORDER.indexOf(size))
  return { shirt: [...shirt].sort((a, b) => rank(a) - rank(b)), pants: [...pants].sort((a, b) => parseFloat(a) - parseFloat(b)) }
}

// Some ME+EM pages leave the color field empty but end their address with it
// ("…-maxi-dress-navy", "…-hoody-dark-charcoal-melange").
const COLOR_MODIFIERS = new Set(['dark', 'light', 'pale', 'bright', 'warm', 'deep', 'double', 'soft', 'mid'])
function colorFromAddress(url) {
  const words = url.split('/').pop().split('-')
  for (let i = words.length - 1; i >= Math.max(1, words.length - 3); i -= 1) {
    if (!productColorFamily(words[i])) continue
    const start = COLOR_MODIFIERS.has(words[i - 1]) ? i - 1 : i
    return words.slice(start).join(' ')
  }
  return ''
}

async function loadMeEm() {
  const pages = await loadMeEmPages()
  const seen = new Set()
  const result = []
  let skipped = { notInStock: 0, noCategory: 0, noColor: 0, noPrice: 0 }
  for (const page of pages) {
    if (!page.inStock) { skipped.notInStock += 1; continue }
    if (!(page.price > 0) || page.currency !== 'USD' || !page.image) { skipped.noPrice += 1; continue }
    const category = categoryOf(page.name, page.category || '')
    if (!category) { skipped.noCategory += 1; continue }
    const colorText = String(page.color || colorFromAddress(page.url)).replace(/\s+/g, ' ').trim()
    const color = colorText && productColorFamily(colorText) ? titleCase(colorText) : ''
    if (!color) { skipped.noColor += 1; continue }
    const key = `${page.name}|${color}`
    if (seen.has(key)) continue
    seen.add(key)

    const file = String(page.image).split('/').pop()
    const sizes = meEmSizes(page.sizeLabels, category)
    result.push({
      name: page.name,
      gender: 'Women',
      category,
      price: Math.round(page.price * 100) / 100,
      priceTier: priceTierOf(page.price),
      // ME+EM's own storefront serves product photos through this resizer, which returns a small WebP.
      imageUrl: `${MEEM_BASE}/_next/image?url=${encodeURIComponent(`/oms/client/dynamic/images/${file}`)}&w=640&q=75`,
      vendor: 'ME+EM',
      color,
      dressCode: dressCodesOf(category, page.name),
      availableShirtSizes: sizes.shirt,
      ...(sizes.pants.length ? { availablePantsSizes: sizes.pants } : {}),
      url: `${MEEM_BASE}${page.path}`,
    })
  }
  console.log(`ME+EM: kept ${result.length} of ${pages.length} pages`, JSON.stringify(skipped))
  return result
}

const items = []
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
  items.push(...chosen)
  summary.push(`${store.name.padEnd(22)} feed ${String(feed.length).padStart(5)}  usable ${String(converted.length).padStart(5)}  added ${String(chosen.length).padStart(4)}`)
}

const meEmItems = await loadMeEm()
items.push(...meEmItems)
summary.push(`${'ME+EM'.padEnd(22)} (site)  added ${String(meEmItems.length).padStart(4)}`)

// ---- compact file -------------------------------------------------------------
// Every visitor downloads this file, so values that repeat (store, color, size lists, photo
// folder) are stored once in a table and each item holds only positions in those tables.
// src/services/catalogService.js expands it back; keep the two in step (FORMAT_VERSION).
const FORMAT_VERSION = 2

function splitImage(url) {
  // Shopify's ?v=<timestamp> only busts caches, so it is dropped.
  const clean = url.replace(/\?v=\d+(&|$)/, (_, next) => (next === '&' ? '?' : ''))
  const match = clean.match(/^(.*(?:\/|%2F))([^/%?&]+)((?:[?&].*)?)$/)
  return match ? [match[1], match[2], match[3]] : [clean, '', '']
}

function compactCatalog(list, storeBases) {
  const table = () => {
    const values = []
    const lookup = new Map()
    return {
      values,
      index: (value) => {
        const key = JSON.stringify(value)
        if (!lookup.has(key)) { lookup.set(key, values.length); values.push(value) }
        return lookup.get(key)
      },
    }
  }
  const vendors = table(), colors = table(), categories = table(), genders = table(), dress = table(), shirt = table(), pants = table(), brands = table(), bases = table(), tails = table()
  brands.index('')
  pants.index([])

  const rows = list.map((item) => {
    const [base, file, tail] = splitImage(item.imageUrl)
    const prefix = storeBases[item.vendor]
    const page = item.url || `${prefix}${item.handle}`
    return [
      vendors.index(item.vendor),
      genders.index(item.gender),
      categories.index(item.category),
      item.price,
      item.name,
      colors.index(item.color),
      dress.index(item.dressCode),
      shirt.index(item.availableShirtSizes),
      pants.index(item.availablePantsSizes || []),
      brands.index(item.brand || ''),
      bases.index(base),
      file,
      tails.index(tail),
      // Left empty when the address is just the product name in dashed form (the site rebuilds it).
      page.startsWith(prefix) ? (page.slice(prefix.length) === slugify(item.name) ? '' : page.slice(prefix.length)) : page,
    ]
  })

  return {
    v: FORMAT_VERSION,
    checkedOn: CHECKED_ON,
    firstId: FIRST_ID,
    stores: storeBases,
    vendors: vendors.values, colors: colors.values, categories: categories.values, genders: genders.values,
    dress: dress.values, shirt: shirt.values, pants: pants.values, brands: brands.values, imageBases: bases.values, imageTails: tails.values,
    rows,
  }
}

const storeBases = {
  ...Object.fromEntries(stores.filter((store) => items.some((item) => item.vendor === store.name)).map((store) => [store.name, `${store.base}/products/`])),
  ...(meEmItems.length ? { 'ME+EM': `${MEEM_US}/` } : {}),
}
fs.writeFileSync(OUTPUT, JSON.stringify(compactCatalog(items, storeBases)))

const count = (key) => items.reduce((acc, item) => { acc[item[key]] = (acc[item[key]] || 0) + 1; return acc }, {})
console.log(summary.join('\n'))
console.log(`\nTotal ${items.length} items -> ${path.relative(process.cwd(), OUTPUT)} (${Math.round(fs.statSync(OUTPUT).size / 1024)} KB)`)
console.log('gender', JSON.stringify(count('gender')))
console.log('category', JSON.stringify(count('category')))
console.log('tier', JSON.stringify(count('priceTier')))
