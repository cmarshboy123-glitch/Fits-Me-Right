# Fits Me Right: notes for Claude

Read this first. It is public (this repo is public), so it holds facts and rules only: **never add passwords, API keys, recovery codes or personal email addresses to this repo or to chat summaries.** Verify anything marked with a date against the live state before relying on it.

## What this is

A fashion discovery site: shoppers search real products from many stores by body type, size, price and occasion, then click through to the store. It sells nothing itself (no orders, no payments, no accounts).

- `01-Site-Code/` the React 19 + Vite + React Router 7 + Tailwind site (this is where most work happens)
- `02-Public-Assets/` images, copied into `public/assets` by `scripts/copy-assets.mjs` on install and build
- `03-Server-Code/` the Express + Prisma API on Heroku (product database)
- Run it: `cd 01-Site-Code && npm install && npm run dev`. Build: `npm run build`. Data checks: `npm run audit`.
- Read `01-Site-Code/README.md` (catalog, shop filters, fit guide, affiliate links, sample listings) and `01-Site-Code/HOSTING.md` (hosting, DNS, going live) before changing those areas.

## Catalog and honesty rules (these matter)

- Catalog = Heroku API items plus `public/catalog-extra.json` (about 25,000 real items from store feeds). The shop merges them in `src/services/catalogService.js`.
- A **sample listing** is an API item with no `productUrl` (an example name and price, illustration photo). They are **hidden by default**; pages use `getRealProducts()`. Do not generate new fill to make a store look stocked. A store comes back only with real products (feed, affiliate, or hand-verified).
- Prices must come from the retailer and carry a date ("price as of"). Never invent prices, products, reviews, designers or people.
- The legal pages (`src/data/legalPages.js`) must describe what the site really does. If you add accounts, analytics, ads, cookies, affiliate links or a new data flow, update that file in the same change.
- Do not try to get around a store's bot protection (for example Bergdorf Goodman); it is listed as a search link only.
- Do not guess facts about the owner. `OPERATOR_NAME` in `legalPages.js` is empty on purpose until the owner supplies a name; the footer and Terms switch to it automatically.

## Switches that are deliberately off or set conservatively

- `src/utils/affiliate.js`: `affiliateRules` is empty, so no affiliate links and the pages say we earn nothing. Adding a rule turns on tracking links, `rel="sponsored"`, a card label and the commission wording on the Disclosures, Privacy and Help pages together. Never turn on commissions without that wording changing.
- `src/pages/NewCreatives.jsx`: `SAMPLE_EDITION = true` labels the three designers as illustrative examples until the owner confirms they are real and agreed to be featured.

## Hosting, publishing and the offline state

- Hosted on Kinsta's **Sevalla** static hosting. **Deploys are manual** (Sevalla, Static sites, fits-me-right, Deployments, Deploy now, then pick a branch). Pushing to GitHub does not publish. Do not enable auto-deploy without asking.
- **As of Nov 8, 2026 the site is deliberately offline.** Sevalla is serving the `offline` branch (a plain "coming soon" page, noindex), and the old `kinsta.page` address is disabled. `main` holds the real site and is complete. Do **not** deploy `main` unless the owner asks to go live.
- To go live: Deploy now with branch `main`, then Networking, **Purge cache**; check the front page and a deep link such as `/shop`; re-enable the `kinsta.page` address if wanted. Notes are in `HOSTING.md`.
- The product API only answers origins on its allow-list (`CORS_ORIGINS` on Heroku). A new site address must be added or the shop falls back to a tiny bundled catalog. `fitsmeright.com`, `www.fitsmeright.com` and the `kinsta.page` address are already allowed.
- The domain `fitsmeright.com` is registered at Squarespace (DNS is managed there) and points at Sevalla. Every change in that Squarespace account needs an emailed security code that only the account owner can read, and Chrome blocks automated DNS deletions until the user gives a specific "yes" in chat. Sevalla has no password option for static sites and its custom domains can only be deleted (re-adding means new verification records), so do not delete domains to take the site down; use the offline branch instead.
- Mail runs on Google Workspace for `fitsmeright.com` (MX, SPF, DKIM and DMARC records are in DNS). `hello@` is an alias of the main mailbox. The site's contact address lives in `CONTACT_EMAIL` in `legalPages.js`.

## Working rules

- Ask before anything outward-facing or hard to reverse: deploying, deleting domains or DNS records, sending email, signing in to accounts, changing account security settings. A user's approval of one action does not cover a different one.
- Never type or store a user's password. If a sign-in page appears, ask the user to sign in.
- Search through `src/utils/searchIntent.js`; `retailers.js` builds store links. Test a shop shortcut against the real catalog before adding it (some searches match loosely, for example "dress shirt" returns shirt dresses).
- Windows shell quirk: regex escapes (`\s`, `\b`) can get corrupted when passed through shell one-liners. Use the editor tools for regex-heavy edits, and check for stray control characters.
- Verify UI changes in the dev server at desktop and phone widths, and check the console. Commit to `main` with clear messages; do not publish unless asked.

## Handover and open items (as of Nov 2026)

The project is being handed to a family member, who will own the accounts (domain, hosting, GitHub, Heroku, SerpApi, Workspace). A step-by-step checklist exists outside this repo; ask the user for it. Still open: connect real affiliate programs, confirm the Creative Corner designers (or keep the sample label), supply an owner name for the Terms, a lawyer's read of the Privacy and Terms pages, rotating the database password, Squarespace two-factor on the domain account, and sourcing real products for luxury and department stores (they show almost nothing without feeds).
