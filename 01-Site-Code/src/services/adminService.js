import { API_URL, invalidateCatalogCache } from './catalogService'

const STORAGE_KEY = 'fmr-admin-key'

export function getStoredAdminKey() {
  try { return sessionStorage.getItem(STORAGE_KEY) || '' } catch { return '' }
}

export function setStoredAdminKey(key) {
  try { sessionStorage.setItem(STORAGE_KEY, key) } catch { /* ignore */ }
}

export function clearStoredAdminKey() {
  try { sessionStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
}

// Every admin write throws AdminAuthError on a 401 so the page can drop back
// to the password gate without treating it as a generic network failure.
export class AdminAuthError extends Error {}

async function adminRequest(path, { method = 'GET', key, body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401) throw new AdminAuthError('Invalid admin key.')
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `Request failed with ${response.status}`)
  }

  invalidateCatalogCache()
  return response.status === 204 ? null : response.json()
}

export function createProduct(key, data) {
  return adminRequest('', { method: 'POST', key, body: data })
}

export function updateProduct(key, id, data) {
  return adminRequest(`/${id}`, { method: 'PUT', key, body: data })
}

export function deleteProduct(key, id) {
  return adminRequest(`/${id}`, { method: 'DELETE', key })
}
