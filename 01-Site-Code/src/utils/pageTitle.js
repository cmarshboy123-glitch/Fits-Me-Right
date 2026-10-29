const stepTitles = {
  gender: 'Choose your collection',
  'body-type': 'Body type',
  price: 'Set your budget',
  'shirt-size': 'Shirt size',
  'pants-size': 'Pants size',
  'dress-code': 'Occasion',
  'save-profile': 'Save your profile',
  results: 'Your matches',
}

const DEFAULT_TITLE = 'Fits Me Right — Your Fashion Concierge'
const DEFAULT_DESCRIPTION = 'Fits Me Right is your fashion concierge — search clothing, shoes, and accessories across dozens of stores and brands by style, body type, price, and fit, then shop the exact item at the retailer.'

// [pattern, title, description, keepOutOfSearch]
const routes = [
  [/^\/$/, DEFAULT_TITLE, DEFAULT_DESCRIPTION],
  [/^\/shop\b/, 'Shop the Marketplace', 'Search clothing, shoes, jewelry and accessories across dozens of stores at once, filtered by body type, size, color, price and brand.'],
  [/^\/fit-guide\b/, 'Fit Guide — Styling Tips by Body Type', 'Short, sourced styling suggestions for six women’s and six men’s body types, each with shortcuts into the shop.'],
  [/^\/fast\b/,'Need It Fast — Same-Day Delivery & Pickup', 'Need a tuxedo, suit or dress today? See same-day delivery through DoorDash, store pickup, and what is realistic for your deadline.'],
  [/^\/cobbler-corner\b/, 'Cobbler Corner — Shoes', 'Compare sneakers, boots, sandals, heels and more across leading retailers, then step directly into the store.'],
  [/^\/just-jewels\b/, 'Just Jewels — Jewelry & Accessories', 'Necklaces, earrings, rings, bracelets, bags, belts and the small details that make an outfit yours, from stores across the market.'],
  [/^\/thrifty-shopper\b/, 'Thrifty Shopper', 'One-of-one vintage and resale pieces from real independent sellers, with real prices and photos.'],
  [/^\/creative-corner\b/, 'Creative Corner', 'A directory and editorial spotlight for independent fashion designers and the ideas shaping what we wear next.'],
  [/^\/wishlist\b/, 'Your Wishlist', DEFAULT_DESCRIPTION, true],
  [/^\/profiles\b/, 'Style Profiles', DEFAULT_DESCRIPTION, true],
  [/^\/about\b/, 'Our Fit Promise', 'Fits Me Right is an independent discovery experience, not a retailer. Here is how we search, how we link out, and what we promise.'],
  [/^\/privacy\b/, 'Privacy', 'What Fits Me Right does and doesn’t do with your information: no accounts, no ads, no tracking.'],
  [/^\/terms\b/, 'Terms of Use', 'The ground rules for using Fits Me Right, an independent clothing discovery site.'],
  [/^\/disclosures\b/, 'How Our Listings Work', 'Where our products come from, how current the prices are, and what Fits Me Right does and doesn’t earn.'],
  [/^\/help\b/,'Help & Contact', 'Answers to common questions about Fits Me Right, prices, sizes and links, plus how to reach us.'],
  [/^\/admin\b/, 'Catalog Manager', DEFAULT_DESCRIPTION, true],
]

const styleStepPattern = /^\/style\/([\w-]+)/

export function getPageMeta(pathname) {
  for (const [pattern, title, description, noindex] of routes) {
    if (pattern.test(pathname)) {
      return { title: title === DEFAULT_TITLE ? title : `${title} | Fits Me Right`, description, noindex: Boolean(noindex) }
    }
  }

  const step = pathname.match(styleStepPattern)
  if (step) {
    return { title: `${stepTitles[step[1]] || 'Style Edit'} — Style Edit | Fits Me Right`, description: DEFAULT_DESCRIPTION, noindex: step[1] !== 'gender' }
  }

  return { title: 'Page Not Found | Fits Me Right', description: DEFAULT_DESCRIPTION, noindex: true }
}

export function getPageTitle(pathname) {
  return getPageMeta(pathname).title
}
