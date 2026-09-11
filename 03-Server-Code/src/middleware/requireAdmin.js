// Gate for write operations on the catalog. Deliberately simple — a single
// shared secret in a header — since this is a one-admin (the site owner)
// tool, not a multi-user system. GET routes stay public and unguarded.
export function requireAdmin(req, res, next) {
  if (!process.env.ADMIN_KEY) {
    return res.status(500).json({ error: 'ADMIN_KEY is not configured on the server.' })
  }
  if (req.header('x-admin-key') !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Invalid or missing admin key.' })
  }
  next()
}
