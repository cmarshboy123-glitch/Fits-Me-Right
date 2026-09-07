export const shoppingColors = [
  { value: 'black', label: 'Black', swatch: '#171717', aliases: ['black', 'charcoal', 'onyx', 'jet'] },
  { value: 'white', label: 'White', swatch: '#fffdfa', aliases: ['white', 'ivory', 'off white', 'off-white'] },
  { value: 'grey', label: 'Grey', swatch: '#8b8b86', aliases: ['grey', 'gray', 'silver grey', 'heather'] },
  { value: 'brown', label: 'Brown', swatch: '#6f442d', aliases: ['brown', 'chocolate', 'cocoa', 'camel', 'espresso', 'mocha', 'tan', 'taupe'] },
  { value: 'beige', label: 'Beige & Cream', swatch: '#d8c6a4', aliases: ['beige', 'cream', 'sand', 'ecru', 'oatmeal', 'natural'] },
  { value: 'red', label: 'Red', swatch: '#a82c2c', aliases: ['red', 'burgundy', 'wine', 'maroon', 'crimson', 'scarlet'] },
  { value: 'orange', label: 'Orange', swatch: '#d46a22', aliases: ['orange', 'rust', 'terracotta', 'coral', 'peach'] },
  { value: 'yellow', label: 'Yellow', swatch: '#d8ad23', aliases: ['yellow', 'mustard', 'goldenrod', 'lemon'] },
  { value: 'green', label: 'Green', swatch: '#446348', aliases: ['green', 'olive', 'sage', 'emerald', 'mint', 'khaki green'] },
  { value: 'blue', label: 'Blue', swatch: '#355b82', aliases: ['blue', 'navy', 'cobalt', 'teal', 'turquoise', 'aqua', 'indigo'] },
  { value: 'purple', label: 'Purple', swatch: '#745282', aliases: ['purple', 'violet', 'lavender', 'lilac', 'plum'] },
  { value: 'pink', label: 'Pink', swatch: '#d78fa3', aliases: ['pink', 'rose', 'blush', 'fuchsia', 'magenta'] },
  { value: 'metallic', label: 'Metallic', swatch: '#b7aa8c', aliases: ['metallic', 'gold', 'silver', 'bronze', 'copper'] },
  { value: 'multi', label: 'Multicolor', swatch: 'linear-gradient(135deg,#b83b3b,#d6a72b,#3f7550,#496ba8)', aliases: ['multicolor', 'multi color', 'multi-color', 'print', 'printed', 'patterned'] },
]
const categoryAliases = {
  Jeans: ['jeans', 'jean', 'denim'],
  Pants: ['pants', 'pant', 'trousers', 'trouser', 'slacks', 'slack', 'chinos', 'chino', 'khakis', 'khaki', 'culottes', 'culotte'],
  Dresses: ['dress', 'dresses', 'gown'],
  Tops: ['shirt', 'shirts', 'blouse', 'blouses', 'top', 'tops', 'tee', 't-shirt'],
  Skirts: ['skirt', 'skirts', 'skort', 'skorts'],
  Shorts: ['shorts', 'short'],
  Outerwear: ['coat', 'coats', 'jacket', 'jackets', 'blazer', 'blazers', 'parka', 'parkas', 'trench', 'trenchcoat'],
  Knitwear: ['sweater', 'sweaters', 'jumper', 'jumpers', 'cardigan', 'cardigans', 'knitwear'],
  Suits: ['suit', 'suits', 'tuxedo', 'tuxedos'],
  Activewear: ['activewear', 'sportswear', 'joggers', 'jogger', 'leggings', 'legging', 'tracksuit', 'tracksuits'],
  Swimwear: ['swimwear', 'swimsuit', 'swimsuits', 'bikini', 'bikinis', 'trunks'],
  Intimates: ['underwear', 'lingerie', 'bra', 'bras', 'briefs', 'boxers'],
  Shoes: ['shoe', 'shoes', 'sneaker', 'sneakers', 'boot', 'boots', 'loafer', 'loafers'],
  Jewelry: ['jewelry', 'jewellery', 'earrings', 'necklace', 'bracelet', 'ring'],
  Accessories: ['accessory', 'accessories', 'belt', 'belts', 'scarf', 'scarves', 'hat', 'hats', 'bag', 'bags'],
}

const normalizeSize = (size) => String(size).trim().toLowerCase().replace(/^0+(?=\d)/, '')

const colorAliases = shoppingColors
  .flatMap((color) => color.aliases.map((alias) => ({ ...color, alias })))
  .sort((a, b) => b.alias.length - a.alias.length)
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// So "hermes" finds "Hermès" — most people won't type the accent.
const stripDiacritics = (value) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '')

export function productColorFamily(color = '') {
  const source = stripDiacritics(String(color).toLowerCase())
  return colorAliases.find(({ alias }) => new RegExp(`\\b${escapeRegExp(alias)}\\b`).test(source))?.value || ''
}

export const shoppingCategories = ['Pants', 'Jeans', 'Tops', 'Dresses', 'Skirts', 'Shorts', 'Outerwear', 'Knitwear', 'Suits', 'Activewear', 'Swimwear', 'Intimates', 'Shoes', 'Jewelry', 'Accessories']

export function parseShoppingIntent(input = '') {
  const source = stripDiacritics(input.trim().toLowerCase()).replace(/\bmngo\b/g, 'mango')
  let remainder = source
  const maxMatch = source.match(/(?:under|below|less than|up to|max(?:imum)?(?: of)?)\s*\$?\s*(\d+(?:\.\d{1,2})?)/)
  const minMatch = source.match(/(?:over|above|more than|at least)\s*\$?\s*(\d+(?:\.\d{1,2})?)/)
  const sizeMatch = source.match(/(?:in\s+)?size\s*[:#-]?\s*([a-z0-9]+(?:\s*[x×]\s*[a-z0-9]+)?)/i)
  const colorMatch = colorAliases.find(({ alias }) => new RegExp(`\\b${escapeRegExp(alias)}\\b`).test(source))
  const color = colorMatch?.value || ''
  const category = Object.entries(categoryAliases).find(([, aliases]) => aliases.some((alias) => new RegExp(`\\b${alias}\\b`).test(source)))?.[0]

  if (maxMatch) remainder = remainder.replace(maxMatch[0], ' ')
  if (minMatch) remainder = remainder.replace(minMatch[0], ' ')
  if (sizeMatch) remainder = remainder.replace(sizeMatch[0], ' ')
  if (colorMatch) remainder = remainder.replace(new RegExp(`\\b${escapeRegExp(colorMatch.alias)}\\b`, 'g'), ' ')
  if (category) categoryAliases[category].forEach((alias) => { remainder = remainder.replace(new RegExp(`\\b${alias}\\b`, 'g'), ' ') })

  const text = remainder
    .replace(/\$|\bdollars?\b|\bfor women\b|\bfor men\b|\bwomen'?s?\b|\bmen'?s?\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return {
    raw: input,
    text,
    color,
    category,
    maxPrice: maxMatch ? Number(maxMatch[1]) : null,
    minPrice: minMatch ? Number(minMatch[1]) : null,
    size: sizeMatch ? normalizeSize(sizeMatch[1]) : '',
    gender: /\bwomen'?s?\b/.test(source) ? 'Women' : /\bmen'?s?\b/.test(source) ? 'Men' : '',
  }
}

export function productMatchesIntent(product, intent) {
  const haystack = stripDiacritics(`${product.name} ${product.brand} ${product.vendor} ${product.category} ${product.color || ''} ${product.fitNote || ''}`.toLowerCase())
  const textTokens = intent.text.split(/\s+/).filter(Boolean)
  const productColor = productColorFamily(product.color)
  const sizes = [...(product.availablePantsSizes || []), ...(product.availableShirtSizes || [])].map(normalizeSize)

  return textTokens.every((token) => haystack.includes(token)) &&
    (!intent.color || productColor === intent.color) &&
    (!intent.category || product.category === intent.category ||
      (intent.category === 'Jeans' && ['Bottoms', 'Pants'].includes(product.category) && haystack.includes('jean')) ||
      (intent.category === 'Pants' && ['Bottoms', 'Jeans'].includes(product.category))) &&
    (intent.maxPrice == null || product.price < intent.maxPrice) &&
    (intent.minPrice == null || product.price > intent.minPrice) &&
    (!intent.size || sizes.includes(intent.size)) &&
    (!intent.gender || product.gender === intent.gender)
}

export function intentLabels(intent) {
  return [
    intent.color && `${intent.color[0].toUpperCase()}${intent.color.slice(1)}`,
    intent.category,
    intent.maxPrice != null && `Under $${intent.maxPrice}`,
    intent.minPrice != null && `Above $${intent.minPrice}`,
    intent.size && `Size ${intent.size.toUpperCase()}`,
    intent.gender,
    intent.text && `“${intent.text}”`,
  ].filter(Boolean)
}
