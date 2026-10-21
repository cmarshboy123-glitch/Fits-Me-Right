import { ArrowRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import InteractiveWardrobe from '../components/InteractiveWardrobe'
import { luxuryRetailers, retailerNames } from '../utils/retailers'

const categories = [
  ['Everyday Ease', '/assets/unique/home-everyday-ease-v1.webp'],
  ['Business Casual', '/assets/unique/home-business-casual-men-v1.webp'],
  ['Formal Wear', '/assets/unique/home-after-five-v1.webp'],
  ['Made to Move', '/assets/unique/home-made-to-move-men-v1.webp'],
  ['Shoes', '/assets/unique/home-shoes-occasion-men-v1.webp'],
  ['Accessories', '/assets/unique/home-accessories-occasion-v1.webp'],
]

const storeSearch = (retailer) => `/shop?q=${encodeURIComponent(retailer)}`

export default function Home() {
  return (
    <>
      <div className="bg-paper px-3 pb-8 pt-4 sm:px-4 lg:px-8">
        <InteractiveWardrobe />
        <Link to="/fast" className="mx-auto mt-4 flex max-w-[1440px] flex-col gap-3 rounded-2xl bg-black px-6 py-5 text-white transition hover:bg-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-3"><Zap size={22} className="shrink-0 text-gold-300" /><span><span className="font-black">Need it tonight?</span> <span className="text-white/75">Same-day delivery and pickup for last-minute events, tuxedos included.</span></span></span>
          <span className="flex shrink-0 items-center gap-2 text-xs font-black text-gold-300">SEE FAST OPTIONS <ArrowRight size={15} /></span>
        </Link>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-700">The store directory</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{retailerNames.length} stores. One fitting room.</h2>
            </div>
            <Link to="/shop" className="flex items-center gap-2 text-sm font-bold text-gold-700 transition hover:text-gold-800">SHOP THEM ALL <ArrowRight size={16} /></Link>
          </div>
          <div className="clean-scroll mt-8 flex gap-2.5 overflow-x-auto pb-3">
            {retailerNames.filter((retailer) => !luxuryRetailers.includes(retailer)).map((retailer) => (
              <Link key={retailer} to={storeSearch(retailer)} className="shrink-0 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-700 transition hover:border-gold-400 hover:text-gold-700">{retailer}</Link>
            ))}
          </div>
          <p className="mt-6 text-xs text-neutral-500">Fits Me Right is an independent discovery experience. Retailer names identify where sample products can be purchased.</p>
        </div>
      </section>

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-300">The luxury room</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Twenty iconic houses, together.</h2>
            <Link to="/shop?market=Luxury" className="flex items-center gap-2 text-sm font-bold text-gold-300 transition hover:text-gold-200">EXPLORE LUXURY <ArrowRight size={16} /></Link>
          </div>
          <div className="clean-scroll mt-9 flex gap-2.5 overflow-x-auto pb-3">
            {luxuryRetailers.map((retailer) => (
              <Link key={retailer} to={storeSearch(retailer)} className="flex min-h-14 shrink-0 items-center rounded-full border border-white/15 bg-white/[.06] px-6 text-sm font-bold text-white transition hover:border-gold-300 hover:bg-white/10">{retailer}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-20 lg:px-8">
        <div className="mb-9 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600">Find your moment</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Shop by occasion</h2>
          </div>
          <Link to="/style/gender" className="hidden items-center gap-2 text-sm font-bold text-neutral-700 transition hover:text-black sm:flex">START THE EDIT <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {categories.map(([label, image], index) => (
            <Link key={label} to="/style/gender" className="group text-left">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 shadow-soft transition duration-300 group-hover:shadow-lift">
                <img src={image} style={{ objectPosition: `${18 + index * 13}% center` }} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <p className="mt-3 text-sm font-bold">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 py-8 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] overflow-hidden rounded-[2rem] bg-neutral-50 shadow-soft md:grid-cols-2">
          <div className="flex flex-col justify-center px-7 py-16 md:px-12 lg:px-20">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-700">Your concierge is ready</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight lg:text-5xl">Great style begins with self acceptance.</h2>
            <p className="mt-5 max-w-lg leading-7 text-neutral-600">Our guided edit considers your body, budget, and destination—then searches across the marketplace for you.</p>
            <Link to="/style/gender" className="mt-8 flex w-fit items-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-bold text-white transition hover:bg-gold-700">START YOUR STYLE EDIT <ArrowRight size={17} /></Link>
          </div>
          <div className="min-h-[420px]"><img src="/assets/unique/home-self-acceptance-v1.webp" alt="Three friends with varied body types sharing a joyful boutique fitting moment" className="h-full w-full object-cover" loading="lazy" /></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-20 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Link to="/cobbler-corner" className="group relative block min-h-[440px] overflow-hidden rounded-[2rem] text-left text-white shadow-soft transition hover:shadow-lift">
            <img src="/assets/unique/home-cobbler-feature-v1.webp" alt="Original editorial arrangement of contemporary shoes" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-300">Shoes across the market</p>
              <h2 className="mt-2 text-3xl font-black">Cobbler Corner</h2>
              <p className="mt-4 flex items-center gap-2 font-bold">SHOP NOW <ArrowRight size={16} /></p>
            </div>
          </Link>
          <Link to="/creative-corner" className="group relative block min-h-[440px] overflow-hidden rounded-[2rem] text-left text-white shadow-soft transition hover:shadow-lift">
            <img src="/assets/unique/home-creative-feature-v1.webp" alt="Black independent designer creating a dress in her studio" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-300">Independent by design</p>
              <h2 className="mt-2 text-3xl font-black">Creative Corner</h2>
              <p className="mt-4 flex items-center gap-2 font-bold">DISCOVER MORE <ArrowRight size={16} /></p>
            </div>
          </Link>
        </div>
      </section>
    </>
  )
}
