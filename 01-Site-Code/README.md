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

## Wishlist and style profiles

The heart on any product card saves it to `/wishlist`. The account icon opens `/profiles`, which lists style profiles saved from the guided flow. Both are stored per-browser in `localStorage` — there is no account system or server-side storage.

## Data quality checks

`npm run audit` runs three checks against the merged catalog before you ship a data change:

- `audit:catalog` — every product has a valid category, gender, color, price, and vendor.
- `audit:links` — every product resolves to a real destination: an exact `productUrl` or a working `retailerSearchUrl()` fallback.
- `audit:images` — every `/assets/...` reference in `src` exists in `02-Public-Assets` before it ever reaches Vite.

## Publish the site

Run `npm run build` to create the deployable `dist` folder. Netlify, Vercel, and Cloudflare Workers (`wrangler.jsonc`) configurations are included. See [HOSTING.md](./HOSTING.md) for ordinary static hosting and Squarespace-domain options.
