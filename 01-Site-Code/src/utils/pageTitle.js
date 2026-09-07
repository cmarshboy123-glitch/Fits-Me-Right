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

const routes = [
  [/^\/$/, () => DEFAULT_TITLE],
  [/^\/shop\b/, () => 'Shop the Marketplace'],
  [/^\/cobbler-corner\b/, () => 'Cobbler Corner — Shoes'],
  [/^\/just-jewels\b/, () => 'Just Jewels — Jewelry & Accessories'],
  [/^\/thrifty-shopper\b/, () => 'Thrifty Shopper'],
  [/^\/creative-corner\b/, () => 'Creative Corner'],
  [/^\/wishlist\b/, () => 'Your Wishlist'],
  [/^\/profiles\b/, () => 'Style Profiles'],
  [/^\/about\b/, () => 'Our Fit Promise'],
  [/^\/help\b/, () => 'Help & Contact'],
  [/^\/style\/([\w-]+)/, (match) => `${stepTitles[match[1]] || 'Style Edit'} — Style Edit`],
]

export function getPageTitle(pathname) {
  for (const [pattern, build] of routes) {
    const match = pathname.match(pattern)
    if (match) {
      const title = build(match)
      return title === DEFAULT_TITLE ? title : `${title} | Fits Me Right`
    }
  }
  return 'Page Not Found | Fits Me Right'
}
