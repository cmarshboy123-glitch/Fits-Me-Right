import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

export const liveSearchRouter = Router()

// SerpApi's free tier is capped at 250 searches/month for the whole site, so
// every distinct query is cached for a week before it's allowed to spend
// quota again — repeat searches (the common case) cost nothing.
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
const MAX_RESULTS = 16

function normalizeQuery(raw) {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ')
}

function mapResult(result) {
  return {
    title: result.title,
    price: result.extracted_price ?? null,
    priceLabel: result.price || null,
    source: result.source || null,
    thumbnail: result.thumbnail || null,
    // Google's own comparison page for this exact item — not a single
    // retailer's product page, but a real, specific-item destination (not a
    // generic keyword search) that lists direct links to each seller.
    link: result.product_link || null,
  }
}

liveSearchRouter.get('/', async (req, res) => {
  const rawQuery = typeof req.query.q === 'string' ? req.query.q : ''
  const query = normalizeQuery(rawQuery)
  if (!query) return res.status(400).json({ error: 'q is required.' })

  try {
    const cached = await prisma.liveSearchCache.findUnique({ where: { query } })
    if (cached && Date.now() - cached.createdAt.getTime() < CACHE_TTL_MS) {
      return res.json({ query: rawQuery, results: cached.results, cached: true })
    }

    if (!process.env.SERPAPI_KEY) {
      console.error('GET /api/search/live: SERPAPI_KEY is not configured.')
      return res.json({ query: rawQuery, results: [], cached: false })
    }

    const url = new URL('https://serpapi.com/search.json')
    url.searchParams.set('engine', 'google_shopping')
    url.searchParams.set('q', rawQuery)
    url.searchParams.set('gl', 'us')
    url.searchParams.set('hl', 'en')
    url.searchParams.set('api_key', process.env.SERPAPI_KEY)

    const response = await fetch(url, { signal: AbortSignal.timeout(10000) })
    const payload = await response.json()

    if (!response.ok || payload.error) {
      console.error('GET /api/search/live: SerpApi error:', payload.error || response.status)
      // Serve a stale cache entry rather than nothing if SerpApi itself is down or quota is exhausted.
      if (cached) return res.json({ query: rawQuery, results: cached.results, cached: true, stale: true })
      return res.json({ query: rawQuery, results: [], cached: false })
    }

    const results = (payload.shopping_results || []).slice(0, MAX_RESULTS).map(mapResult)

    await prisma.liveSearchCache.upsert({
      where: { query },
      create: { query, results },
      update: { results, createdAt: new Date() },
    })

    res.json({ query: rawQuery, results, cached: false })
  } catch (error) {
    console.error('GET /api/search/live failed:', error)
    res.json({ query: rawQuery, results: [], cached: false })
  }
})
