import { Heart, Menu, Search, UserRound, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStyle } from '../context/StyleContext'
import { useWishlist } from '../context/WishlistContext'
import { getProducts } from '../services/catalogService'
import { parseShoppingIntent, productMatchesIntent } from '../utils/searchIntent'
import { retailerSearchUrl } from '../utils/retailers'
import BrandMark from './BrandMark'

const nav = [
  ['Cobbler Corner', '/cobbler-corner'],
  ['Just Jewels', '/just-jewels'],
  ['Thrifty Shopper', '/thrifty-shopper'],
  ['Creative Corner', '/creative-corner'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const blurTimeout = useRef(null)
  const navigate = useNavigate()
  const { updateSelection } = useStyle()
  const { count: wishlistCount } = useWishlist()

  useEffect(() => { getProducts().then(setProducts) }, [])
  useEffect(() => () => clearTimeout(blurTimeout.current), [])

  const startFor = (gender) => {
    updateSelection('gender', gender)
    navigate('/style/body-type')
    setOpen(false)
  }

  const trimmedQuery = query.trim()
  const suggestions = useMemo(() => {
    if (!trimmedQuery || !products.length) return []
    const intent = parseShoppingIntent(trimmedQuery)
    return products.filter((product) => productMatchesIntent(product, intent)).slice(0, 6)
  }, [trimmedQuery, products])

  const runSearch = (value) => {
    setShowSuggestions(false)
    navigate(`/shop?q=${encodeURIComponent(value)}`)
  }

  const openSuggestion = (product) => {
    setShowSuggestions(false)
    const url = product.productUrl || retailerSearchUrl(product)
    if (url && url !== '#') window.open(url, '_blank', 'noreferrer')
    else runSearch(product.name)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-6 px-4 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="Fits Me Right home"><BrandMark /></Link>
        <div className="hidden h-full items-center gap-6 md:flex">
          <button onClick={() => startFor('Women')} className="text-sm font-semibold text-neutral-700 transition hover:text-black">Women</button>
          <button onClick={() => startFor('Men')} className="text-sm font-semibold text-neutral-700 transition hover:text-black">Men</button>
          {nav.map(([label, path]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `text-xs font-semibold transition ${isActive ? 'text-black' : 'text-neutral-500 hover:text-black'}`}>{label}</NavLink>
          ))}
        </div>
        <div className="relative ml-auto hidden max-w-sm flex-1 lg:block">
          <form
            onSubmit={(event) => { event.preventDefault(); runSearch(query) }}
            className="flex items-center rounded-full border border-neutral-200 bg-[#F7F5F0] px-4 py-2.5"
          >
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => { blurTimeout.current = setTimeout(() => setShowSuggestions(false), 150) }}
              onKeyDown={(event) => { if (event.key === 'Escape') event.currentTarget.blur() }}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search any clothing, brand, or store"
              aria-label="Search"
              autoComplete="off"
              role="combobox"
              aria-expanded={showSuggestions && trimmedQuery.length > 0}
              aria-controls="header-search-suggestions"
            />
            <button aria-label="Submit search"><Search size={19} /></button>
          </form>
          {showSuggestions && trimmedQuery.length > 0 && (
            <div id="header-search-suggestions" className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
              {suggestions.length > 0 ? (
                <ul>
                  {suggestions.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => openSuggestion(product)}
                        className="flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-2.5 text-left transition hover:bg-neutral-50"
                      >
                        <img src={product.imageUrl} alt="" className="h-11 w-9 shrink-0 rounded-md object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-bold">{product.name}</span>
                          <span className="block truncate text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{product.vendor} · {product.category}</span>
                        </span>
                        <span className="shrink-0 text-xs font-bold">${product.price.toFixed(0)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 text-xs text-neutral-500">No quick matches yet — press Enter to search the whole marketplace.</p>
              )}
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => runSearch(query)}
                className="flex w-full items-center justify-center gap-2 bg-[#F7F5F0] px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-neutral-700 hover:bg-neutral-100"
              >
                <Search size={13} /> See all results for &ldquo;{trimmedQuery}&rdquo;
              </button>
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-4 text-neutral-700 lg:ml-0">
          <button aria-label="Search" onClick={() => navigate('/shop')} className="lg:hidden"><Search size={21} /></button>
          <Link to="/wishlist" aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} saved` : ''}`} className="relative">
            <Heart size={21} />
            {wishlistCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#D3A11E] px-1 text-[9px] font-black text-black">{wishlistCount > 9 ? '9+' : wishlistCount}</span>}
          </Link>
          <Link to="/profiles" aria-label="Your style profiles" className="hidden sm:block"><UserRound size={21} /></Link>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="md:hidden">{open ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </div>
      {open && (
        <div className="border-t border-neutral-200 bg-white px-4 py-6 md:hidden">
          <div className="flex flex-col gap-5 text-sm font-bold">
            <button className="text-left" onClick={() => startFor('Women')}>Women</button>
            <button className="text-left" onClick={() => startFor('Men')}>Men</button>
            {nav.map(([label, path]) => <Link key={path} to={path} onClick={() => setOpen(false)}>{label}</Link>)}
            <div className="mt-1 flex flex-col gap-5 border-t border-neutral-200 pt-5 text-neutral-600">
              <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}</Link>
              <Link to="/profiles" onClick={() => setOpen(false)}>Style Profiles</Link>
              <Link to="/about" onClick={() => setOpen(false)}>Our Fit Promise</Link>
              <Link to="/help" onClick={() => setOpen(false)}>Help &amp; Contact</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
