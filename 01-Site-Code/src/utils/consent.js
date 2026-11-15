import { readStorage, writeStorage } from './persist'

// The visitor's cookie choice. Stored in this browser only (it is itself one of the "strictly necessary"
// items described on the Privacy page). Categories:
//   necessary  always on: saved items, Look Book, profiles, this choice
//   analytics  off unless allowed; NOTHING uses it yet
//   marketing  off unless allowed (advertising and affiliate cookies); NOTHING uses it yet
//
// Any code that adds analytics or sets advertising/affiliate cookies MUST wrap itself in
// hasConsent('analytics') or hasConsent('marketing'), and the Privacy page must be updated in the same change.
export const CONSENT_KEY = 'fits-me-right:consent'
const CONSENT_VERSION = 1

export function getConsent() {
  const saved = readStorage(CONSENT_KEY, null)
  return saved && saved.v === CONSENT_VERSION ? saved : null
}

export function hasConsent(category) {
  if (category === 'necessary') return true
  return Boolean(getConsent()?.[category])
}

export function saveConsent({ analytics = false, marketing = false }) {
  const choice = { v: CONSENT_VERSION, analytics: Boolean(analytics), marketing: Boolean(marketing), at: new Date().toISOString().slice(0, 10) }
  writeStorage(CONSENT_KEY, choice)
  return choice
}
