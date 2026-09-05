const womenFits = ['Straight', 'Curvy', 'Athletic', 'Petite', 'Tall', 'Plus']
const numericSizes = ['00', '0', '2', '4', '6', '8', '10', '12', '14']
const extendedSizes = [...numericSizes, '16', '18', '20', '22']
const verifiedAt = '2026-08-18'
const menFits = ['Slim', 'Regular', 'Athletic', 'Broad', 'Big & Tall', 'Short']

// Retailer availability changes frequently. These records are a replaceable marketplace
// adapter: a future affiliate/vendor API can return the same normalized fields.
const marketplaceInventory = [
  {
    id: 2001, name: 'Flared Rinse-Wash Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual', 'Business Casual'], category: 'Jeans', color: 'Black', price: 53.99,
    vendor: 'Mango', brand: 'Mango', storeTier: 'Everyday & Designer', availablePantsSizes: ['0', '2', '8', '10'],
    fitNote: 'Mid-rise · flared leg · rinse-wash denim', imageUrl: '/assets/catalog/sku-2001-mango-flared-rinse-jeans-v1.webp', verifiedAt,
    productUrl: 'https://shop.mango.com/us/en/p/women/jeans/flare/flared-rinse-wash-jeans/17027815/99/00',
  },
  {
    id: 2002, name: 'High-Waisted Wide-Leg Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual', 'Business Casual'], category: 'Jeans', color: 'Black Denim', price: 69.99,
    vendor: 'Mango', brand: 'Mango', storeTier: 'Everyday & Designer', availablePantsSizes: ['4', '6', '8', '16', '18', '20', '22'],
    fitNote: 'High-rise · wide leg · stretch cotton denim', imageUrl: '/assets/catalog/sku-2002-mango-high-rise-wide-jeans-v1.webp', verifiedAt,
    productUrl: 'https://shop.mango.com/us/en/p/women/jeans/wideleg/high-waisted-wide-leg-jeans_27021196',
  },
  {
    id: 2003, name: 'Wide-Leg Mid-Rise Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual', 'Business Casual'], category: 'Jeans', color: 'Black Denim', price: 45.99,
    vendor: 'Mango', brand: 'Mango', storeTier: 'Everyday & Designer', availablePantsSizes: numericSizes,
    fitNote: 'Mid-rise · wide leg · full length', imageUrl: '/assets/catalog/sku-2003-mango-mid-rise-wide-jeans-v1.webp', verifiedAt,
    productUrl: 'https://shop.mango.com/us/en/p/women/jeans/wide-leg/wide-leg-mid-rise-jeans/27014075/TN/00',
  },
  {
    id: 2010, name: 'Mid-Rise Push-Up Skinny Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual'], category: 'Jeans', color: 'Black', price: 8.9,
    vendor: 'Bershka', brand: 'Bershka', storeTier: 'Everyday & Designer', availablePantsSizes: ['00', '02', '04', '06', '08', '10', '12'],
    fitNote: 'Mid-rise · skinny fit · push-up cut', imageUrl: '/assets/catalog/sku-2010-bershka-push-up-skinny-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www.bershka.com/us/mid-rise-push-up-skinny-jeans-c0p209484601.html',
  },
  {
    id: 2011, name: 'High-Waist Barrel Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual'], category: 'Jeans', color: 'Black', price: 35.9,
    vendor: 'Bershka', brand: 'Bershka', storeTier: 'Everyday & Designer', availablePantsSizes: ['00', '02', '04', '06', '08', '10', '12'],
    fitNote: 'High-rise · barrel leg · petite, regular, and tall lengths', imageUrl: '/assets/catalog/sku-2011-bershka-black-barrel-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www.bershka.com/us/high-waist-barrel-jeans-c0p207163621.html',
  },
  {
    id: 2012, name: 'Low-Rise Wide-Leg Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual'], category: 'Jeans', color: 'Black', price: 59.9,
    vendor: 'Bershka', brand: 'Bershka', storeTier: 'Everyday & Designer', availablePantsSizes: [...numericSizes, '14'].map((size) => size.padStart(2, '0')),
    fitNote: 'Low-rise · full-length wide leg', imageUrl: '/assets/catalog/sku-2012-bershka-low-rise-wide-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www.bershka.com/us/low-rise-wide-leg-jeans-c0p229736868.html',
  },
  {
    id: 2020, name: 'High Rise Barrel Leg Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual'], category: 'Jeans', color: 'Black', price: 15.99,
    vendor: 'H&M', brand: 'H&M', storeTier: 'Everyday & Designer', availablePantsSizes: extendedSizes,
    fitNote: 'High-rise · softly structured barrel leg', imageUrl: '/assets/catalog/sku-2020-hm-high-rise-barrel-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www2.hm.com/en_us/productpage.1229032001.html',
  },
  {
    id: 2021, name: 'Wide High Waist Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual', 'Business Casual'], category: 'Jeans', color: 'Black Denim', price: 39.99,
    vendor: 'H&M', brand: 'H&M', storeTier: 'Everyday & Designer', availablePantsSizes: extendedSizes,
    fitNote: 'High-rise · wide leg · comfortable stretch waist', imageUrl: '/assets/catalog/sku-2021-hm-wide-high-waist-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www2.hm.com/en_us/productpage.1308115006.html',
  },
  {
    id: 2030, name: "Low Rise '90s Slim Straight Jeans", gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual'], category: 'Jeans', color: 'Black', price: 89.95,
    vendor: 'Gap', brand: 'Gap', storeTier: 'Everyday & Designer', availablePantsSizes: [...numericSizes, '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
    fitNote: 'Low-rise · slim straight · regular, tall, and petite', imageUrl: '/assets/catalog/sku-2030-gap-low-rise-slim-straight-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www.gap.com/browse/product.do?pid=828750002',
  },
  {
    id: 2031, name: "High Rise '90s Slim Straight Jeans", gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual', 'Business Casual'], category: 'Jeans', color: 'Black', price: 64.99,
    vendor: 'Gap', brand: 'Gap', storeTier: 'Everyday & Designer', availablePantsSizes: [...numericSizes, '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
    fitNote: 'High-rise · slim straight · short, regular, and long inseams', imageUrl: '/assets/catalog/sku-2031-gap-high-rise-slim-straight-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www.gap.com/browse/product.do?pid=837253002',
  },
  {
    id: 2032, name: 'Mid Rise Rigid Relaxed Flare Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual', 'Business Casual'], category: 'Jeans', color: 'Black Hawk', price: 74.99,
    vendor: 'Gap', brand: 'Gap', storeTier: 'Everyday & Designer', availablePantsSizes: [...numericSizes, '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
    fitNote: 'Mid-rise · relaxed flare · regular, tall, and petite', imageUrl: '/assets/catalog/sku-2032-gap-relaxed-flare-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www.gap.com/browse/product.do?pid=855709002',
  },
  {
    id: 2040, name: 'TRF High Waist Wide Leg Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual', 'Business Casual'], category: 'Jeans', color: 'Black', price: 59.9,
    vendor: 'Zara', brand: 'Zara', storeTier: 'Everyday & Designer', availablePantsSizes: numericSizes,
    fitNote: 'High-rise · wide leg', imageUrl: '/assets/catalog/sku-2040-zara-high-waist-wide-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www.zara.com/us/en/trf-high-rise-wide-leg-jeans-p05575229.html',
  },
  {
    id: 2041, name: 'TRF Wide-Leg Low-Rise Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual', 'Business Casual'], category: 'Jeans', color: 'Black', price: 59.9,
    vendor: 'Zara', brand: 'Zara', storeTier: 'Everyday & Designer', availablePantsSizes: numericSizes,
    fitNote: 'Low-rise · wide leg · full length', imageUrl: '/assets/catalog/sku-2041-zara-low-rise-wide-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www.zara.com/us/en/trf-wide-leg-low-rise-jeans-p03607220.html',
  },
  {
    id: 2050, name: 'Maeve Colette High-Rise Wide-Leg Full-Length Jeans', gender: 'Women', bodyType: womenFits,
    priceTier: 'treat', dressCode: ['Casual', 'Business Casual'], category: 'Jeans', color: 'Black', price: 140,
    vendor: 'Anthropologie', brand: 'Maeve', storeTier: 'Everyday & Designer', availablePantsSizes: ['23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34'],
    fitNote: 'High-rise · tailored wide leg · standard, tall, petite, and plus fits', imageUrl: '/assets/catalog/sku-2050-maeve-colette-wide-jeans-v1.webp', verifiedAt,
    productUrl: 'https://www.anthropologie.com/shop/maeve-colette-high-rise-wide-leg-full-length-jeans15?color=001&type=STANDARD',
  },
  {
    id: 2100, name: 'Linen Blend Straight Pants', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Casual', 'Business Casual'], category: 'Pants', color: 'Brown', price: 49.9,
    vendor: 'Uniqlo', brand: 'Uniqlo', storeTier: 'Asian Market', availablePantsSizes: ['XS', 'S', 'M', 'L', 'XL'],
    fitNote: 'Straight leg · linen-cotton blend · naturally textured', imageUrl: '/assets/catalog/sku-2100-uniqlo-brown-linen-straight-pants-v1.webp', verifiedAt,
    productUrl: 'https://www.uniqlo.com/us/en/products/E484126-000/00?colorDisplayCode=37',
  },
  {
    id: 2101, name: 'Flare Pants', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Business Casual', 'Professional/Formal Business', 'Cocktail Dress', 'Semi-Formal'], category: 'Pants', color: 'Brown', price: 11.98,
    vendor: 'Zara', brand: 'Zara', storeTier: 'Everyday & Designer', availablePantsSizes: ['0', '2', '4', '6', '8', '10', '12'],
    fitNote: 'High waist · tailored front seam · flared hem', imageUrl: '/assets/catalog/sku-2101-zara-brown-flare-pants-v1.webp', verifiedAt,
    productUrl: 'https://www.zara.com/us/en/flare-pants-p01478226.html',
  },
  {
    id: 2102, name: 'High-Waisted Straight-Leg Pants', gender: 'Women', bodyType: womenFits,
    priceTier: 'budget', dressCode: ['Business Casual', 'Professional/Formal Business', 'Semi-Formal'], category: 'Pants', color: 'Brown Vigore', price: 14.97,
    vendor: 'Zara', brand: 'Zara', storeTier: 'Everyday & Designer', availablePantsSizes: ['0', '2', '4', '6', '8', '10', '12'],
    fitNote: 'High waist · straight leg · elasticized back waist', imageUrl: '/assets/catalog/sku-2102-zara-brown-vigore-straight-pants-v1.webp', verifiedAt,
    productUrl: 'https://www.zara.com/us/en/high-waisted-straight-leg-pants-p02111848.html',
  },
  {
    id: 2103, name: 'Camelia Wide-Leg Contrast-Waistband Trousers', gender: 'Women', bodyType: womenFits,
    priceTier: 'treat', dressCode: ['Casual', 'Business Casual', 'Professional/Formal Business'], category: 'Pants', color: 'Chocolate Brown', price: 155,
    vendor: 'Reiss', brand: 'Reiss', storeTier: 'Everyday & Designer', availablePantsSizes: ['4', '6', '8', '10', '12', '14'],
    fitNote: 'Relaxed wide leg · front pleats · regular and petite fits', imageUrl: '/assets/catalog/sku-2103-reiss-chocolate-contrast-wide-trousers-v1.webp', verifiedAt,
    productUrl: 'https://www.reiss.com/us/en/style/su742353/h44712',
  },
  {
    id: 2104, name: 'Horsebit Silk Jacquard Pants', gender: 'Women', bodyType: womenFits,
    priceTier: 'splurge', dressCode: ['Formal Attire', 'Cocktail Dress', 'Semi-Formal'], category: 'Pants', color: 'Dark Brown', price: 2150,
    vendor: 'Gucci', brand: 'Gucci', storeTier: 'Luxury', availablePantsSizes: ['36', '38', '40', '42', '44', '46', '48'],
    fitNote: 'Silk jacquard · tailored long leg · made in Italy', imageUrl: '/assets/catalog/sku-2104-gucci-dark-brown-silk-jacquard-pants-v1.webp', verifiedAt,
    productUrl: 'https://www.gucci.com/us/en/pr/women/ready-to-wear-for-women/pants-shorts-for-women/long-pants-for-women/horsebit-silk-jacquard-pants-p-852748ZAUDP2206',
  },
  {
    id: 2110, name: 'Regular-Fit Cotton-Blend Suit Pants', gender: 'Men', bodyType: menFits,
    priceTier: 'budget', dressCode: ['Business Casual', 'Professional/Formal Business', 'Formal Attire', 'Semi-Formal'], category: 'Pants', color: 'Brown', price: 15.98,
    vendor: 'Zara', brand: 'Zara', storeTier: 'Everyday & Designer', availablePantsSizes: ['28', '30', '32', '34', '36', '38', '40'],
    fitNote: 'Regular fit · tailored suit pants · stretch cotton blend', imageUrl: '/assets/catalog/sku-2110-zara-men-brown-suit-pants-v1.webp', verifiedAt,
    productUrl: 'https://www.zara.com/us/en/regular-fit-cotton-blend-suit-pants-p04334141.html',
  },
  {
    id: 2111, name: 'Atwell Relaxed-Fit Belted Trousers', gender: 'Men', bodyType: menFits,
    priceTier: 'treat', dressCode: ['Business Casual', 'Professional/Formal Business', 'Semi-Formal'], category: 'Pants', color: 'Brown', price: 265,
    vendor: 'Reiss', brand: 'Reiss', storeTier: 'Everyday & Designer', availablePantsSizes: ['28', '30', '32', '34', '36', '38'],
    fitNote: 'Relaxed wide leg · front pleats · D-ring belt', imageUrl: '/assets/catalog/sku-2111-reiss-men-brown-belted-trousers-v1.webp', verifiedAt,
    productUrl: 'https://www.reiss.com/us/en/style/su782229/h65981',
  },
  {
    id: 2112, name: 'Re-Nylon Pants', gender: 'Men', bodyType: menFits,
    priceTier: 'splurge', dressCode: ['Casual', 'Business Casual'], category: 'Pants', color: 'Cocoa Brown', price: 1650,
    vendor: 'Prada', brand: 'Prada', storeTier: 'Luxury', availablePantsSizes: ['44', '46', '48', '50', '52', '54', '56', '58'],
    fitNote: 'Slim fit · constructed waistband · recycled Re-Nylon', imageUrl: '/assets/catalog/sku-2112-prada-men-cocoa-renylon-pants-v1.webp', verifiedAt,
    productUrl: 'https://www.prada.com/us/en/p/re-nylon-pants/UP0141_1WQ8_F0AEZ_S_OOO',
  },
]

export default marketplaceInventory
