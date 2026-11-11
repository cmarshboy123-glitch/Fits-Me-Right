// Hand-checked tuxedo listings. Every name, price, color, photo and link below was read from the
// brand's own product page on `verifiedAt` (nothing is estimated). Prices are that day's US price,
// so the store confirms the live price. These are merged into the catalog whether or not the product
// API answers (see catalogService.js). Ids start at 200001 so they never collide with the API (<= ~11,700)
// or the store-feed items (from 100000, about 25,300 long).
//
// To add one: open the brand's product page, copy the exact name, USD price, color, photo and page
// address, and add a row to `rows`. Do not add an item whose price you could not read.
const verifiedAt = '2026-11-10'

const menBodyTypes = ['Slim', 'Athletic', 'Regular', 'Broad', 'Big & Tall', 'Short']
const priceTierFor = (price) => (price < 60 ? 'budget' : price < 180 ? 'treat' : 'splurge')

// [vendor, name, category, price, color, fit note, photo, product page, market, currency (optional, USD unless stated)]
const rows = [
  ['Brunello Cucinelli', 'Lightweight Twill Tuxedo', 'Suits', 6750, 'Navy',
    'Suit with jacket and trousers',
    'https://media.brunellocucinelli.com/brunellocucinelli-dynamic/image/upload/f_auto,q_auto,dpr_auto/v1791440026/262MF460AS38CG936_F.jpg',
    'https://shop.brunellocucinelli.com/en-us/men/ready-to-wear/suits/lightweight-twill-tuxedo-262MF460AS38CG936.html', 'Luxury'],
  ['Prada', 'Single-Breasted Wool and Mohair Tuxedo', 'Suits', 5200, 'Black',
    'Single-breasted · wool and mohair',
    'https://www.prada.com/content/dam/pradabkg_products/U/UAF/UAF421/1099F0002/UAF421_1099_F0002_S_141_SLF.jpg',
    'https://www.prada.com/us/en/p/single-breasted-wool-and-mohair-tuxedo/UAF421_1099_F0002_S_141', 'Luxury'],
  ['Louis Vuitton', 'Double-Breasted Tuxedo Jacket', 'Outerwear', 4000, 'Navy',
    'Double-breasted jacket',
    'https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton--HUFJ6WFZC609_PM2_Front%20view.jpg',
    'https://us.louisvuitton.com/eng-us/products/double-breasted-tuxedo-jacket-nvprod7400127v/1AIWDY', 'Luxury'],
  ['Dior', 'Classic Tuxedo', 'Outerwear', 4000, 'Black',
    'Black virgin wool grain de poudre',
    'https://assets.christiandior.com/is/image/diorprod/433C712S0687C900_E01?wid=700&fmt=jpeg&qlt=85',
    'https://www.dior.com/en_us/fashion/products/433C712S0687_C900', 'Luxury'],
  ['Giorgio Armani', 'Soho Line Single-Breasted Tuxedo in Wool Crêpe', 'Suits', 5800, 'Black',
    'Single-breasted · wool crêpe',
    'https://assets-cf.armani.com/image/upload/w_700,q_auto,f_auto/v1752112432/GM000707_TE10043_UC001_F_FW2025.jpg',
    'https://www.armani.com/en-us/giorgio-armani/soho-line-single-breasted-tuxedo-in-wool-crepe-cod-GM000707-TE10043-UC001/', 'Luxury'],
  ['Canali', 'Pure Wool 150’s Black Tuxedo Blazer', 'Outerwear', 2695, 'Black',
    'Blazer · pure wool 150’s',
    'https://canalius.vtexassets.com/arquivos/ids/387921/E12786-AX01199-101_a_.jpg.jpg',
    'https://us.canali.com/pure-wool-150s-black-tuxedo-blazer-e12786ax01199101/p', 'Luxury'],
  ['Canali', 'Canali Travel Navy Blue Cashmere Modern-Fit Tuxedo', 'Suits', 6195, 'Navy',
    'Modern fit · cashmere',
    'https://canalius.vtexassets.com/arquivos/ids/378060/E15786-23-AX06219-301_a_.jpg.jpg',
    'https://us.canali.com/canali-travel-navy-blue-cashmere-modern-fit-tuxedo-e15786-23ax06219301/p', 'Luxury'],
  ['Corneliani', 'Black Wool and Mohair Tuxedo', 'Suits', 2100, 'Black',
    'Wool and mohair',
    'https://www.corneliani.com/media/catalog/product/cache/120b6004fe1c16bed483603466d906e3/c/o/corneliani008n93-0004135-020-1.jpg',
    'https://www.corneliani.com/en_us/black-wool-and-mohair-tuxedo-008n93-0004135-020.html', 'Luxury'],
  ['Corneliani', 'Black 130’s Wool Twill Tuxedo', 'Suits', 2500, 'Black',
    '130’s wool twill',
    'https://www.corneliani.com/media/catalog/product/cache/120b6004fe1c16bed483603466d906e3/c/o/corneliani938t70-9398150-020-4.jpg',
    'https://www.corneliani.com/en_us/black-130-s-wool-twill-tuxedo-938t70-9398150-020.html', 'Luxury'],
  ['Tom Ford', 'Luxury Twill O’Connor Tuxedo', 'Suits', 7490, 'Navy',
    'O’Connor cut · luxury twill',
    'https://cdn.media.amplience.net/i/tom_ford/2EYHT1-WOS09_LB999_APPENDGRID?w=700&fmt=jpeg&qlt=85',
    'https://www.tomfordfashion.com/en-us/luxury-twill-oconnor-tuxedo/2EYHT1-WOS09X5N.html', 'Luxury'],
  ['Paul Smith', 'The Soho - Black Wool-Mohair Evening Suit', 'Suits', 1350, 'Black',
    'Tailored fit · wool-mohair · UK store price in pounds (no US price found)',
    'https://assets.paulsmith.com/paul-smith-products/f_auto,q_auto,w_700,h_900,c_pad,b_white/v1710255328/STILL/M1R/M1R-1841-M00002-79/M1R-1841-M00002-79_10.jpg',
    'https://www.paulsmith.com/uk/the-soho-men-s-tailored-fit-black-wool-mohair-one-button-evening-suit', 'Everyday & Designer', 'GBP'],
  ['Brioni', 'Essential Black Super 160’s Wool Policleto Tuxedo', 'Suits', 7500, 'Black',
    'Policleto cut · Super 160’s wool',
    'https://images.ctfassets.net/w2dr5qwt1rrm/5uaKig9diINTxCCGYukdav/1210adb4e1b7a028fbc5e4d395f3affc/RT030LP6A0M0000F.jpg?w=700&fm=jpg&q=80',
    'https://www.brioni.com/en/us/pr/essential-black-super-160s-wool-policleto-tuxedo-RT030LP6A0M0000', 'Luxury'],
  ['Ralph Lauren', 'Gregory Handmade Barathea Peak Tuxedo (Purple Label)', 'Suits', 5995, 'Black',
    'Purple Label · handmade · peak lapel',
    'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1339421_alternate10?wid=700&fmt=jpeg',
    'https://www.ralphlauren.com/men-clothing-suits/gregory-handmade-barathea-peak-tuxedo/0042067579.html', 'Everyday & Designer'],
  ['Ralph Lauren', 'Polo Tailored Wool Barathea Peak Tuxedo', 'Suits', 1398, 'Black',
    'Tailored fit · wool barathea · peak lapel',
    'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1136863_alternate10?wid=700&fmt=jpeg',
    'https://www.ralphlauren.com/men-clothing-suits/polo-tailored-wool-barathea-peak-tuxedo/0076315456.html', 'Everyday & Designer'],
  ['Suitsupply', 'Tailored Fit Havana Tuxedo in Pure S110’s Wool', 'Suits', 748, 'Black',
    'Tailored fit · pure S110’s wool',
    'https://cdn.suitsupply.com/image/upload/f_auto,q_auto,w_700/products/mix_match/default/c6699-s_29',
    'https://suitsupply.com/en-us/men/suits/black-tailored-fit-havana-tuxedo/C6699-S.html', 'Everyday & Designer'],
  ['Proper Cloth', 'Peak Lapel Black Loro Piana S150s Tuxedo Jacket', 'Outerwear', 1545, 'Black',
    'Made to your measurements · Loro Piana S150s wool',
    'https://cdn2.propercloth.com/pic_tccp/94712_621ff1dacf3249bb9a889fc3e593db69_size6.jpg',
    'https://propercloth.com/tailored-clothing/peak-lapel-black-loro-piana-s150s-tuxedo-jacket-94712.html', 'Everyday & Designer'],
  ['Todd Snyder', 'Italian Cashmere Peak Lapel Tuxedo Jacket in Grey', 'Outerwear', 1298, 'Grey',
    'Peak lapel · Italian cashmere',
    'https://www.toddsnyder.com/cdn/shop/files/cashmere-peak-lapel-tuxedo-jacket-in-graytodd-snyder-870383.jpg?width=700',
    'https://www.toddsnyder.com/products/cashmere-peak-lapel-tuxedo-jacketgrey', 'Everyday & Designer'],
  ['Jos. A. Bank', 'Slim Fit Wool Blend Tuxedo Suit', 'Suits', 399.99, 'Black',
    'Slim fit · wool blend · sale price (regularly $550)',
    'https://image.josbank.com/is/image/JosBank/3Y0N_01_JOSEPH_A_BANK_BLACK_MAIN?wid=700&fmt=jpeg&qlt=85',
    'https://www.josbank.com/p/jos-a-bank-slim-fit-wool-blend-tuxedo-suit', 'Everyday & Designer'],
]

const curatedProducts = rows.map(([vendor, name, category, price, color, fitNote, imageUrl, productUrl, storeTier, currency], index) => ({
  id: 200001 + index,
  name,
  gender: 'Men',
  category,
  price,
  // The tier is judged on the number as listed; a pound price of this size is a splurge either way.
  priceTier: priceTierFor(price),
  ...(currency ? { currency } : {}),
  imageUrl,
  vendor,
  brand: vendor,
  color,
  storeTier,
  bodyType: menBodyTypes,
  dressCode: ['Black Tie', 'Formal Attire'],
  fitNote,
  productUrl,
  verifiedAt,
  // Marks the item for the Shop's "Tuxedos" view (/shop?collection=tuxedos).
  tuxedo: true,
}))

export default curatedProducts
