import { ExternalLink, Heart, Search } from 'lucide-react'
import { retailerSearchUrl } from '../utils/retailers'

export default function ProductCard({ product }) {
  const visibleSizes = product.availableShirtSizes || product.availablePantsSizes
  const verifiedDate = product.verifiedAt
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${product.verifiedAt}T00:00:00Z`))
    : null

  // Every product opens somewhere real: an exact, hand-verified item page when we have
  // one, otherwise a live search at that retailer for this item so nothing dead-ends.
  const isExact = Boolean(product.productUrl)
  const searchUrl = isExact ? null : retailerSearchUrl(product)
  const hasLink = isExact || (searchUrl && searchUrl !== '#')
  const linkUrl = product.productUrl || searchUrl

  return (
    <article className="group min-w-0 bg-transparent">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F1EFEA]">
        <img
          src={product.imageUrl}
          alt={`Original product-specific catalog rendering of ${product.color ? `${product.color} ` : ''}${product.name}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          loading="lazy"
        />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.14em] backdrop-blur ${isExact ? 'bg-white/90 text-neutral-800' : hasLink ? 'bg-white/80 text-neutral-600' : 'bg-white/80 text-neutral-500'}`}>
          {isExact ? 'Verified retailer item' : hasLink ? 'Shop this look' : 'Preview only'}
        </span>
        <button className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90" aria-label={`Save ${product.name}`}>
          <Heart size={18} strokeWidth={1.6} />
        </button>
      </div>
      <div className="pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-amber-700">{product.vendor}</p>
          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-neutral-400">{product.brand}</p>
        </div>
        <h3 className="mt-2 text-sm font-semibold leading-snug">{product.name}</h3>
        {product.fitNote && <p className="mt-1 text-[11px] leading-4 text-neutral-500">{product.fitNote}</p>}
        {visibleSizes && <p className="mt-2 truncate text-[10px] font-bold uppercase tracking-wide text-neutral-500">Listed sizes {visibleSizes.join(' · ')}</p>}
        <p className="mt-2 text-sm font-bold">${product.price.toFixed(2)} <span className="text-[9px] font-medium uppercase tracking-wide text-neutral-400">price snapshot</span></p>
        {hasLink ? (
          <a href={linkUrl} target="_blank" rel="noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-3 py-3 text-[10px] font-bold text-white transition hover:bg-amber-600">
            {isExact ? <>OPEN EXACT ITEM AT {product.vendor.toUpperCase()} <ExternalLink size={13} /></> : <>SEARCH THIS AT {product.vendor.toUpperCase()} <Search size={13} /></>}
          </a>
        ) : (
          <span className="mt-4 flex w-full items-center justify-center rounded-xl border border-neutral-300 px-3 py-3 text-[10px] font-bold text-neutral-400">RETAILER LINK COMING SOON</span>
        )}
        {hasLink && <p className="mt-2 text-center text-[9px] leading-4 text-neutral-400">{isExact ? `${verifiedDate ? `Destination verified ${verifiedDate}. ` : ''}Retailer confirms live price, size, and stock.` : `Opens ${product.vendor}'s search for this item — confirm price, size, and stock there.`}</p>}
      </div>
    </article>
  )
}
