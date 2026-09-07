import { ArrowRight, ExternalLink, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { getProducts } from '../services/catalogService'
import { intentLabels, parseShoppingIntent, productColorFamily, productMatchesIntent, shoppingCategories, shoppingColors } from '../utils/searchIntent'
import { webSearchDestinations } from '../utils/retailers'

const priceOptions = [['All prices', ''], ['On a Budget', 'budget'], ['Mid Range', 'treat'], ["Let's Splurge", 'splurge']]
const womenBodyTypes = ['Straight', 'Curvy', 'Athletic', 'Petite', 'Tall', 'Plus']
const menBodyTypes = ['Slim', 'Balanced', 'Athletic', 'Broad', 'Big & Tall', 'Short']

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

  useEffect(() => { getProducts().then(setProducts) }, [])

  const catalogProducts = products
  const stores = useMemo(() => [...new Set(catalogProducts.map((product) => product.vendor))].sort(), [catalogProducts])
  const brands = useMemo(() => [...new Set(catalogProducts.map((product) => product.brand).filter(Boolean))].sort(), [catalogProducts])
  const bodyTypes = gender === 'Women' ? womenBodyTypes : gender === 'Men' ? menBodyTypes : [...new Set([...womenBodyTypes, ...menBodyTypes])]
  const searchIntent = useMemo(() => parseShoppingIntent(query), [query])
  const understood = intentLabels(searchIntent)

  const filtered = useMemo(() => catalogProducts.filter((product) => {
    const catalogBodyType = bodyType === 'Balanced' ? 'Regular' : bodyType
    return (!query || productMatchesIntent(product, searchIntent)) &&
      (!retailer || product.vendor === retailer) && (!brand || product.brand === brand) &&
      (!gender || product.gender === gender) && (!bodyType || product.bodyType?.includes(catalogBodyType)) &&
      (!priceTier || product.priceTier === priceTier) && (!market || product.storeTier === market) &&
      (!category || productMatchesIntent(product, { text: '', color: '', category, maxPrice: null, minPrice: null, size: '', gender: '' })) &&
      (!color || productColorFamily(product.color) === color)
  }), [catalogProducts, query, searchIntent, retailer, brand, gender, bodyType, priceTier, market, category, color])

  const activeCount = [query, retailer, brand, gender, bodyType, priceTier, market, category, color].filter(Boolean).length
  const webResults = useMemo(() => webSearchDestinations(query), [query])
  const guidedSearch = Boolean(searchParams.get('bodyType') || searchParams.get('priceTier'))

  const syncUrl = (event) => {
    event?.preventDefault()
    const params = new URLSearchParams()
    Object.entries({ q: query, store: retailer, brand, gender, bodyType, priceTier, market, category, color }).forEach(([key, value]) => { if (value) params.set(key, value) })
    setSearchParams(params)
  }

  const clearAll = () => {
    setQuery(''); setRetailer(''); setBrand(''); setGender(''); setBodyType(''); setPriceTier(''); setMarket(''); setCategory(''); setColor(''); setSearchParams({})
  }

  return (
    <section className="mx-auto min-h-[70vh] max-w-[1440px] px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-widest text-[#D3A11E]">The fashion marketplace</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Search the whole closet.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-neutral-600">Search broadly or get precise. Combine clothing type, color, body type, size, price point, store, and brand in one edit.</p>

      {guidedSearch && <div className="mt-8 flex flex-col justify-between gap-5 rounded-2xl border border-neutral-200 bg-[#F5F1E9] px-5 py-5 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-amber-800">Your concierge search is active</p><p className="mt-2 text-sm font-bold">{gender || 'All collections'} · {bodyType || 'All body types'} · {priceOptions.find(([, value]) => value === priceTier)?.[0] || 'All prices'}</p></div><Link to="/style/shirt-size" className="flex shrink-0 items-center gap-2 text-xs font-black">ADD SIZE + OCCASION <ArrowRight size={16} /></Link></div>}

      <form onSubmit={syncUrl} className="mt-8 flex max-w-4xl rounded-full border border-neutral-300 bg-white p-1.5"><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent px-5 py-3 outline-none" placeholder="Try “black pants under $100” or “brown trousers size 10”" aria-label="Search all products" /><button className="flex items-center gap-2 rounded-full bg-black px-6 text-sm font-bold text-white"><Search size={18} /><span className="hidden sm:inline">SEARCH</span></button></form>
      {query && understood.length > 0 && <div className="mt-3 flex max-w-4xl flex-wrap items-center gap-2"><span className="mr-1 text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">We understood</span>{understood.map((label) => <span key={label} className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-[11px] font-bold">{label}</span>)}</div>}

      <div className="mt-9 rounded-[2rem] bg-[#F5F3EE] p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs font-bold"><SlidersHorizontal size={15} /> FILTER THE MARKET {activeCount > 0 && <span className="rounded-full bg-[#D3A11E] px-2 py-0.5 text-[10px]">{activeCount}</span>}</div>{activeCount > 0 && <button onClick={clearAll} className="flex items-center gap-1.5 text-xs font-bold"><X size={14} /> CLEAR ALL</button>}</div>
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
        <FilterButtons label="Market" value={market} onChange={setMarket} options={[['All fashion', ''], ['Luxury', 'Luxury'], ['Asian Market', 'Asian Market'], ['Everyday & Designer', 'Everyday & Designer']]} />
        <button onClick={syncUrl} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-xs font-black text-white sm:w-auto">APPLY SEARCH FILTERS <Search size={15} /></button>
      </div>

      <div className="flex items-center justify-between gap-5 py-6"><p className="text-sm font-bold">{filtered.length} VERIFIED ITEMS ACROSS {[...new Set(filtered.map((product) => product.vendor))].length} STORES</p><p className="max-w-md text-right text-xs text-neutral-500">Every shopping button opens the named item on the official retailer site · retailer confirms live price and stock</p></div>
      {filtered.length ? <ProductGrid products={filtered} /> : (
        <div className="rounded-2xl bg-neutral-100 px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Nothing in our marketplace matched that search.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">Try clearing a filter to widen the selection{query ? ', or keep looking below — we sent your exact search to the wider web.' : '.'}</p>
          <button onClick={clearAll} className="mt-5 text-sm font-bold underline">CLEAR ALL FILTERS</button>
          {webResults.length > 0 && (
            <div className="mx-auto mt-8 max-w-xl border-t border-neutral-300 pt-8">
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-neutral-500">Not in our marketplace yet — search the web directly</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {webResults.map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-bold text-white transition hover:bg-amber-600">
                    SEARCH “{query}” ON {label.toUpperCase()} <ExternalLink size={13} />
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
  return <label className="text-xs font-bold"><span className="mb-2 block text-[10px] uppercase tracking-[.18em] text-neutral-500">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-bold outline-none focus:border-black">{options.map(([name, optionValue]) => <option key={`${label}-${name}`} value={optionValue}>{name}</option>)}</select></label>
}

function FilterButtons({ label, value, onChange, options }) {
  return <div className="mt-5"><p className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">{label}</p><div className="flex flex-wrap gap-2">{options.map(([name, optionValue]) => <button key={name} onClick={() => onChange(optionValue)} className={`rounded-full px-4 py-2.5 text-xs font-bold ${value === optionValue ? 'bg-[#1C1711] text-white' : 'border border-neutral-200 bg-white text-neutral-700'}`}>{name.toUpperCase()}</button>)}</div></div>
}
