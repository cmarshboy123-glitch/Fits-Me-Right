import { API_URL } from './catalogService'

const LIVE_SEARCH_URL = `${API_URL.replace('/api/products', '')}/api/search/live`

// Real Google Shopping results for searches the hand-curated catalog can't
// answer. Returns [] on any failure — this is a supplementary feature, not
// something that should ever break the Shop page.
export async function searchLiveWeb(query) {
  const trimmed = query.trim()
  if (!trimmed) return []

  try {
    const response = await fetch(`${LIVE_SEARCH_URL}?q=${encodeURIComponent(trimmed)}`)
    if (!response.ok) return []
    const payload = await response.json()
    return Array.isArray(payload.results) ? payload.results : []
  } catch (error) {
    console.warn('Live web search unavailable:', error)
    return []
  }
}
