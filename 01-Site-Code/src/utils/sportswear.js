// What counts as sportswear, decided once for the whole site (the Sportswear section, the "Activewear" filter and
// search all use this). Stores file their sporty pieces under many categories (joggers as Pants, running tees as
// Tops, sports bras as Intimates), and the feed's own "Activewear" label also holds underwear and fashion pieces,
// so the category alone is not trusted. An item is sportswear when it comes from a store that only makes
// sportswear, or when its own name says it is for sport.

// Stores whose catalogue is sportswear.
const SPORT_STORES = new Set(['Alo Yoga', 'Beyond Yoga', 'Girlfriend Collective', 'Outdoor Voices', 'Ten Thousand', 'Tracksmith', 'Nike', 'Adidas', 'Lululemon', 'Puma', 'Under Armour', 'Vuori', 'Gymshark', 'Fabletics', 'Rhone'])

// Words in a product's name that say it is made for sport.
const SPORT_WORDS = /\b(legging|leggings|tights?|joggers?|sweatpants?|track ?pants?|track ?jackets?|track ?suits?|sports? ?bras?|sport|sports|athletic|athleisure|training|workout|gym|yoga|pilates|running|runner|marathon|compression|moisture|wicking|dri-?fit|airlift|spacedye|bike ?shorts?|biker ?shorts?|windbreaker|tennis|golf|pickleball|cycling|hiking)\b/i

// Words that mean the piece is workwear, tailoring, underwear or sleepwear even if its name also says "performance".
const NOT_SPORT = /\b(dress ?pants?|trousers?|chinos?|blazer|suit|oxford|button[- ]?down|polo dress|shirt ?dress|pajamas?|pyjamas?|sleep|robe|lounge|camisole|boxers?|briefs?|thong|panty|panties|socks?|wholester|undershirt|underwear|boots?|bootie|loafers?|mules?|sandals?|heels?|ponte|silk|linen|cashmere|denim|jeans?|trench|coat|cap|beanie|hat)\b/i

const ALLOWED_CATEGORIES = new Set(['Activewear', 'Tops', 'Pants', 'Shorts', 'Knitwear', 'Outerwear', 'Shoes', 'Skirts', 'Dresses', 'Intimates', 'Accessories', 'Swimwear'])

export function isSportswear(product) {
  if (!ALLOWED_CATEGORIES.has(product.category)) return false
  const name = product.name || ''
  const sporty = SPORT_WORDS.test(name)
  if (NOT_SPORT.test(name) && !/\bsports? ?bras?\b|\bleggings?\b|\btights?\b/i.test(name)) return false
  if (SPORT_STORES.has(product.vendor)) return product.category !== 'Swimwear'
  if (!sporty) return false
  // Swimwear only counts when it says it is for sport; accessories only when they are gear.
  if (product.category === 'Swimwear') return /\b(sport|athletic|training|surf|rash)\b/i.test(name)
  return true
}

export const SPORT_KINDS = ['Leggings & tights', 'Sports bras', 'Tops', 'Shorts & skirts', 'Joggers & sweats', 'Jackets & layers', 'Shoes', 'Dresses', 'Gear']

// The sub-group a sportswear item belongs to, for the section's quick filters.
export function sportKind(product) {
  const name = product.name || ''
  if (product.category === 'Shoes') return 'Shoes'
  if (/\bsports? ?bras?\b|\bbra\b|\bbralette\b|\bbra top\b/i.test(name) || product.category === 'Intimates') return 'Sports bras'
  if (/\b(legging|leggings|tights?|jeggings?|capris?|flare)\b/i.test(name)) return 'Leggings & tights'
  if (/\b(jogger|joggers|sweatpants?|track ?pants?|sweatpant|pants?|trousers?|bottoms?)\b/i.test(name) || product.category === 'Pants') return 'Joggers & sweats'
  if (/\b(shorts?|skort|skirt|bike ?shorts?)\b/i.test(name) || product.category === 'Shorts' || product.category === 'Skirts') return 'Shorts & skirts'
  if (/\b(dress|jumpsuit|romper|unitard|bodysuit)\b/i.test(name) || product.category === 'Dresses') return 'Dresses'
  if (/\b(jacket|hoodie|sweatshirt|pullover|quarter[- ]?zip|windbreaker|vest|fleece|crewneck|zip|coat|cardigan|shell)\b/i.test(name) || ['Outerwear', 'Knitwear'].includes(product.category)) return 'Jackets & layers'
  if (product.category === 'Accessories') return 'Gear'
  return 'Tops'
}
