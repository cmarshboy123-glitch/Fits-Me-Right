// Walks every source file for a literal /assets/... image reference and
// confirms the file actually exists in 02-Public-Assets (the source of
// truth synced into public/assets at build time by scripts/copy-assets.mjs).
// This is exactly the class of bug that shipped a homepage hero with two
// missing images and 15 missing product photos — catch it before deploy.
// Run with: npm run audit:images
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const siteRoot = path.resolve(fileURLToPath(import.meta.url), '..', '..')
const srcDir = path.join(siteRoot, 'src')
const assetsRoot = path.resolve(siteRoot, '..', '02-Public-Assets', 'public', 'assets')

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const referencePattern = /\/assets\/[A-Za-z0-9_./-]+\.(?:webp|png|jpe?g|svg)/g
const referenced = new Map() // asset path -> [source files]

for (const file of walk(srcDir)) {
  if (!/\.(jsx?|json|css)$/.test(file)) continue
  const text = readFileSync(file, 'utf8')
  const matches = text.match(referencePattern) || []
  for (const match of matches) {
    const rel = path.relative(siteRoot, file)
    if (!referenced.has(match)) referenced.set(match, [])
    referenced.get(match).push(rel)
  }
}

const missing = []
for (const [assetPath, files] of referenced) {
  const diskPath = path.join(assetsRoot, assetPath.replace(/^\/assets\//, ''))
  if (!existsSync(diskPath)) missing.push({ assetPath, files: [...new Set(files)] })
}

console.log(`Checked ${referenced.size} unique image references against ${assetsRoot}.`)
if (missing.length) {
  console.error(`\n${missing.length} referenced image(s) do not exist:\n`)
  missing.forEach(({ assetPath, files }) => console.error(` - ${assetPath}\n     referenced in: ${files.join(', ')}`))
  process.exit(1)
}
console.log('Every referenced image exists — nothing will 404 at build time.')
