import { API_URL } from './catalogService'

const LIVE_SEARCH_URL = `${API_URL.replace('/api/products', '')}/api/search/live`

// A search already made in this visit is answered from memory, so going back and
// forth between filters never spends the shared monthly search quota twice.
const answered = new Map()

// Real Google Shopping results for searches the hand-curated catalog can't
// answer. Returns [] on any failure — this is a supplementary feature, not
// something that should ever break the Shop page.
export async function searchLiveWeb(query) {
  const trimmed = query.trim()
  if (!trimmed) return []

  const key = trimmed.toLowerCase().replace(/\s+/g, ' ')
  if (answered.has(key)) return answered.get(key)

  try {
    const response = await fetch(`${LIVE_SEARCH_URL}?q=${encodeURIComponent(trimmed)}`)
    if (!response.ok) return []
    const payload = await response.json()
    const results = Array.isArray(payload.results) ? payload.results : []
    if (results.length > 0) answered.set(key, results)
    return results
  } catch (error) {
    console.warn('Live web search unavailable:', error)
    return []
  }
}
