import { useEffect, useMemo, useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import { getProducts } from '../services/catalogService'
import { parseShoppingIntent, productMatchesIntent } from '../utils/searchIntent'

const tabs = ['Women', 'Men', 'Children']
const PAGE_SIZE = 24
const quickSearches = ['Sneakers', 'Boots', 'Sandals', 'Heels', 'Loafers', 'Slippers', 'Ugg', 'Birkenstock', 'Steve Madden', 'Prada', 'Under $100']

export default function CobblerCorner() {
  const [active, setActive] = useState('Women')
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  useEffect(() => { getProducts().then((items) => setProducts(items.filter((item) => item.category === 'Shoes'))) }, [])

  // The same intent parser the main search uses, so "black boots under $150",
  // "birkenstock sandals" or "size 8 sneakers" all work here too (shoe-type
  // words like "boots" or "heels" narrow inside productMatchesIntent).
  const intent = useMemo(() => parseShoppingIntent(query), [query])
  const hasQuery = query.trim().length > 0
  const matches = useMemo(() => {
    if (!hasQuery) return products
    return products.filter((item) => productMatchesIntent(item, intent))
  }, [products, intent, hasQuery])

  // A gender in the query ("women's sandals") jumps to that tab.
  useEffect(() => { if (intent.gender && intent.gender !== active) setActive(intent.gender) }, [intent.gender]) // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => Object.fromEntries(tabs.map((tab) => [tab, matches.filter((item) => item.gender === tab).length])), [matches])
  const filtered = matches.filter((item) => item.gender === active)
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [active, query])
  const visible = filtered.slice(0, visibleCount)
  const otherTab = tabs.find((tab) => tab !== active && counts[tab] > 0)

  return (
    <>
      <section className="relative mx-4 mt-6 min-h-[480px] overflow-hidden rounded-[2rem] text-white lg:mx-8">
        <img src="/assets/unique/cobbler-corner-hero-v1.webp" alt="A gallery of distinct contemporary shoes across categories" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[480px] max-w-[1440px] items-end px-6 pb-12 lg:px-12"><div><p className="text-xs font-bold uppercase tracking-widest">Shoes across the market</p><h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">Cobbler Corner</h1><p className="mt-4 max-w-md leading-7">Compare the right pair across leading retailers, then step directly into the store.</p></div></div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-12 lg:px-8">
        <form role="search" onSubmit={(event) => event.preventDefault()} className="mb-4">
          <label htmlFor="cobbler-search" className="sr-only">Search shoes</label>
          <div className="flex items-center gap-2 rounded-full border border-neutral-300 px-5 focus-within:border-black">
            <input
              id="cobbler-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search shoes — try “black boots under $150” or “Birkenstock sandals”"
              className="min-h-[48px] w-full bg-transparent text-sm outline-none"
            />
            {hasQuery && <button type="button" onClick={() => setQuery('')} className="min-h-[44px] shrink-0 px-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black">Clear</button>}
          </div>
        </form>
        <div className="mb-8 flex flex-wrap gap-2">
          {quickSearches.map((chip) => (
            <button key={chip} type="button" onClick={() => setQuery(chip === query ? '' : chip)} className={`min-h-[36px] rounded-full border px-4 text-xs font-bold ${query === chip ? 'border-black bg-black text-white' : 'border-neutral-300 hover:border-black'}`}>{chip}</button>
          ))}
        </div>
        <div className="mb-8 flex border-b border-neutral-200">{tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`flex-1 border-b-2 px-3 py-4 text-sm font-bold sm:flex-none sm:px-10 ${active === tab ? 'border-black' : 'border-transparent text-neutral-500'}`}>{tab.toUpperCase()}{hasQuery ? ` (${counts[tab]})` : ''}</button>)}</div>
        <div className="mb-6 flex items-end justify-between"><h2 className="text-2xl font-bold">{active}’s shoes</h2><span className="text-xs font-bold">{filtered.length} ITEMS</span></div>
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
        ) : hasQuery ? (
          <div className="rounded-2xl bg-neutral-100 px-6 py-20 text-center">
            <h2 className="text-2xl font-bold">No {active.toLowerCase()}’s shoes match “{query.trim()}”.</h2>
            <p className="mt-2 text-neutral-600">{otherTab ? `There are ${counts[otherTab]} matches under ${otherTab}.` : 'Try a broader search, or clear it to browse every pair.'}</p>
            <div className="mt-6 flex justify-center gap-3">
              {otherTab && <button onClick={() => setActive(otherTab)} className="min-h-[44px] rounded-full bg-black px-6 text-sm font-bold text-white">SEE {otherTab.toUpperCase()}</button>}
              <button onClick={() => setQuery('')} className="min-h-[44px] rounded-full border border-black px-6 text-sm font-bold">CLEAR SEARCH</button>
            </div>
          </div>
        ) : <div className="rounded-2xl bg-neutral-100 py-20 text-center"><h2 className="text-2xl font-bold">New steps are coming soon.</h2><p className="mt-2 text-neutral-600">Our cobblers are putting on the finishing touches.</p></div>}
      </section>
    </>
  )
}
