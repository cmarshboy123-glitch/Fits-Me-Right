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

// Victoria Beckham's official store (victoriabeckham.com). Name, price, photo and product page were read from
// the store's own product listings on 2026-11-14, and each price was checked against the product page. The
// store showed prices in pounds (GBP) in our browser, so they are listed in pounds with a £ sign rather than
// converted. Only pieces that were in stock on that date are listed.
const vbDate = '2026-11-14'
const vbImage = (file) => `https://cdn.shopify.com/s/files/1/3028/8266/files/${file}?width=700`
const womenBodyTypes = ['Straight', 'Curvy', 'Athletic', 'Petite', 'Tall', 'Plus']
const evening = ['Cocktail Dress', 'Semi-Formal', 'Formal Attire']

// [name, category, price in GBP, color, note, photo file, page handle, dress codes]
const vbRows = [
  ['High Neck Draped Midi Dress', 'Dresses', 950, 'Navy', 'Midi · crepe-back satin', 'VB_1426WDR007689B_MIDNIGHT_11214.jpg', 'high-neck-draped-midi-dress-in-midnight-22830', evening],
  ['Kyra Midi Dress', 'Dresses', 990, 'Navy', 'Midi length', 'VB_1426WDR007612A_MIDNIGHT_1891-V2.jpg', 'kyra-midi-dress-in-midnight-22820', evening],
  ['Lea Midi Dress', 'Dresses', 1100, 'Ivory', 'Midi length', 'VB_1426WDR007684A_IVORY_14277_1.jpg', 'lea-midi-dress-in-ivory-22828', evening],
  ['Aida Gown', 'Dresses', 1290, 'Navy', 'Floor-length gown', 'AidaGowninBlue.jpg', 'aida-gown-in-navy-23402', ['Cocktail Dress', 'Formal Attire', 'Black Tie']],
  ['Florence Gown', 'Dresses', 1190, 'Black', 'Floor-length gown', 'VB_1126WDR007087A_BLACK_3080_c6452207-3965-40b1-a5f3-65cbce0c0ae4.jpg', 'florence-gown-in-black', ['Cocktail Dress', 'Formal Attire', 'Black Tie']],
  ['Long Sleeve Sheer Top', 'Tops', 490, 'Black', 'Sheer · long sleeve', 'Frame303.jpg', 'long-sleeve-sheer-top-in-black-23284', ['Semi-Formal', 'Cocktail Dress']],
  ['Embroidered Scarf Cut-Out Blouse', 'Tops', 850, 'Black', 'Embroidered · cut-out detail', 'Frame298.jpg', 'embroidered-scarf-cut-out-blouse-in-black-light-grey-23271', ['Semi-Formal', 'Cocktail Dress']],
  ['Ornamental Top', 'Tops', 650, 'Ivory', 'Ornamental detailing', 'Frame304.jpg', 'ornamental-top-in-ivory-23286', ['Semi-Formal', 'Cocktail Dress']],
  ['Dorian East-West Clutch in Black Eel-Printed Leather', 'Accessories', 890, 'Black', 'Leather clutch', 'DORIANEASTWESTCLUTCHEELPRINTCALFBLACKB426AAC008080A1.jpg', 'dorian-east-west-clutch-in-black-23341', evening],
  ['Sloane Frame Bag 28 in Dark Olive Distressed Leather', 'Accessories', 1590, 'Green', 'Distressed leather', 'SLOANE-FRAME-BAGB426AAC007810ADARK-OLIVE-2_c5d84e95-b29f-4345-82f8-d7e596bff6da.jpg', 'sloane-frame-bag-in-dark-olive-22900', ['Business Casual', 'Semi-Formal']],
  ['Harlow Mask Halter Back 100 in Black Nappa Leather', 'Shoes', 590, 'Black', '100mm heel · nappa leather', 'HARLOW_MASK_HALTER_BACK_100NAPPABLACK1326FSL0076_40A_1.jpg', 'harlow-mask-halter-back-100-in-black-22416', evening],
]

const victoriaBeckham = vbRows.map(([name, category, price, color, fitNote, file, handle, dressCode], index) => ({
  id: 200101 + index,
  name,
  gender: 'Women',
  category,
  price,
  currency: 'GBP',
  priceTier: priceTierFor(price),
  imageUrl: vbImage(file),
  vendor: 'Victoria Beckham',
  brand: 'Victoria Beckham',
  color,
  storeTier: 'Luxury',
  bodyType: womenBodyTypes,
  dressCode,
  fitNote: `${fitNote} · price in pounds from the store`,
  productUrl: `https://www.victoriabeckham.com/products/${handle}`,
  verifiedAt: vbDate,
}))

// Emmy Kasbit (emmykasbit.com), a Nigerian label. Name, price, photo and page were read from the brand's own
// shop on 2026-11-23, and only pieces marked in stock that day are listed. Their shop prices in Nigerian naira
// (NGN), so prices show with a ₦ sign and are not converted. The price tier below is only a rough filter bucket
// (about 1,500 naira to the dollar) and is never shown. The brand makes suits and tailoring, not tuxedos.
const ekDate = '2026-11-23'
const ekImage = (path) => `https://emmykasbit.com/wp-content/uploads/${path}`
const ekTier = (naira) => priceTierFor(naira / 1500)
const menBody = ['Slim', 'Athletic', 'Regular', 'Broad', 'Big & Tall', 'Short']
const tailored = ['Business Casual', 'Semi-Formal']

// [name, category, gender, price in NGN, color, note, photo path, page slug]
const ekRows = [
  ['Andre Jacket (Cream)', 'Outerwear', 'Men', 250000, 'Cream', 'Double-breasted jacket · relaxed, structured shoulders', '2026/06/E8325EE1-0EFB-42FE-91AE-F6B28A5AEE18-scaled.jpg', 'andre-jacket-cream'],
  ['Andre Pants (Cream)', 'Pants', 'Men', 150000, 'Cream', 'Pleated trousers', '2026/06/548B6CA9-201B-4330-A3EF-26DE1676B2C9-scaled.jpg', 'andre-pants-cream'],
  ['Dato Jacket', 'Outerwear', 'Men', 250000, '', 'Tailored jacket', '2026/06/E060659D-4A82-4CFE-972A-4026799AB121-scaled.jpg', 'dato-jacket-2'],
  ['Dato Pant', 'Pants', 'Men', 200000, '', 'Tailored trousers', '2026/06/8E3BCDAF-DBB1-4F8C-B244-5A024B5DF7C0-scaled.jpg', 'dato-pant-2'],
  ['Rose Shirt', 'Tops', 'Men', 200000, '', 'Shirt', '2026/06/E6148789-8A1C-4840-AFC9-CECC80C268AD-scaled.jpg', 'rose-shirt-3'],
  ['Asher Shirt', 'Tops', 'Men', 150000, '', 'Shirt', '2026/06/C8E47F71-00CB-460D-A800-803B36318A6B-scaled.jpg', 'asher-shirt'],
  ['Ojongo Suit', 'Suits', 'Women', 350000, '', 'Jacket and trousers · contrast panel detail', '2026/06/D1EA842B-2DF9-45DF-8F8B-E6DF2A7F7DFE-scaled.jpg', 'ojongo-suit'],
  ['Ngowari Jacket', 'Outerwear', 'Women', 250000, '', 'Tailored jacket', '2026/06/C360EA71-348C-4A57-8CA4-10F92B927CC9-scaled.jpg', 'ngowari-jacket'],
  ['Ngowari Pants', 'Pants', 'Women', 200000, '', 'Tailored trousers', '2026/06/F698C2B0-6A89-49DE-A5B4-34BC15BD0141-scaled.jpg', 'ngowari-pants'],
  ['Lolia Jacket', 'Outerwear', 'Women', 450000, '', 'Spring/Summer 26 jacket', '2025/12/B63C55EA-CF22-4B30-9DA4-A5C88C45E13B-scaled.jpg', 'lolia-jacket'],
  ['Atili Dress', 'Dresses', 'Women', 605000, '', 'Spring/Summer 26 · long dress with front slit', '2025/12/9DF6A226-B9E9-4644-98FB-5C24357C888E-scaled.jpg', 'atili-dress'],
  ['Rika Shirtdress (Green)', 'Dresses', 'Women', 300000, 'Green', 'Shirtdress', '2026/06/F5A1C0A2-614B-4C57-B933-95572E78F4A4-scaled.jpg', 'rika-shirtdress-green'],
]

const emmyKasbit = ekRows.map(([name, category, gender, price, color, note, photo, slug], index) => ({
  id: 200201 + index,
  name,
  gender,
  category,
  price,
  currency: 'NGN',
  priceTier: ekTier(price),
  imageUrl: ekImage(photo),
  vendor: 'Emmy Kasbit',
  brand: 'Emmy Kasbit',
  ...(color ? { color } : {}),
  storeTier: 'Everyday & Designer',
  bodyType: gender === 'Men' ? menBody : womenBodyTypes,
  dressCode: category === 'Dresses' ? ['Cocktail Dress', 'Semi-Formal'] : tailored,
  fitNote: `${note} · made in Nigeria · price in naira from the brand`,
  productUrl: `https://emmykasbit.com/product/${slug}/`,
  verifiedAt: ekDate,
}))

// Lumina Eligma (a Vancouver label), sold at Wolf & Badger. Prices are Wolf & Badger's US-site dollar prices,
// read from the product pages on 2026-11-23. Only pieces with an add-to-bag button and no sold-out notice that day.
const leDate = '2026-11-23'
const leImage = (slug, hash) => `https://res.cloudinary.com/wolfandbadger/image/upload/f_auto,q_auto:best,c_pad,b_white,w_600,h_800/products/${slug}__${hash}`
const dressy = ['Cocktail Dress', 'Semi-Formal', 'Business Casual']

// [name, category, price USD, color, colorway note, page slug, photo hash, dress codes]
const leRows = [
  ['Opera Blazer Dress', 'Dresses', 712, 'Navy', 'Navy and gold mustard', 'opera-blazer-dress-navy-gold-mustard', 'de333a511f8ede301732a82ad15452fb', dressy],
  ['Neoteric Dress', 'Dresses', 623, 'Gray', 'Gray', 'neoteric-dress-gray', 'ba0c25726a6ddc4f1e8a61333e1a9c4d', dressy],
  ['The Tuxedo Dress', 'Dresses', 689, 'Black', 'Black', 'the-tuxedo-dress-black', '00ae56c0251464462c1db6cdbd0559f6', ['Cocktail Dress', 'Semi-Formal', 'Formal Attire']],
  ['Petals Blazer Dress', 'Dresses', 705, 'Black', 'Black with white stripes', 'petals-blazer-dress-black-white-stripes', 'ff991bebd4fa446cf631e43a94def3d7', dressy],
  ['The Rectangle Shirt Dress', 'Dresses', 375, 'Navy', 'Reversible, navy and mustard gold', 'the-rectangle-shirt-dress-reversible-navy-mustard-gold', '366822cfdf7dd062e7698cd127e5adc0', dressy],
  ['Cascade Silk Cowl Top', 'Tops', 255, 'Navy', 'Navy midnight · silk', 'cascade-silk-cowl-top-navy-midnight', 'abb631b9c8ba6750b526e4031c8ee91b', ['Business Casual', 'Semi-Formal']],
  ['Cascade Silk Cowl Top', 'Tops', 255, 'Green', 'Emerald green · silk', 'cascade-silk-cowl-top-emerald-green', '0b64460547c7bca5985781843da79cff', ['Business Casual', 'Semi-Formal']],
  ['The Vanguard Skirt', 'Skirts', 398, 'Navy', 'Navy and mustard', 'the-vanguard-skirt-navy-mustard', '40ee99494bba64152b1f6bc18dee2809', ['Business Casual', 'Semi-Formal']],
  ['Clean Cut Shorts', 'Shorts', 137, 'Black', 'Black', 'clean-cut-shorts-black', 'b606ac54ea553ca674c907137cc2e3cc', ['Casual', 'Business Casual']],
]

const luminaEligma = leRows.map(([name, category, price, color, note, slug, hash, dressCode], index) => ({
  id: 200301 + index,
  name,
  gender: 'Women',
  category,
  price,
  priceTier: priceTierFor(price),
  imageUrl: leImage(slug, hash),
  vendor: 'Wolf & Badger',
  brand: 'Lumina Eligma',
  color,
  storeTier: 'Everyday & Designer',
  bodyType: womenBodyTypes,
  dressCode,
  fitNote: `${note} · Lumina Eligma, sold at Wolf & Badger`,
  productUrl: `https://www.wolfandbadger.com/us/${slug}/`,
  verifiedAt: leDate,
}))

export default [...curatedProducts, ...victoriaBeckham, ...emmyKasbit, ...luminaEligma]
