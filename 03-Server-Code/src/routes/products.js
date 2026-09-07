import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

export const productsRouter = Router()

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
