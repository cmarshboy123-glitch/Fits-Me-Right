import { useState } from 'react'
import { ExternalLink, Heart, Search, Zap } from 'lucide-react'
import { fastDeliveryFor } from '../utils/fastDelivery'
import ShoeArt from './ShoeArt'
import GarmentArt from './GarmentArt'
import { useWishlist } from '../context/WishlistContext'
import { retailerSearchUrl } from '../utils/retailers'
import { affiliateUrl, isAffiliateLink, outboundRel } from '../utils/affiliate'

export default function ProductCard({ product }) {
  const { isSaved, toggle } = useWishlist()
  const isRetailerPhoto = /^https?:\/\//.test(product.imageUrl || '')
  const [photoFailed, setPhotoFailed] = useState(false)
  // Anything on the generic department placeholder (or whose retailer photo just
  // failed to load) gets a color-matched illustration instead: a shoe silhouette
  // for Shoes, a garment/jewelry/accessory silhouette for everything else. A
  // hand-curated /assets/unique or /assets/catalog image is neither of those,
  // so it still just renders as a normal photo below.
  const isShoe = product.category === 'Shoes'
  const isPlaceholder = !product.imageUrl || /department-(shoes|clothing|jewelry)/.test(product.imageUrl)
  const useArt = photoFailed || isPlaceholder
  const saved = isSaved(product.id)
  const fastOption = fastDeliveryFor(product.vendor)
  // Clothing sizes mean nothing on jewelry and accessories, and an empty list
  // would just leave a dangling "Listed sizes" label.
  const sizeList = [product.availableShirtSizes, product.availablePantsSizes].find((sizes) => sizes?.length)
  const visibleSizes = !['Jewelry', 'Accessories'].includes(product.category) && sizeList ? sizeList : null
  const verifiedDate = product.verifiedAt
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${product.verifiedAt}T00:00:00Z`))
    : null

  const shortDate = product.verifiedAt
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${product.verifiedAt}T00:00:00Z`))
    : null

  // Every product opens somewhere real: an exact, hand-verified item page when we have
  // one, otherwise a live search at that retailer for this item so nothing dead-ends.
  // A brand that only repeats the store name ("Vessi" / "Vessi Footwear") is just noise on a small card.
  const norm = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const showBrand = Boolean(product.brand) && norm(product.brand) !== norm(product.vendor) && !norm(product.brand).includes(norm(product.vendor)) && !norm(product.vendor).includes(norm(product.brand))
  const isExact = Boolean(product.productUrl)
  const searchUrl = isExact ? null : retailerSearchUrl(product)
  const hasLink = isExact || (searchUrl && searchUrl !== '#')
  const linkUrl = product.productUrl || searchUrl

  return (
    <article className="group min-w-0 bg-transparent">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 shadow-soft transition duration-300 group-hover:shadow-lift">
        {useArt ? (
          isShoe ? <ShoeArt name={product.name} color={product.color} /> : <GarmentArt category={product.category} name={product.name} gender={product.gender} color={product.color} />
        ) : isRetailerPhoto ? (
          // The retailer's own product photo, loaded straight from their CDN.
          // Product shots are on white, so show the whole item instead of cropping,
          // and fall back to the illustration if the image ever disappears.
          <img
            src={product.imageUrl}
            alt={`${product.brand} ${product.name}`}
            className="h-full w-full bg-white object-contain p-3 transition duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => { event.currentTarget.onerror = null; setPhotoFailed(true) }}
          />
        ) : (
          <img
            src={product.imageUrl}
            alt={`Original product-specific catalog rendering of ${product.color ? `${product.color} ` : ''}${product.name}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <span className={`absolute left-2 top-3 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[.1em] backdrop-blur sm:left-3 sm:px-2.5 sm:tracking-[.14em] ${isExact ? 'bg-white/90 text-neutral-800' : hasLink ? 'bg-white/80 text-neutral-600' : 'bg-white/80 text-neutral-500'}`}>
          {isExact ? <><span className="sm:hidden">Verified item</span><span className="hidden sm:inline">Verified retailer item</span></> : hasLink ? 'Shop this look' : 'Preview only'}
        </span>
        <button
          type="button"
          onClick={() => toggle(product)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from your wishlist` : `Save ${product.name} to your wishlist`}
          className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-white/90 transition hover:scale-105 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
        >
          <Heart size={18} strokeWidth={1.6} fill={saved ? '#D3A11E' : 'none'} stroke={saved ? '#D3A11E' : 'currentColor'} />
        </button>
      </div>
      <div className="pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-gold-700">{product.vendor}</p>
          {showBrand && <p className="truncate text-[10px] font-bold uppercase tracking-wide text-neutral-400">{product.brand}</p>}
        </div>
        <h3 className="mt-2 text-sm font-semibold leading-snug">{product.name}</h3>
        {product.fitNote && <p className="mt-1 text-xs leading-4 text-neutral-500">{product.fitNote}</p>}
        {visibleSizes && <p className="mt-2 truncate text-[10px] font-bold uppercase tracking-wide text-neutral-500">Listed sizes {visibleSizes.join(' · ')}</p>}
        <p className="mt-2 text-sm font-bold">{product.currency === "GBP" ? "£" : "$"}{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="block text-[10px] font-medium uppercase tracking-wide text-neutral-500 sm:inline">{shortDate ? `price as of ${shortDate}` : "example price"}</span></p>
        {fastOption && <p className="mt-2 flex items-center gap-1 text-[10px] font-bold text-gold-800"><Zap size={11} aria-hidden="true" /> Same-day delivery may be available via {fastOption.provider}</p>}
        {hasLink ? (
          <a href={affiliateUrl(linkUrl)} target="_blank" rel={outboundRel(linkUrl)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-3 py-3 text-[11px] font-bold text-white transition hover:bg-gold-600">
            {isExact ? <><span className="sm:hidden">VIEW AT {product.vendor.toUpperCase()}</span><span className="hidden sm:inline">OPEN EXACT ITEM AT {product.vendor.toUpperCase()}</span> <ExternalLink size={13} className="shrink-0" /></> : <>SEARCH THIS AT {product.vendor.toUpperCase()} <Search size={13} className="shrink-0" /></>}
          </a>
        ) : (
          <span className="mt-4 flex w-full items-center justify-center rounded-full border border-neutral-300 px-3 py-3 text-[10px] font-bold text-neutral-400">RETAILER LINK COMING SOON</span>
        )}
        {hasLink && <p className="mt-2 text-center text-[10px] leading-4 text-neutral-500">{isExact ? `${verifiedDate ? `Destination verified ${verifiedDate}. ` : ''}Retailer confirms live price, size, and stock.` : `Opens ${product.vendor}’s search for this item — confirm price, size, and stock there.`}{isAffiliateLink(linkUrl) && ' Affiliate link: we may earn a commission.'}</p>}
      </div>
    </article>
  )
}
