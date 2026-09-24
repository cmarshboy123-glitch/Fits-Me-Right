import { productColorFamily, shoppingColors } from './searchIntent'

// Shared by ShoeArt and GarmentArt: turns a product's free-text color into a
// concrete hex value those illustrations can tint themselves with.

export function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c) => Math.max(0, Math.min(255, Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount)))
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function bodyColor(color = '') {
  const family = productColorFamily(color)
  const swatch = shoppingColors.find((c) => c.value === family)?.swatch
  let hex = swatch && swatch.startsWith('#') ? swatch : '#a89f91'
  if (family === 'multi') hex = '#a89f91'
  if (family === 'white') hex = '#f4f1ea'
  const lower = color.toLowerCase()
  if (/\b(light|pale|pastel)\b/.test(lower)) hex = shade(hex, 0.3)
  if (/\b(dark|deep)\b/.test(lower)) hex = shade(hex, -0.25)
  return hex
}
