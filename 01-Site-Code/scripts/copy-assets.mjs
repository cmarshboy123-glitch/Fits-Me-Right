// Copies the shared image library from ../02-Public-Assets into public/assets
// so Vite includes them in the build. Runs via postinstall/prebuild since
// 02-Public-Assets is a sibling folder, not part of this package.
import { existsSync, cpSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const siteRoot = path.resolve(fileURLToPath(import.meta.url), '..', '..')
const sourceDir = path.resolve(siteRoot, '..', '02-Public-Assets', 'public', 'assets')
const destDir = path.resolve(siteRoot, 'public', 'assets')

if (!existsSync(sourceDir)) {
  console.warn(`[copy-assets] Source folder not found, skipping: ${sourceDir}`)
  process.exit(0)
}

cpSync(sourceDir, destDir, { recursive: true })
console.log(`[copy-assets] Synced assets from ${sourceDir} to ${destDir}`)
