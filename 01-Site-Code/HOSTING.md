# Publishing Fits Me Right

Fits Me Right is a React single-page application. The production-ready files are created in `dist` by running:

```bash
npm install
npm run build
```

## Recommended: host the app, use the Squarespace domain

This preserves the complete search, filters, guided flow, routing, and future API integration.

1. Deploy this repository to Netlify, Vercel, Cloudflare Workers, Render, or another static host.
2. Use `npm run build` as the build command and `dist` as the publish/output directory.
3. Add `shop.fitsmeright.com` as the custom domain at the host.
4. If the domain is registered at Squarespace, open its DNS settings and add the CNAME or A record supplied by the host.
5. Use the main Squarespace site for editorial or company pages if desired, and link its Shop navigation to `https://shop.fitsmeright.com`.

The included `netlify.toml`, `vercel.json`, and `wrangler.jsonc` preserve React Router pages when someone visits a deep URL such as `/style/body-type` directly — each host reads its own file, so no shared `_redirects` file is needed (and one caused a real deploy failure on Cloudflare Workers — see below, don't re-add it).

### Cloudflare Workers

`wrangler.jsonc` is already configured for a static-assets Worker (`assets.directory: "./dist"`, SPA fallback via `not_found_handling`). Point the Cloudflare dashboard's build command at `npm run build`, or deploy directly:

```bash
npm run build
npx wrangler deploy
```

`scripts/copy-assets.mjs` runs automatically via `postinstall`/`prebuild`, so the images in `02-Public-Assets` are synced into `public/assets` on every install and build — no manual step needed.

**Do not add a `public/_redirects` file.** That format is for Netlify/Pages-style hosts; Cloudflare Workers' static-assets deploy validates it against its own redirect engine and rejects a catch-all `/* /index.html 200` rule as an infinite loop, which fails the deploy outright. SPA fallback on Workers is handled entirely by `not_found_handling` in `wrangler.jsonc`.

If the Cloudflare dashboard's own Build/Deploy commands are configured directly on the project (Settings → Builds), they take precedence over anything documented here — check there first if a deploy fails and this file is up to date.

## Use Fits Me Right as the main website

Deploy the app to a static host and point `fitsmeright.com` and `www.fitsmeright.com` to it with the DNS records provided by that host. A domain registered through Squarespace can point to a third-party site; Squarespace can remain the domain registrar.

## Squarespace-only rebuild

Squarespace does not accept a Vite/React repository as a native template. Rebuilding the entire experience inside Squarespace would require recreating its pages and filters with Squarespace blocks and custom code, and the product filtering logic would need an external service. Embedding the hosted app in a code block is possible in some plans, but is less reliable for full-screen navigation, mobile behavior, analytics, accessibility, and checkout handoff.

For this project, the recommended production architecture is:

- Squarespace: optional domain registration and marketing/editorial pages.
- Static app host: the Fits Me Right React marketplace.
- Retailers: exact outbound product pages.
- Future catalog API: replace `getProducts()` in `src/services/catalogService.js` without rewriting the interface.
