// Affiliate links: how the site earns money when someone buys after clicking through to a store.
//
// Everything here is OFF until a store's affiliate program has approved us. While it is off, no link
// changes and the privacy, disclosure and Help pages say we earn nothing. Adding a rule below is
// all it takes to switch a store on: its links are rewritten to the tracking link, marked
// rel="sponsored", and labelled on the card, and those pages switch to the commission wording.
//
// One rule per approved store (hostname without "www."). `wrap` turns the plain store address into
// the tracking link the affiliate network gave us, for example:
//   { hosts: ['nordstrom.com'], wrap: (url) => `https://TRACKING-HOST/click?publisher=OUR_ID&u=${encodeURIComponent(url)}` }
export const affiliateRules = []

export const AFFILIATES_ACTIVE = affiliateRules.length > 0

function ruleFor(url) {
  if (!AFFILIATES_ACTIVE) return null
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return affiliateRules.find((rule) => rule.hosts.some((name) => host === name || host.endsWith(`.${name}`))) || null
  } catch {
    return null
  }
}

export const affiliateUrl = (url) => {
  const rule = ruleFor(url)
  return rule ? rule.wrap(url) : url
}

export const isAffiliateLink = (url) => Boolean(ruleFor(url))

// Search engines ask that paid links carry rel="sponsored".
export const outboundRel = (url) => (ruleFor(url) ? 'sponsored noopener noreferrer' : 'noreferrer')
