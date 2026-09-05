# Fits Me Right

A responsive fashion-concierge storefront built with React, Vite, Tailwind CSS, and React Router.

## Run locally

```bash
npm install
npm run dev
```

## Catalog architecture

Sample catalog data lives in `src/data/products.json`. UI code consumes it through `src/services/catalogService.js`; replace the service implementation with a vendor API request without changing the page components.

Guided-flow selections persist in React Context for the lifetime of the app session and intentionally do not use local storage.

## Guided marketplace search

The concierge path moves from gender to body type to price point, then opens the marketplace with those filters already applied. The marketplace adds product search plus collection, body type, store, fashion brand, price, and market filters. Shoppers can continue from there into shirt size, pants size, occasion, and saved preference profiles.

Natural-language searches are parsed into structured intent. For example, `black jeans under $100 size 10` becomes color, category, maximum-price, and size filters rather than a literal phrase match. Marketplace inventory is normalized in `src/data/marketplaceInventory.js`; the same fields can later be returned by retailer or affiliate APIs.

## Publish the site

Run `npm run build` to create the deployable `dist` folder. Netlify and Vercel SPA routing configurations are included. See [HOSTING.md](./HOSTING.md) for ordinary static hosting and Squarespace-domain options.
