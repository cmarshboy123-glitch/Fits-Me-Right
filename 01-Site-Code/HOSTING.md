# Publishing Fits Me Right

Fits Me Right is a React single-page application. The production files are created in `dist` by:

```bash
npm install
npm run build
```

## Where it runs today

| Piece | Where | Notes |
|---|---|---|
| Website (this folder) | Kinsta **Sevalla** static site `fits-me-right`, https://fits-me-right-n7dpm.kinsta.page | Built from the public GitHub repo, root directory `01-Site-Code`, build `npm run build`, publish directory `dist`, error file `index.html` (single-page routing) |
| Product API (`03-Server-Code`) | Heroku app `fits-me-right-api` | Serves the full catalog; the site falls back to a small bundled catalog if it can't be reached |
| Domain | `fitsmeright.com`, registered at Squarespace | Add the DNS records Sevalla shows under the site's Domains tab |
| Older copy | Cloudflare Workers, https://fits-me-right.cmarshboy123.workers.dev | Still works; deploy with `npm run deploy` |

### Deploying a change to Sevalla

The repo is connected as a public repository, so pushes to GitHub do **not** deploy by themselves.

1. Push to `main` on GitHub.
2. In Sevalla open Static sites, `fits-me-right`, Deployments, then **Deploy now** (branch `main`).

### The API only answers sites on its allow-list

The Heroku app reads a comma-separated `CORS_ORIGINS` config var. Any new address the site is served from (a new domain, a preview URL) must be added there, otherwise the site silently falls back to the small bundled catalog: Thrifty Shopper shows "coming soon" and the shop has far fewer items. Currently allowed: the Cloudflare address, `http://localhost:5180`, the `kinsta.page` address, `https://fitsmeright.com` and `https://www.fitsmeright.com`.

### Connecting `fitsmeright.com`

1. In Sevalla, Domains, **Add custom domain** (`fitsmeright.com`, then `www.fitsmeright.com`).
2. Sevalla shows a TXT record (ownership) and an A or CNAME record (pointing). Add both at the registrar: Squarespace Domains, then DNS Settings, then Add record.
3. Remove the old "Squarespace Defaults" A, HTTPS and `www` records, which conflict. Leave the email-security records alone.
4. Wait for the records to spread; HTTPS is issued automatically once the domain verifies.

## Other hosts

`netlify.toml`, `vercel.json` and `wrangler.jsonc` all keep React Router pages working when someone opens a deep URL such as `/style/body-type` directly. Each host reads its own file, so no shared `_redirects` file is needed.

**Do not add a `public/_redirects` file.** Cloudflare Workers' static-assets deploy rejects a catch-all `/* /index.html 200` rule as an infinite loop, which fails the deploy outright. Single-page fallback on Workers is handled by `not_found_handling` in `wrangler.jsonc`.

`scripts/copy-assets.mjs` runs automatically via `postinstall`/`prebuild`, so the images in `02-Public-Assets` are copied into `public/assets` on every install and build. A new image only shows in `npm run dev` after running `node scripts/copy-assets.mjs`.

## Squarespace

Squarespace does not accept a Vite/React repository as a template, and rebuilding the filters and guided flow with its blocks would need an external service for the product logic. Squarespace is used only as the domain registrar.
