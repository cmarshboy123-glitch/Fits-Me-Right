import { Heart, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { useWishlist } from '../context/WishlistContext'

export default function Wishlist() {
  const { items, clear } = useWishlist()
  const navigate = useNavigate()

  return (
    <section className="mx-auto min-h-[70vh] max-w-[1440px] px-4 py-14 lg:px-8 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-700">Saved by you</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Your wishlist.</h1>
          <p className="mt-4 max-w-xl leading-7 text-neutral-600">Everything you’ve hearted across the marketplace, kept in one place on this device.</p>
        </div>
        {items.length > 0 && (
          <button onClick={clear} className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-black">
            <Trash2 size={15} /> CLEAR ALL
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <>
          <p className="py-6 text-sm font-bold">{items.length} SAVED ITEM{items.length === 1 ? '' : 'S'}</p>
          <ProductGrid products={items} />
        </>
      ) : (
        <div className="mt-10 grid place-items-center rounded-3xl bg-neutral-100 px-6 py-24 text-center">
          <div>
            <Heart size={40} className="mx-auto text-neutral-300" strokeWidth={1.3} />
            <h2 className="mt-5 text-2xl font-black">Nothing saved yet.</h2>
            <p className="mx-auto mt-3 max-w-md text-neutral-600">Tap the heart on any item while you browse to keep it here for later.</p>
            <button onClick={() => navigate('/shop')} className="mt-7 rounded-full bg-black px-7 py-4 text-sm font-bold text-white">BROWSE THE MARKETPLACE</button>
          </div>
        </div>
      )}
    </section>
  )
}
