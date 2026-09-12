import { ArrowRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-20 text-center">
      <div>
        <p className="text-xs font-black uppercase tracking-[.28em] text-gold-700">404</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">We couldn’t find that page.</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-neutral-600">The link may be outdated, or the page may have moved. Try searching the marketplace, or head back home.</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link to="/shop" className="flex items-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-bold text-white"><Search size={16} /> SEARCH THE MARKETPLACE</Link>
          <Link to="/" className="flex items-center gap-2 rounded-full border border-neutral-300 px-7 py-4 text-sm font-bold">BACK HOME <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  )
}
