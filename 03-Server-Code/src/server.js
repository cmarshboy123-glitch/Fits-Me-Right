import express from 'express'
import cors from 'cors'
import { productsRouter } from './routes/products.js'
import { liveSearchRouter } from './routes/liveSearch.js'

const app = express()
const port = process.env.PORT || 3000
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    // Allow tools with no Origin header (curl, health checks) and any
    // origin explicitly listed in CORS_ORIGINS.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`Origin ${origin} is not allowed.`))
  },
}))

app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true }))
app.use('/api/products', productsRouter)
app.use('/api/search/live', liveSearchRouter)

app.listen(port, () => {
  console.log(`Fits Me Right API listening on port ${port}`)
})
