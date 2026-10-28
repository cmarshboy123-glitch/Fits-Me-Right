# Fits Me Right

A responsive fashion-concierge storefront built with React, Vite, Tailwind CSS, and React Router.

## Run locally

```bash
npm install
npm run dev
```

## Catalog architecture

Sample catalog data lives in `src/data/products.json`. UI code consumes it through `src/services/catalogService.js`; replace the service implementation with a vendor API request without changing the page components.

Guided-flow selections live in React Context for the current session. Saved style profiles (`src/context/StyleContext.jsx`) and the wishlist (`src/context/WishlistContext.jsx`) persist to `localStorage` so they survive a refresh — both fail gracefully (no crash, feature just doesn't persist) if storage is unavailable, e.g. private browsing.

## Guided marketplace search

The concierge path moves from gender to body type to price point, then opens the marketplace with those filters already applied. The marketplace adds product search plus collection, body type, store, fashion brand, price, and market filters. Shoppers can continue from there into shirt size, pants size, occasion, and saved preference profiles.

Natural-language searches are parsed into structured intent. For example, `black jeans under $100 size 10` becomes color, category, maximum-price, and size filters rather than a literal phrase match. Marketplace inventory is normalized in `src/data/marketplaceInventory.js`; the same fields can later be returned by retailer or affiliate APIs.

## Real items from store feeds

`public/catalog-extra.json` holds about 25,000 real, in-stock products (real name, price, photo and exact product page) from about 75 clothing stores: those that publish a public product feed (Kith, Alo Yoga, Everlane, Faherty, Cult Gaia, Frame and others; the list is in `work/build-extra-catalog.mjs`), plus ME+EM, whose product pages are read directly because it has no feed. Only stores that price in US dollars are used. The site adds the items to whatever the API returns (`src/services/catalogService.js`). The file is stored compactly (shared values in tables, one short row per item, about 0.9 MB over the wire), the search code keeps its per-item lookup tables small, and the page header only loads the catalog once someone uses search. Refresh prices and stock with:

```bash
node work/build-extra-catalog.mjs
```

Retailers don't publish body-type fit or dress codes, so those two fields are assigned generically (every body type for the gender; dress code guessed from the garment). Items from the feed can't be edited in `/admin`, since they aren't in the database.

## Fast delivery (`/fast`)

The "Need it fast" page, the same-day filter in the shop (`?fast=1`), and the note on product cards come from `src/utils/fastDelivery.js`. Fits Me Right doesn't deliver anything: the page points shoppers to stores that sell through DoorDash and to same-day pickup, and says plainly what's realistic for a deadline (a tuxedo rental, for example, needs a week or more). Only retailers with a recent published announcement are listed; update `fastDeliveryRetailers` and `FAST_DELIVERY_CHECKED` when that changes, and keep the sources current.

Running our own delivery (a "get it in an hour" button inside the site) would mean DoorDash Drive: a DoorDash developer account, a sandbox build and review with DoorDash before production keys, a pickup address for every store item, and per-delivery fees (reported at roughly $7 to $11 in the U.S.). It also needs stores' agreement to hand over items, so it isn't built.

## Fit guide (`/fit-guide`)

Short styling suggestions for each of the site's body types, written from published stylist guides and kept in `src/data/fitGuide.js` (the page is `src/pages/FitGuide.jsx`; the body-type step of the style flow links to it). Every entry names its sources, and the page says plainly that these are opinions that the guides don't always agree on. Each "shop the ideas" button is a plain `/shop?gender=…&q=…` search for a garment the advice mentions; stores don't publish body-type fit, so results are not filtered by shape. When you change a button's search, check that it still returns plenty of items.

## Wishlist and style profiles

The heart on any product card saves it to `/wishlist`. The account icon opens `/profiles`, which lists style profiles saved from the guided flow. Both are stored per-browser in `localStorage` — there is no account system or server-side storage.

## Data quality checks

`npm run audit` runs three checks against the merged catalog before you ship a data change:

- `audit:catalog` — every product has a valid category, gender, color, price, and vendor.
- `audit:links` — every product resolves to a real destination: an exact `productUrl` or a working `retailerSearchUrl()` fallback.
- `audit:images` — every `/assets/...` reference in `src` exists in `02-Public-Assets` before it ever reaches Vite.

## Publish the site

Run `npm run build` to create the deployable `dist` folder. The live site runs on Kinsta's Sevalla static hosting; Netlify, Vercel, and Cloudflare Workers (`wrangler.jsonc`) configurations are also included. See [HOSTING.md](./HOSTING.md) for how to deploy a change, the API allow-list, and connecting the domain.
