import { useEffect, useMemo, useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import { getRealProducts } from '../services/catalogService'
import { parseShoppingIntent, productMatchesIntent } from '../utils/searchIntent'

const tabs = ['Women', 'Men']
const kinds = ['All', 'Jewelry', 'Accessories']
const PAGE_SIZE = 24
const quickSearches = ['Necklace', 'Earrings', 'Ring', 'Bracelet', 'Bag', 'Belt', 'Sunglasses', 'Scarf', 'Wallet', 'Gold', 'Under $100']

// The shared search only understands "Jewelry" or "Accessories" as a whole, so a
// search for "earrings" or "bag" would return every piece in that group. These
// narrow it to the named kind of piece.
const subtypes = [
  [/\bnecklaces?\b/, /necklace|pendant|choker/],
  [/\bearrings?\b/, /earring|hoop|stud/],
  [/\brings?\b/, /\brings?\b|signet/],
  [/\bbracelets?\b/, /bracelet|cuff|bangle/],
  [/\b(bags?|totes?)\b/, /bag|tote|crossbody|satchel|clutch|messenger|backpack|purse/],
  [/\bbelts?\b/, /\bbelt/],
  [/\bsunglasses\b/, /sunglass/],
  [/\b(scarf|scarves)\b/, /scarf|scarves/],
  [/\bwallets?\b/, /wallet|card holder|cardholder/],
]

function matchesSubtype(item, query) {
  const text = query.toLowerCase()
  const name = item.name.toLowerCase()
  return subtypes.every(([asked, nameMatch]) => !asked.test(text) || nameMatch.test(name))
}

export default function JustJewels() {
  const [active, setActive] = useState('Women')
  const [kind, setKind] = useState('All')
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  useEffect(() => { getRealProducts().then((items) => setProducts(items.filter((item) => ['Jewelry', 'Accessories'].includes(item.category)))) }, [])

  const intent = useMemo(() => parseShoppingIntent(query), [query])
  const hasQuery = query.trim().length > 0
  const matches = useMemo(() => {
    const ofKind = kind === 'All' ? products : products.filter((item) => item.category === kind)
    return hasQuery ? ofKind.filter((item) => productMatchesIntent(item, intent) && matchesSubtype(item, query)) : ofKind
  }, [products, kind, intent, hasQuery, query])

  // A gender in the query ("women's earrings") jumps to that tab.
  useEffect(() => { if (intent.gender && intent.gender !== active && tabs.includes(intent.gender)) setActive(intent.gender) }, [intent.gender]) // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => Object.fromEntries(tabs.map((tab) => [tab, matches.filter((item) => item.gender === tab).length])), [matches])
  const filtered = matches.filter((item) => item.gender === active)
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [active, kind, query])
  const visible = filtered.slice(0, visibleCount)
  const otherTab = tabs.find((tab) => tab !== active && counts[tab] > 0)

  return (
    <>
      <section className="mx-4 mt-6 grid max-w-[1440px] overflow-hidden rounded-[2rem] md:grid-cols-2 lg:mx-auto">
        <div className="flex min-h-[440px] flex-col justify-center bg-[#181818] px-6 py-16 text-white md:px-12 lg:px-20"><p className="text-xs font-bold uppercase tracking-widest text-gold-400">The finishing touch</p><h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">Just Jewels</h1><p className="mt-5 max-w-md leading-7 text-neutral-300">Quiet statements, bold gestures, and the small details that make an outfit yours.</p></div>
        <div className="min-h-[440px]"><img src="/assets/unique/just-jewels-hero-v1.webp" alt="Original arrangement of distinct sculptural jewelry and accessories" className="h-full w-full object-cover" /></div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-12 lg:px-8">
        <form role="search" onSubmit={(event) => event.preventDefault()} className="mb-4">
          <label htmlFor="jewels-search" className="sr-only">Search jewelry and accessories</label>
          <div className="flex items-center gap-2 rounded-full border border-neutral-300 px-5 focus-within:border-black">
            <input
              id="jewels-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jewelry & accessories — try “gold earrings” or “tote bag under $200”"
              className="min-h-[48px] w-full bg-transparent text-sm outline-none"
            />
            {hasQuery && <button type="button" onClick={() => setQuery('')} className="min-h-[44px] shrink-0 px-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black">Clear</button>}
          </div>
        </form>
        <div className="mb-6 flex flex-wrap gap-2">
          {quickSearches.map((chip) => (
            <button key={chip} type="button" onClick={() => setQuery(chip === query ? '' : chip)} aria-pressed={query === chip} className={`min-h-[36px] rounded-full border px-4 text-xs font-bold ${query === chip ? 'border-black bg-black text-white' : 'border-neutral-300 hover:border-black'}`}>{chip}</button>
          ))}
        </div>
        <div className="mb-8 flex border-b border-neutral-200">{tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} aria-pressed={active === tab} className={`flex-1 border-b-2 px-3 py-4 text-sm font-bold sm:flex-none sm:px-10 ${active === tab ? 'border-black' : 'border-transparent text-neutral-500'}`}>{tab.toUpperCase()}{hasQuery ? ` (${counts[tab]})` : ''}</button>)}</div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Curated objects</p>
            <h2 className="mt-2 text-2xl font-bold">Wear it your way</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">{kinds.map((value) => <button key={value} onClick={() => setKind(value)} aria-pressed={kind === value} className={`min-h-[36px] rounded-full px-4 text-xs font-bold ${kind === value ? 'bg-black text-white' : 'border border-neutral-300 hover:border-black'}`}>{value.toUpperCase()}</button>)}</div>
            <span className="text-xs font-bold">{filtered.length} ITEMS</span>
          </div>
        </div>
        {filtered.length ? (
          <>
            <ProductGrid products={visible} />
            {filtered.length > visible.length && (
              <div className="mt-12 text-center">
                <p className="text-xs font-bold text-neutral-500">Showing {visible.length} of {filtered.length}</p>
                <button onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="mt-4 min-h-[48px] rounded-full border border-black px-10 text-sm font-bold hover:bg-black hover:text-white">LOAD MORE</button>
              </div>
            )}
          </>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-neutral-100 py-20 text-center" aria-busy="true"><p className="text-sm font-bold text-neutral-500">Loading the collection…</p></div>
        ) : (
          <div className="rounded-2xl bg-neutral-100 px-6 py-20 text-center">
            <h2 className="text-2xl font-bold">{hasQuery ? `No ${active.toLowerCase()}’s pieces match “${query.trim()}”.` : `No ${active.toLowerCase()}’s pieces in this view.`}</h2>
            <p className="mt-2 text-neutral-600">{otherTab ? `There are ${counts[otherTab]} matches under ${otherTab}.` : 'Try a broader search, or clear it to browse everything.'}</p>
            <div className="mt-6 flex justify-center gap-3">
              {otherTab && <button onClick={() => setActive(otherTab)} className="min-h-[44px] rounded-full bg-black px-6 text-sm font-bold text-white">SEE {otherTab.toUpperCase()}</button>}
              {(hasQuery || kind !== 'All') && <button onClick={() => { setQuery(''); setKind('All') }} className="min-h-[44px] rounded-full border border-black px-6 text-sm font-bold">CLEAR FILTERS</button>}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
