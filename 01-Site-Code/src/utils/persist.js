// Thin localStorage wrapper — read/write can throw (private browsing, disabled
// storage, quota), so every call site gets a safe fallback instead of a crash.
export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore — the feature just won't persist this session.
  }
}
