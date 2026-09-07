# Fits Me Right — API Server

A small Express + Prisma API that serves the product catalog from a real
Postgres database, replacing the static files bundled into the frontend
(`01-Site-Code/src/data/*`). This is the backend half of the Heroku move —
see `../01-Site-Code` for the React site itself, which will eventually call
this API instead of importing those static files directly.

## Stack

- **Express** — HTTP server and routing
- **Prisma** — schema, migrations, and the database client
- **Postgres** — via the Heroku Postgres add-on in production

## Local setup

```bash
npm install
cp .env.example .env      # then fill in a real DATABASE_URL
npm run db:push           # creates the Product table from prisma/schema.prisma
npm run db:seed           # loads the 124 products from 01-Site-Code's data files
npm run dev                # starts the API on http://localhost:3000
```

You need a Postgres database to point `DATABASE_URL` at locally — either a
local Postgres install, or just point it at your Heroku Postgres add-on's
URL (get it with `heroku config:get DATABASE_URL -a <your-app-name>`) once
that exists.

You can sanity-check the migration logic without any database at all:

```bash
node prisma/seed.mjs --dry-run
```

## Deploying to Heroku

Once the Heroku app exists and has the **Heroku Postgres** add-on attached
(this sets `DATABASE_URL` automatically):

```bash
heroku git:remote -a <your-app-name>
heroku config:set CORS_ORIGINS="https://fits-me-right.cmarshboy123.workers.dev"
git subtree push --prefix 03-Server-Code heroku main
```

(`git subtree push` is needed because this server lives in a subfolder of
the same repo as the frontend — Heroku expects a repo root at the app's
top level.)

The `Procfile`'s `release` phase runs `prisma db push` automatically on
every deploy, so the database schema stays in sync with `schema.prisma`
without a manual step. Run `npm run db:seed` once by hand afterward
(`heroku run npm run db:seed -a <your-app-name>`) to load the initial
catalog — it's safe to re-run any time the source data changes.

## API

- `GET /health` — liveness check
- `GET /api/products` — the full catalog, as a JSON array. Deliberately
  unfiltered: all of today's search/filter logic already lives in the
  frontend (`01-Site-Code/src/utils/searchIntent.js`) and keeps working
  unchanged against this array — this route's only job is to be a live,
  editable replacement for the old static import.
- `GET /api/products/:id` — a single product.

## Updating the catalog going forward

Once the frontend is switched over to call this API, the product data no
longer lives in the git-tracked JS/JSON files — it lives in the database.
Use `npm run db:studio` (Prisma Studio, a local admin UI) to browse and
edit rows directly, or write additional scripts against `src/lib/prisma.js`.
