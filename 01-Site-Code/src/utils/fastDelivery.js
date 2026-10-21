// Fast-delivery options we can honestly point shoppers to. Fits Me Right does not deliver
// anything itself: these are stores that sell through a same-day delivery app, plus plain
// "go get it today" routes. Availability always depends on the shopper's address.
//
// Only retailers with a recent, published announcement are listed. Stores that offered
// same-day delivery years ago are left out until their current status is confirmed.
export const FAST_DELIVERY_CHECKED = 'October 20, 2026'

export const fastDeliveryRetailers = {
  "Macy's": { provider: 'DoorDash', coverage: 'Delivery from 350+ stores', speed: 'as little as an hour', since: 'September 2026' },
  Anthropologie: { provider: 'DoorDash', coverage: 'Delivery from 220+ stores', speed: 'as little as an hour', since: 'September 2026' },
  'Old Navy': { provider: 'DoorDash', coverage: 'Delivery from 1,000+ stores', speed: 'same day', since: 'November 2025' },
  Vans: { provider: 'DoorDash', coverage: 'Delivery from select stores', speed: 'as little as an hour', since: 'September 2026' },
}

export const fastDeliverySources = [
  { label: 'AP: DoorDash adds Macy’s, Anthropologie, The North Face, Vans and Timberland (Sept. 30, 2026)', url: 'https://abcnews.com/Business/wireStory/doordash-partners-macys-anthropologie-expand-clothing-delivery-136895278' },
  { label: 'Digital Commerce 360: Old Navy partners with DoorDash (Nov. 2025)', url: 'https://www.digitalcommerce360.com/2025/11/24/old-navy-doordash-partnership-same-day-delivery/' },
]

export const fastDeliveryFor = (vendor) => fastDeliveryRetailers[vendor] || null

const clean = (text) => String(text || '').trim()

// What DoorDash shows depends on the shopper's address, so this opens its own search.
export const doorDashSearchUrl = (query) => `https://www.doordash.com/search/store/${encodeURIComponent(clean(query).replace(/['’]/g, '') || 'clothing')}/`
export const mapsSearchUrl = (query) => `https://www.google.com/maps/search/${encodeURIComponent(`${clean(query) || 'clothing store'} near me`)}`

// Words that mean "I need this soon". They aren't product words, so search ignores them
// and the shop offers the fast-delivery options instead.
export const urgencyPattern = /\b(asap|tonight|today|same ?day|rush(ed)?|urgent(ly)?|immediately|last ?minute|right now|this weekend)\b/i
export const withoutUrgency = (text) => clean(text).replace(new RegExp(urgencyPattern.source, 'gi'), ' ').replace(/\s+/g, ' ').trim()
