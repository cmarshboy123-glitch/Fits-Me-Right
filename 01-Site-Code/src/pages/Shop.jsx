import { ArrowRight, ExternalLink, Search, SlidersHorizontal, X, Zap } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { getProducts, isSampleListing } from '../services/catalogService'
import { searchLiveWeb } from '../services/liveSearchService'
import { filterWebResults, intentLabels, productColorFamily, productMatchesIntent, searchCatalog, shoppingCategories, shoppingColors } from '../utils/searchIntent'
import { luxuryRetailers, webSearchDestinations } from '../utils/retailers'
import { doorDashSearchUrl, fastDeliveryFor, mapsSearchUrl, urgencyPattern, withoutUrgency } from '../utils/fastDelivery'

const priceOptions = [['All prices', ''], ['On a Budget', 'budget'], ['Money to Spend', 'treat'], ["Let's Splurge", 'splurge']]
const womenBodyTypes = ['Straight', 'Curvy', 'Athletic', 'Petite', 'Tall', 'Plus']
const menBodyTypes = ['Slim', 'Balanced', 'Athletic', 'Broad', 'Big & Tall', 'Short']
// Catalog is thousands of items deep now — render a page at a time instead
// of the whole filtered result set, so a broad or empty filter doesn't
// dump every matching card into the DOM at once.
const PAGE_SIZE = 24
// Below this many matches in our own catalog, real listings from around the web
// are fetched automatically to fill the gaps.
const THIN_RESULTS = 40

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [retailer, setRetailer] = useState(searchParams.get('store') || '')
  const [brand, setBrand] = useState(searchParams.get('brand') || '')
  const [gender, setGender] = useState(searchParams.get('gender') || '')
  const [bodyType, setBodyType] = useState(searchParams.get('bodyType') || '')
  const [priceTier, setPriceTier] = useState(searchParams.get('priceTier') || '')
  const [market, setMarket] = useState(searchParams.get('market') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [color, setColor] = useState(searchParams.get('color') || '')
  const [fast, setFast] = useState(searchParams.get('fast') || '')
  // Sample listings (an example name and price, no exact product page) are hidden unless asked for.
  const [samples, setSamples] = useState(searchParams.get('samples') || '')

  const [loaded, setLoaded] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  useEffect(() => { getProducts().then((items) => { setProducts(items); setLoaded(true) }) }, [])

  // The header search (and links like "Women" on the home page) change the URL while
  // this page is already mounted, so the form state has to follow the URL.
  useEffect(() => {
    setQuery(searchParams.get('q') || '')
    setRetailer(searchParams.get('store') || '')
    setBrand(searchParams.get('brand') || '')
    setGender(searchParams.get('gender') || '')
    setBodyType(searchParams.get('bodyType') || '')
    setPriceTier(searchParams.get('priceTier') || '')
    setMarket(searchParams.get('market') || '')
    setCategory(searchParams.get('category') || '')
    setColor(searchParams.get('color') || '')
    setFast(searchParams.get('fast') || '')
    setSamples(searchParams.get('samples') || '')
  }, [searchParams])

  const realProducts = useMemo(() => products.filter((product) => !isSampleListing(product)), [products])
  const sampleProducts = useMemo(() => products.filter(isSampleListing), [products])
  const catalogProducts = samples ? products : realProducts
  // A store or brand in the URL stays selectable even when none of its items are shown.
  const stores = useMemo(() => [...new Set([...catalogProducts.map((product) => product.vendor), ...(retailer ? [retailer] : [])])].sort(), [catalogProducts, retailer])
  const brands = useMemo(() => [...new Set([...catalogProducts.map((product) => product.brand).filter(Boolean), ...(brand ? [brand] : [])])].sort(), [catalogProducts, brand])
  const bodyTypes = gender === 'Women' ? womenBodyTypes : gender === 'Men' ? menBodyTypes : [...new Set([...womenBodyTypes, ...menBodyTypes])]

  // Typing stays responsive while the catalog search catches up.
  const deferredQuery = useDeferredValue(query)
  const search = useMemo(() => (deferredQuery.trim() ? searchCatalog(catalogProducts, deferredQuery) : null), [catalogProducts, deferredQuery])
  const understood = search ? intentLabels(search.intent) : []

  const passesFilters = useMemo(() => (product) => {
    const catalogBodyType = bodyType === 'Balanced' ? 'Regular' : bodyType
    return (!retailer || product.vendor === retailer) && (!brand || product.brand === brand) &&
      (!gender || product.gender === gender) && (!bodyType || product.bodyType?.includes(catalogBodyType)) &&
      (!priceTier || product.priceTier === priceTier) && (!market || product.storeTier === market) &&
      (!category || productMatchesIntent(product, { text: '', color: '', category, maxPrice: null, minPrice: null, size: '', gender: '' })) &&
      (!color || productColorFamily(product.color) === color) &&
      (!fast || fastDeliveryFor(product.vendor))
  }, [retailer, brand, gender, bodyType, priceTier, market, category, color, fast])
  const filtered = useMemo(() => (search ? search.results : catalogProducts).filter(passesFilters), [catalogProducts, search, passesFilters])

  // How many hidden sample listings would match the same search and filters.
  const hiddenSamples = useMemo(() => {
    if (samples || !loaded) return 0
    const pool = deferredQuery.trim() ? searchCatalog(sampleProducts, deferredQuery).results : sampleProducts
    return pool.filter(passesFilters).length
  }, [samples, loaded, deferredQuery, sampleProducts, passesFilters])
  const realShown = samples ? filtered.filter((product) => !isSampleListing(product)).length : filtered.length

  const activeCount = [query, retailer, brand, gender, bodyType, priceTier, market, category, color, fast].filter(Boolean).length
  const guidedSearch = Boolean(searchParams.get('bodyType') || searchParams.get('priceTier'))

  // Reset back to the first page whenever the result set itself changes —
  // otherwise switching to a narrower filter could leave visibleCount past
  // the end of the new (shorter) list.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [filtered])
  const visibleProducts = filtered.slice(0, visibleCount)

  // Real listings from around the web (Google Shopping) for what the catalog
  // can't fully answer. Fetched on its own when our results are thin or only a
  // loosened match; otherwise offered behind a button, because the search quota
  // is shared by every visitor.
  const liveQuery = withoutUrgency(search?.correctedQuery || deferredQuery)
  const webResults = useMemo(() => webSearchDestinations(liveQuery), [liveQuery])
  const [liveResults, setLiveResults] = useState([])
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveRequested, setLiveRequested] = useState(false)
  // Keep only the listings that fit what was actually typed (right color, garment, gender, price).
  const webListings = useMemo(() => (search ? filterWebResults(liveResults, search.intent).filter((result) => result.link) : []), [liveResults, search])
  const canSearchWeb = loaded && Boolean(search) && liveQuery.length >= 3
  const wantLive = canSearchWeb && (filtered.length < THIN_RESULTS || Boolean(search.relaxed) || liveRequested)

  useEffect(() => { setLiveRequested(false) }, [liveQuery])
  useEffect(() => {
    if (!wantLive) { setLiveResults([]); setLiveLoading(false); return undefined }

    let stale = false
    setLiveLoading(true)
    const timer = setTimeout(() => {
      searchLiveWeb(liveQuery)
        .then((results) => { if (!stale) setLiveResults(results) })
        .finally(() => { if (!stale) setLiveLoading(false) })
    }, 600)
    return () => { stale = true; clearTimeout(timer) }
  }, [wantLive, liveQuery])

  const syncUrl = (event) => {
    event?.preventDefault()
    const params = new URLSearchParams()
    Object.entries({ q: query, store: retailer, brand, gender, bodyType, priceTier, market, category, color, fast, samples }).forEach(([key, value]) => { if (value) params.set(key, value) })
    setSearchParams(params)
  }

  const clearAll = () => {
    setQuery(''); setRetailer(''); setBrand(''); setGender(''); setBodyType(''); setPriceTier(''); setMarket(''); setCategory(''); setColor(''); setFast(''); setSamples(''); setSearchParams({})
  }

  // Turning samples on or off keeps every other search and filter as it is.
  const toggleSamples = (value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set('samples', value); else params.delete('samples')
    setSearchParams(params)
  }

  // For a store (or a store named in the search) that has no real listings here, a way to its own site.
  const storeSite = useMemo(() => {
    const named = retailer || webSearchDestinations(liveQuery).find((destination) => !/Google Shopping|Amazon/.test(destination.label))?.label.replace(/ \(searched.*$/, '')
    if (!named) return null
    const link = webSearchDestinations(retailer || liveQuery).find((destination) => destination.label.startsWith(named))
    return link ? { name: named, url: link.url } : null
  }, [retailer, liveQuery])

  return (
    <section className="mx-auto min-h-[70vh] max-w-[1440px] px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-600">The fashion marketplace</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Search the whole closet.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-neutral-600">Search broadly or get precise. Combine clothing type, color, body type, size, price point, store, and brand in one edit.</p>

      {guidedSearch && <div className="mt-8 flex flex-col justify-between gap-5 rounded-2xl border border-gold-200 bg-gold-50 px-5 py-5 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-gold-800">Your concierge search is active</p><p className="mt-2 text-sm font-bold">{gender || 'All collections'} · {bodyType || 'All body types'} · {priceOptions.find(([, value]) => value === priceTier)?.[0] || 'All prices'}</p></div><Link to="/style/shirt-size" className="flex shrink-0 items-center gap-2 text-xs font-black">ADD SIZE + OCCASION <ArrowRight size={16} /></Link></div>}

      <form onSubmit={syncUrl} className="mt-8 flex max-w-4xl rounded-full border border-neutral-300 bg-white p-1.5 shadow-soft transition focus-within:border-gold-400"><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent px-5 py-3 outline-none" placeholder="Try “purple barrel pants” or “black leather jacket under $200”" aria-label="Search all products" /><button className="flex items-center gap-2 rounded-full bg-black px-6 text-sm font-bold text-white transition hover:bg-gold-700"><Search size={18} /><span className="hidden sm:inline">SEARCH</span></button></form>
      {search?.correctedQuery && <p className="mt-3 max-w-4xl text-sm text-neutral-600">Showing results for <span className="font-bold text-black">“{search.correctedQuery}”</span></p>}
      {query && understood.length > 0 && <div className="mt-3 flex max-w-4xl flex-wrap items-center gap-2"><span className="mr-1 text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">We understood</span>{understood.map((label) => <span key={label} className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-[11px] font-bold">{label}</span>)}</div>}

      <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} aria-controls="shop-filters" className="mt-8 flex min-h-12 w-full items-center justify-between rounded-2xl bg-neutral-50 px-5 text-xs font-bold shadow-soft lg:hidden">
        <span className="flex items-center gap-2"><SlidersHorizontal size={15} /> FILTERS {activeCount > 0 && <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] text-black">{activeCount}</span>}</span>
        <span>{filtersOpen ? 'HIDE' : 'SHOW'}</span>
      </button>
      <div id="shop-filters" className={`${filtersOpen ? 'mt-3' : 'hidden'} rounded-[2rem] bg-neutral-50 p-5 shadow-soft sm:p-7 lg:mt-9 lg:block`}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs font-bold"><SlidersHorizontal size={15} /> FILTER THE MARKET {activeCount > 0 && <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] text-black">{activeCount}</span>}</div>{activeCount > 0 && <button onClick={clearAll} className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 transition hover:text-black"><X size={14} /> CLEAR ALL</button>}</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FilterSelect label="Collection" value={gender} onChange={(value) => { setGender(value); setBodyType('') }} options={[['All people', ''], ['Women', 'Women'], ['Men', 'Men'], ['Children', 'Children']]} />
          <FilterSelect label="Body type" value={bodyType} onChange={setBodyType} options={[['All body types', ''], ...bodyTypes.map((value) => [value, value])]} />
          <FilterSelect label="Clothing category" value={category} onChange={setCategory} options={[['All clothing', ''], ...shoppingCategories.map((value) => [value, value])]} />
          <FilterSelect label="Store" value={retailer} onChange={setRetailer} options={[['All stores', ''], ...stores.map((value) => [value, value])]} />
          <FilterSelect label="Fashion brand" value={brand} onChange={setBrand} options={[['All brands', ''], ...brands.map((value) => [value, value])]} />
          <FilterSelect label="Color family" value={color} onChange={setColor} options={[['All colors', ''], ...shoppingColors.map(({ label, value }) => [label, value])]} />
        </div>
        <div className="mt-5"><p className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">Quick color edit</p><div className="flex flex-wrap gap-2"><button onClick={() => setColor('')} aria-pressed={!color} className={`min-h-10 rounded-full px-4 text-[11px] font-bold ${!color ? 'bg-black text-white' : 'border border-neutral-300 bg-white'}`}>ALL</button>{shoppingColors.map((option) => <button key={option.value} onClick={() => setColor(option.value)} aria-label={`Filter by ${option.label}`} aria-pressed={color === option.value} title={option.label} className={`flex min-h-10 items-center gap-2 rounded-full px-3 text-[11px] font-bold ${color === option.value ? 'bg-black text-white' : 'border border-neutral-300 bg-white'}`}><span className="h-4 w-4 rounded-full border border-black/20" style={{ background: option.swatch }} />{option.label}</button>)}</div></div>
        <FilterButtons label="Price point" value={priceTier} onChange={setPriceTier} options={priceOptions} pill />
        <FilterButtons label="Delivery speed" value={fast} onChange={setFast} options={[['Any speed', ''], ['Same-day delivery options', '1']]} />
        <FilterButtons label="Sample listings" value={samples} onChange={setSamples} options={[['Hidden', ''], ['Show them too', '1']]} />
        <FilterButtons label="Market" value={market} onChange={setMarket} options={[['All fashion', ''], ['Luxury', 'Luxury'], ['Asian Market', 'Asian Market'], ['Everyday & Designer', 'Everyday & Designer'], ['Resale & Vintage', 'Resale & Vintage']]} />
        <button onClick={syncUrl} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-xs font-black text-white transition hover:bg-gold-700 sm:w-auto">APPLY SEARCH FILTERS <Search size={15} /></button>
      </div>

      <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-5"><p className="text-sm font-bold">{samples ? `${filtered.length} ITEMS, ${filtered.length - realShown} OF THEM SAMPLE LISTINGS` : `${filtered.length} REAL ITEMS ACROSS ${[...new Set(filtered.map((product) => product.vendor))].length} STORES`}</p><p className="max-w-md text-xs text-neutral-500 sm:text-right">{samples ? 'Real items open the store’s own page; sample listings open the store’s search · ' : 'Every shopping button opens the item on the store’s own site · '}the store confirms live price and stock</p></div>

      {loaded && !samples && hiddenSamples > 0 && (filtered.length < PAGE_SIZE || retailer || market === 'Luxury') && (
        <div className="mb-8 rounded-2xl border border-gold-200 bg-gold-50 px-5 py-5" role="status">
          <p className="text-sm font-bold">{filtered.length === 0 ? 'We don’t have real listings for this yet.' : `Only ${filtered.length} real ${filtered.length === 1 ? 'listing matches' : 'listings match'}.`}</p>
          <p className="mt-1 text-sm leading-6 text-neutral-700">{hiddenSamples} sample {hiddenSamples === 1 ? 'listing also matches' : 'listings also match'}. Those show an example name and price, not a specific item in stock, and open the store&rsquo;s search.</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-black">
            {storeSite && <a href={storeSite.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 underline">Shop {storeSite.name} directly <ExternalLink size={12} /></a>}
            <button type="button" onClick={() => toggleSamples('1')} className="underline">Show the {hiddenSamples} sample {hiddenSamples === 1 ? 'listing' : 'listings'}</button>
          </div>
          {market === 'Luxury' && (
            <div className="mt-4 border-t border-gold-200 pt-4">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-gold-800">Go to the houses themselves</p>
              <div className="mt-2 flex flex-wrap gap-2">{luxuryRetailers.map((house) => { const link = webSearchDestinations(house).find((destination) => destination.label === house); return link ? <a key={house} href={link.url} target="_blank" rel="noreferrer" className="rounded-full border border-gold-300 bg-white px-3 py-1.5 text-[11px] font-bold">{house}</a> : null })}</div>
            </div>
          )}
        </div>
      )}
      {samples && (
        <p className="mb-6 text-sm text-neutral-600">Showing sample listings too. <button type="button" onClick={() => toggleSamples('')} className="font-bold underline">Hide them</button></p>
      )}

      {(fast || urgencyPattern.test(query)) && (
        <div className="mb-8 rounded-2xl border border-gold-200 bg-gold-50 px-5 py-5">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-gold-800"><Zap size={13} aria-hidden="true" /> Need it fast?</p>
          <p className="mt-2 text-sm font-bold">{fast ? 'Showing only stores that offer same-day delivery. Availability depends on your address.' : 'In a hurry? Some stores deliver the same day, and many have store pickup.'}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-black">
            <a href={doorDashSearchUrl(withoutUrgency(liveQuery) || 'clothing')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 underline">Search DoorDash for “{withoutUrgency(liveQuery) || 'clothing'}” <ExternalLink size={12} /></a>
            <a href={mapsSearchUrl(withoutUrgency(liveQuery))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 underline">Find it in stores near me <ExternalLink size={12} /></a>
            <Link to="/fast" className="inline-flex items-center gap-1.5 underline">All fast options <ArrowRight size={12} /></Link>
            {!fast && <button type="button" onClick={() => setFast('1')} className="underline">Show only same-day stores</button>}
          </div>
        </div>
      )}

      {search?.relaxed && filtered.length > 0 && (
        <div className="mb-8 rounded-2xl border border-gold-200 bg-gold-50 px-5 py-4 text-sm" role="status">
          <p className="font-bold">No exact match for “{search.relaxed.dropped.join('” or “')}”.</p>
          <p className="mt-1 text-neutral-700">Showing the closest in our marketplace{understood.length > 0 ? ` (${understood.filter((label) => !label.startsWith('“')).join(', ').toLowerCase()})` : ''}. Real listings that match your exact words are below.</p>
        </div>
      )}
      {search?.partial && !search.relaxed && filtered.length > 0 && <p className="mb-6 text-sm text-neutral-600">Nothing matched every word, so these match some of them, best matches first.</p>}

      {filtered.length ? (
        <>
          <ProductGrid products={visibleProducts} />
          {visibleCount < filtered.length && (
            <div className="mt-10 flex flex-col items-center gap-2">
              <button onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="flex min-h-12 items-center gap-2 rounded-full border border-neutral-300 bg-white px-8 text-sm font-bold transition hover:border-gold-400">LOAD MORE</button>
              <p className="text-xs text-neutral-500">Showing {visibleProducts.length} of {filtered.length}</p>
            </div>
          )}
        </>
      ) : !loaded ? (
        <div className="rounded-2xl bg-neutral-100 px-6 py-16 text-center" aria-busy="true"><p className="text-sm font-bold text-neutral-500">Loading the marketplace…</p></div>
      ) : (
        <div className="rounded-2xl bg-neutral-100 px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">{hiddenSamples > 0 ? 'No real listings matched that yet.' : 'Nothing in our marketplace matched that search.'}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">{hiddenSamples > 0 ? 'See the note above for sample listings and the store’s own site. ' : ''}Try clearing a filter to widen the selection{canSearchWeb ? ', or look below — we sent your search to the wider web.' : '.'}</p>
          <button onClick={clearAll} className="mt-5 text-sm font-bold underline">CLEAR ALL FILTERS</button>
        </div>
      )}

      {canSearchWeb && (
        <div className="mt-14 border-t border-neutral-200 pt-10">
          {liveLoading && <p className="text-xs font-bold uppercase tracking-widest text-neutral-400" role="status">Searching the web for “{liveQuery}”…</p>}

          {!liveLoading && liveResults.length > 0 && webListings.length === 0 && (
            <p className="text-sm text-neutral-600">The web had nothing that matched “{liveQuery}” closely enough to show. Try the store searches below.</p>
          )}

          {!liveLoading && webListings.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-gold-700">Live results from around the web</p>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-neutral-500">{webListings.length} real listing{webListings.length === 1 ? '' : 's'} for “{liveQuery}” right now via Google Shopping, filtered to match your words. Each opens a comparison page listing every seller — prices and stock are live at the source, not from us.</p>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {webListings.map((result, index) => (
                  <a key={`${result.title}-${index}`} href={result.link} target="_blank" rel="noreferrer" className="group min-w-0">
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-soft transition duration-300 group-hover:shadow-lift">
                      {result.thumbnail && <img src={result.thumbnail} alt="" className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105" loading="lazy" referrerPolicy="no-referrer" />}
                    </div>
                    <p className="mt-3 truncate text-[10px] font-bold uppercase tracking-[.14em] text-gold-700">{result.source || 'Multiple sellers'}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">{result.title}</h3>
                    {result.priceLabel && <p className="mt-2 text-sm font-bold">{result.priceLabel}</p>}
                    {search.intent.color && !result.colorConfirmed && <p className="mt-1 text-[10px] text-neutral-400">Color not listed by seller</p>}
                  </a>
                ))}
              </div>
            </div>
          )}

          {!liveLoading && !wantLive && (
            <div className="text-center">
              <p className="text-sm text-neutral-600">Don’t see exactly what you’re after?</p>
              <button onClick={() => setLiveRequested(true)} className="mt-4 min-h-12 rounded-full border border-black px-7 text-xs font-black transition hover:bg-black hover:text-white">SEARCH THE WIDER WEB FOR “{liveQuery.toUpperCase()}”</button>
            </div>
          )}

          {webResults.length > 0 && (
            <div className="mx-auto mt-10 max-w-xl border-t border-neutral-300 pt-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-neutral-500">Or search the stores directly</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {webResults.map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-bold text-white transition hover:bg-gold-600">
                    SEARCH “{liveQuery}” ON {label.toUpperCase()} <ExternalLink size={13} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return <label className="text-xs font-bold"><span className="mb-2 block text-[10px] uppercase tracking-[.18em] text-neutral-500">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-bold outline-none transition focus:border-gold-400">{options.map(([name, optionValue]) => <option key={`${label}-${name}`} value={optionValue}>{name}</option>)}</select></label>
}

function FilterButtons({ label, value, onChange, options }) {
  return <div className="mt-5"><p className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">{label}</p><div className="flex flex-wrap gap-2">{options.map(([name, optionValue]) => <button key={name} onClick={() => onChange(optionValue)} className={`rounded-full px-4 py-2.5 text-xs font-bold transition ${value === optionValue ? 'bg-black text-white' : 'border border-neutral-200 bg-white text-neutral-700 hover:border-gold-400'}`}>{name.toUpperCase()}</button>)}</div></div>
}
