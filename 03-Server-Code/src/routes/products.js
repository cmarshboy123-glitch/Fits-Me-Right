import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

export const productsRouter = Router()

const arrayFields = ['bodyType', 'dressCode', 'availableShirtSizes', 'availablePantsSizes']
const stringFields = ['name', 'gender', 'category', 'priceTier', 'imageUrl', 'vendor', 'brand', 'color', 'storeTier']
const nullableFields = ['productUrl', 'verifiedAt', 'fitNote']

// Picks only the fields Product actually has out of a request body, so a
// stray extra field (or one holding the wrong type) can't reach Prisma.
function pickProductFields(body) {
  const data = {}
  for (const field of stringFields) if (typeof body[field] === 'string') data[field] = body[field]
  for (const field of arrayFields) if (Array.isArray(body[field])) data[field] = body[field]
  for (const field of nullableFields) if (field in body) data[field] = body[field] || null
  if (typeof body.price === 'number') data.price = body.price
  return data
}

// Mirrors the previous static-import contract exactly: return the whole
// catalog and let the existing client-side search/filter logic (already
// working, already tested) keep doing its job untouched. This route's only
// job is to be a live, editable replacement for the old bundled JSON —
// not to reimplement filtering server-side.
productsRouter.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } })
    res.json(products)
  } catch (error) {
    console.error('GET /api/products failed:', error)
    res.status(500).json({ error: 'Could not load products.' })
  }
})

productsRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid product id.' })

  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    res.json(product)
  } catch (error) {
    console.error(`GET /api/products/${id} failed:`, error)
    res.status(500).json({ error: 'Could not load product.' })
  }
})

// Everything below mutates the catalog and requires the admin key.
productsRouter.use(requireAdmin)

productsRouter.post('/', async (req, res) => {
  const data = pickProductFields(req.body)
  if (!data.name) return res.status(400).json({ error: 'name is required.' })

  try {
    const { _max } = await prisma.product.aggregate({ _max: { id: true } })
    const product = await prisma.product.create({ data: { id: (_max.id || 0) + 1, ...data } })
    res.status(201).json(product)
  } catch (error) {
    console.error('POST /api/products failed:', error)
    res.status(500).json({ error: 'Could not create product.' })
  }
})

productsRouter.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid product id.' })

  try {
    const product = await prisma.product.update({ where: { id }, data: pickProductFields(req.body) })
    res.json(product)
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Product not found.' })
    console.error(`PUT /api/products/${id} failed:`, error)
    res.status(500).json({ error: 'Could not update product.' })
  }
})

productsRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid product id.' })

  try {
    await prisma.product.delete({ where: { id } })
    res.status(204).end()
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Product not found.' })
    console.error(`DELETE /api/products/${id} failed:`, error)
    res.status(500).json({ error: 'Could not delete product.' })
  }
})
