import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Recycle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { getProducts } from '../services/catalogService'
import { parseShoppingIntent, productMatchesIntent } from '../utils/searchIntent'

const tabs = ['Women', 'Men']
const PAGE_SIZE = 24
const quickSearches = ['Levi’s', 'Vintage dress', 'Denim jacket', 'Sneakers', 'Bags', 'Under $20']

export default function ThriftyShopper() {
  const navigate = useNavigate()
  const [active, setActive] = useState('Women')
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  useEffect(() => { getProducts().then((items) => setProducts(items.filter((item) => item.storeTier === 'Resale & Vintage'))) }, [])

  const intent = useMemo(() => parseShoppingIntent(query), [query])
  const hasQuery = query.trim().length > 0
  const matches = useMemo(() => {
    if (!hasQuery) return products
    return products.filter((item) => productMatchesIntent(item, intent))
  }, [products, intent, hasQuery])

  useEffect(() => { if (intent.gender && intent.gender !== active && tabs.includes(intent.gender)) setActive(intent.gender) }, [intent.gender]) // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => Object.fromEntries(tabs.map((tab) => [tab, matches.filter((item) => item.gender === tab).length])), [matches])
  const filtered = matches.filter((item) => item.gender === active)
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [active, query])
  const visible = filtered.slice(0, visibleCount)
  const otherTab = tabs.find((tab) => tab !== active && counts[tab] > 0)

  return (
    <>
      <section className="mx-auto mt-6 grid max-w-[1440px] overflow-hidden rounded-[2rem] bg-[#F5F0E7] px-4 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div className="flex flex-col justify-center px-2 py-14 lg:px-10 lg:py-16">
          <p className="text-[11px] font-black uppercase tracking-[.28em] text-gold-800">Real secondhand finds</p>
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[.95] tracking-[-.03em] sm:text-6xl">Thrifty<br />Shopper.</h1>
          <p className="mt-6 max-w-xl leading-7 text-neutral-700">One-of-one vintage and resale pieces — real sellers, real prices, real photos. Every item is unique, so once it's gone, it's gone.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => navigate('/style/gender')} className="flex items-center gap-3 rounded-full bg-black px-6 py-4 text-xs font-black text-white">BUILD YOUR STYLE EDIT <ArrowRight size={16} /></button>
            <button onClick={() => navigate('/shop?market=Resale+%26+Vintage')} className="rounded-full border border-neutral-300 bg-white/70 px-6 py-4 text-xs font-black">SHOP THE FULL MARKETPLACE</button>
          </div>
        </div>
        <div className="hidden place-items-center bg-[#D7A928] px-6 py-16 lg:grid">
          <div className="relative grid h-72 w-72 place-items-center rounded-full border-2 border-black sm:h-80 sm:w-80">
            <div className="absolute inset-5 rounded-full border border-dashed border-black/50" />
            <Recycle className="h-24 w-24" strokeWidth={1.3} aria-hidden="true" />
            <span className="absolute bottom-10 text-[10px] font-black uppercase tracking-[.28em]">Wear it again</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12 lg:px-8">
        <form role="search" onSubmit={(event) => event.preventDefault()} className="mb-4">
          <label htmlFor="thrifty-search" className="sr-only">Search vintage & resale</label>
          <div className="flex items-center gap-2 rounded-full border border-neutral-300 px-5 focus-within:border-black">
            <input
              id="thrifty-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search vintage & resale — try “Levi's jeans” or “black bag under $30”"
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
        <div className="mb-6 flex items-end justify-between"><h2 className="text-2xl font-bold">{active}'s vintage &amp; resale</h2><span className="text-xs font-bold">{filtered.length} ITEMS</span></div>
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
            <h2 className="text-2xl font-bold">No {active.toLowerCase()}'s pieces match "{query.trim()}".</h2>
            <p className="mt-2 text-neutral-600">{otherTab ? `There are ${counts[otherTab]} matches under ${otherTab}.` : 'Try a broader search, or clear it to browse everything.'}</p>
            <div className="mt-6 flex justify-center gap-3">
              {otherTab && <button onClick={() => setActive(otherTab)} className="min-h-[44px] rounded-full bg-black px-6 text-sm font-bold text-white">SEE {otherTab.toUpperCase()}</button>}
              <button onClick={() => setQuery('')} className="min-h-[44px] rounded-full border border-black px-6 text-sm font-bold">CLEAR SEARCH</button>
            </div>
          </div>
        ) : <div className="rounded-2xl bg-neutral-100 py-20 text-center"><h2 className="text-2xl font-bold">New finds are coming soon.</h2><p className="mt-2 text-neutral-600">Check back as more vintage and resale pieces are added.</p></div>}
      </section>

      <section className="mx-auto mb-12 max-w-[1440px] px-4 lg:px-8">
        <p className="text-xs leading-6 text-neutral-500">Every piece here is a real, individual listing from an independent seller — not multi-size retail stock, so once a piece sells at the source it may no longer be available. Prices and availability are set by the seller and can change.</p>
      </section>
    </>
  )
}
