export const retailerNames = [
  'Nordstrom', "Macy's", 'Zara', 'H&M', 'ASOS', "Bloomingdale's", 'Bershka',
  'Saks Fifth Avenue', 'Neiman Marcus', 'Anthropologie', 'Urban Outfitters',
  'Gap', 'Old Navy', 'Banana Republic', 'J.Crew', 'Madewell',
  'Abercrombie & Fitch', 'American Eagle', 'Mango', 'Forever 21', 'Express',
  'Target', 'Walmart', 'Amazon Fashion', 'Revolve', 'Nordstrom Rack',
  'UNIQLO', 'GU', 'MUJI', 'YesStyle', 'MUSINSA', 'W Concept', 'Cider',
  'Pomelo', 'Love, Bonito', 'Charles & Keith',
  'Nike', 'Adidas', 'Lululemon', 'Puma', 'Under Armour',
  'Gucci', 'Louis Vuitton', 'Prada', 'Saint Laurent', 'Bottega Veneta',
  'Burberry', 'Balenciaga', 'Dior', 'Fendi', 'Versace', 'Valentino',
  'Givenchy', 'Loewe', 'Celine', 'Chanel', 'Hermès', 'Alexander McQueen',
  'Moncler', 'Ferragamo', 'Dolce & Gabbana',
]

export const luxuryRetailers = [
  'Gucci', 'Louis Vuitton', 'Prada', 'Saint Laurent', 'Bottega Veneta',
  'Burberry', 'Balenciaga', 'Dior', 'Fendi', 'Versace', 'Valentino',
  'Givenchy', 'Loewe', 'Celine', 'Chanel', 'Hermès', 'Alexander McQueen',
  'Moncler', 'Ferragamo', 'Dolce & Gabbana',
]

// Shared per-retailer search URL templates, parameterized on a query/slug pair
// so both a specific product (retailerSearchUrl) and raw free text
// (webSearchDestinations) can build a real, working destination for the
// same set of stores.
function buildDestinations(query, slug) {
  return {
    Nordstrom: `https://www.nordstrom.com/sr?keyword=${query}`,
    "Macy's": `https://www.macys.com/shop/featured/${slug}`,
    Zara: `https://www.zara.com/us/en/search?searchTerm=${query}`,
    'H&M': `https://www2.hm.com/en_us/search-results.html?q=${query}`,
    ASOS: `https://www.asos.com/us/search/?q=${query}`,
    "Bloomingdale's": `https://www.bloomingdales.com/shop/featured/${slug}`,
    'Saks Fifth Avenue': `https://www.saksfifthavenue.com/search?q=${query}`,
    'Neiman Marcus': `https://www.neimanmarcus.com/search.jsp?N=0&Ntt=${query}`,
    Anthropologie: `https://www.anthropologie.com/search?q=${query}`,
    'Urban Outfitters': `https://www.urbanoutfitters.com/search?q=${query}`,
    Gap: `https://www.gap.com/browse/search.do?searchText=${query}`,
    'Old Navy': `https://oldnavy.gap.com/browse/search.do?searchText=${query}`,
    'Banana Republic': `https://bananarepublic.gap.com/browse/search.do?searchText=${query}`,
    'J.Crew': `https://www.jcrew.com/r/search?Ntrm=${query}`,
    Madewell: `https://www.madewell.com/search?q=${query}`,
    'Abercrombie & Fitch': `https://www.abercrombie.com/shop/us/search?searchTerm=${query}`,
    'American Eagle': `https://www.ae.com/us/en/x/search?text=${query}`,
    Mango: `https://shop.mango.com/us/en/search?q=${query}`,
    Bershka: `https://www.bershka.com/us/search?searchTerm=${query}`,
    'Forever 21': `https://www.forever21.com/us/search?q=${query}`,
    Express: `https://www.express.com/search?q=${query}`,
    Target: `https://www.target.com/s?searchTerm=${query}`,
    Walmart: `https://www.walmart.com/search?q=${query}`,
    'Amazon Fashion': `https://www.amazon.com/s?k=${query}`,
    Revolve: `https://www.revolve.com/r/Search.jsp?search=${query}`,
    'Nordstrom Rack': `https://www.nordstromrack.com/search?keyword=${query}`,
    UNIQLO: `https://www.uniqlo.com/us/en/search?q=${query}`,
    GU: `https://www.gu-global.com/us/en/search?q=${query}`,
    MUJI: `https://www.muji.us/search?q=${query}`,
    YesStyle: `https://www.yesstyle.com/en/list.html?q=${query}`,
    MUSINSA: `https://global.musinsa.com/us/search?keyword=${query}`,
    'W Concept': `https://us.wconcept.com/catalogsearch/result/?q=${query}`,
    Cider: `https://www.shopcider.com/search/results?q=${query}`,
    Pomelo: `https://www.pomelofashion.com/th/en/search?query=${query}`,
    'Love, Bonito': `https://www.lovebonito.com/us/search?q=${query}`,
    'Charles & Keith': `https://www.charleskeith.com/us/search?q=${query}`,
    Nike: `https://www.nike.com/w?q=${query}`,
    Adidas: `https://www.adidas.com/us/search?q=${query}`,
    Lululemon: `https://shop.lululemon.com/search?Ntt=${query}`,
    Puma: `https://us.puma.com/us/en/search?q=${query}`,
    'Under Armour': `https://www.underarmour.com/en-us/search?q=${query}`,
    Gucci: 'https://www.gucci.com/us/en/',
    'Louis Vuitton': 'https://us.louisvuitton.com/eng-us/homepage',
    Prada: 'https://www.prada.com/us/en.html',
    'Saint Laurent': 'https://www.ysl.com/en-us',
    'Bottega Veneta': 'https://www.bottegaveneta.com/en-us',
    Burberry: 'https://us.burberry.com/',
    Balenciaga: 'https://www.balenciaga.com/en-us',
    Dior: 'https://www.dior.com/en_us/fashion',
    Fendi: 'https://www.fendi.com/us-en/',
    Versace: 'https://www.versace.com/us/en/',
    Valentino: 'https://www.valentino.com/en-us/',
    Givenchy: 'https://www.givenchy.com/us/en-US/homepage',
    Loewe: 'https://www.loewe.com/usa/en/home',
    Celine: 'https://www.celine.com/en-us/homepage/',
    Chanel: 'https://www.chanel.com/us/fashion/',
    Hermès: 'https://www.hermes.com/us/en/',
    'Alexander McQueen': 'https://www.alexandermcqueen.com/en-us',
    Moncler: 'https://www.moncler.com/en-us/',
    Ferragamo: 'https://www.ferragamo.com/shop/us/en',
    'Dolce & Gabbana': 'https://www.dolcegabbana.com/en-us/',
  }
}

export function retailerSearchUrl(product) {
  const text = `${product.brand || ''} ${product.name}`.trim()
  const query = encodeURIComponent(text)
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return buildDestinations(query, slug)[product.vendor] || '#'
}

// The catalog can never stock literally everything — no static dataset can.
// When a search doesn't match anything we carry, this gives the raw query
// somewhere real to go: a direct search at the specific store it names (if
// any), plus Google Shopping and Amazon as universal fallbacks — so typing
// anything still surfaces real, live results instead of a dead end.
export function webSearchDestinations(rawQuery) {
  const text = rawQuery.trim()
  if (!text) return []
  const query = encodeURIComponent(text)
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const destinations = buildDestinations(query, slug)

  const lowerText = text.toLowerCase()
  const matchedRetailer = retailerNames.find((name) => lowerText.includes(name.toLowerCase()))

  const results = []
  if (matchedRetailer && destinations[matchedRetailer] && destinations[matchedRetailer] !== '#') {
    results.push({ label: matchedRetailer, url: destinations[matchedRetailer] })
  }
  results.push({ label: 'Google Shopping', url: `https://www.google.com/search?tbm=shop&q=${query}` })
  results.push({ label: 'Amazon', url: `https://www.amazon.com/s?k=${query}` })
  return results
}
