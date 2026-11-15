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
      {/* Editorial layout: a quiet grey stage, the whole item shown, details in small type underneath. */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F3F2EF]">
        {useArt ? (
          isShoe ? <ShoeArt name={product.name} color={product.color} /> : <GarmentArt category={product.category} name={product.name} gender={product.gender} color={product.color} />
        ) : isRetailerPhoto ? (
          // The retailer's own product photo, loaded straight from their CDN.
          // Product shots are on white, so show the whole item instead of cropping
          // (multiply lets the white blend into the grey stage), and fall back to the
          // illustration if the image ever disappears.
          <img
            src={product.imageUrl}
            alt={`${product.brand} ${product.name}`}
            className="h-full w-full object-contain p-4 mix-blend-multiply transition duration-700 group-hover:scale-[1.03]"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => { event.currentTarget.onerror = null; setPhotoFailed(true) }}
          />
        ) : (
          <img
            src={product.imageUrl}
            alt={`Original product-specific catalog rendering of ${product.color ? `${product.color} ` : ''}${product.name}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}
        {hasLink && <a href={affiliateUrl(linkUrl)} target="_blank" rel={outboundRel(linkUrl)} aria-label={`${isExact ? 'View' : 'Search for'} ${product.name} at ${product.vendor}`} className="absolute inset-0" tabIndex={-1} />}
        <button
          type="button"
          onClick={() => toggle(product)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from your wishlist` : `Save ${product.name} to your wishlist`}
          className="absolute right-1 top-1 z-10 grid h-11 w-11 place-items-center"
        >
          <Heart size={19} strokeWidth={1.4} fill={saved ? '#111' : 'none'} stroke="#111" />
        </button>
      </div>
      <div className="pt-3">
        <p className="truncate text-[10px] font-semibold uppercase tracking-[.16em] text-neutral-500">{product.vendor}{showBrand ? ` · ${product.brand}` : ''}</p>
        <h3 className="mt-1.5 text-[13px] font-medium leading-snug text-neutral-950">{product.name}</h3>
        <p className="mt-1.5 text-[13px] font-semibold text-neutral-950">{product.currency === "GBP" ? "£" : "$"}{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="block text-[10px] font-normal uppercase tracking-wide text-neutral-500 sm:inline sm:pl-1">{shortDate ? `price as of ${shortDate}` : "example price"}</span></p>
        {product.fitNote && <p className="mt-1 line-clamp-2 text-xs leading-4 text-neutral-500">{product.fitNote}</p>}
        {visibleSizes && <p className="mt-1.5 truncate text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Sizes {visibleSizes.join(' · ')}</p>}
        {fastOption && <p className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-neutral-700"><Zap size={11} aria-hidden="true" /> Same-day delivery may be available via {fastOption.provider}</p>}
        {hasLink ? (
          <a href={affiliateUrl(linkUrl)} target="_blank" rel={outboundRel(linkUrl)} className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-neutral-950 underline decoration-neutral-300 underline-offset-[6px] transition hover:decoration-neutral-950">
            {isExact ? <>View at {product.vendor} <ExternalLink size={12} className="shrink-0" /></> : <>Search at {product.vendor} <Search size={12} className="shrink-0" /></>}
          </a>
        ) : (
          <span className="mt-1 inline-flex min-h-11 items-center text-[11px] font-semibold uppercase tracking-[.14em] text-neutral-400">Retailer link coming soon</span>
        )}
        {hasLink && <p className="text-[10px] leading-4 text-neutral-500">{isExact ? `${verifiedDate ? `Item page verified ${verifiedDate}. ` : ''}Store confirms live price, size and stock.` : `Opens ${product.vendor}’s search for this item. Confirm price, size and stock there.`}{isAffiliateLink(linkUrl) && ' Affiliate link: we may earn a commission.'}</p>}
      </div>
    </article>
  )
}
