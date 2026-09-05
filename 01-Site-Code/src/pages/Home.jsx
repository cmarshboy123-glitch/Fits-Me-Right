import { ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InteractiveWardrobe from '../components/InteractiveWardrobe'
import { useStyle } from '../context/StyleContext'
import { luxuryRetailers, retailerNames } from '../utils/retailers'

const categories = [
  ['Everyday Ease', '/assets/unique/home-everyday-ease-v1.webp'],
  ['Business Casual', '/assets/unique/home-business-casual-v2.png'],
  ['Formal Wear', '/assets/unique/home-after-five-v1.webp'],
  ['Made to Move', '/assets/unique/home-made-to-move-v1.webp'],
  ['Shoes', '/assets/unique/home-shoes-occasion-v1.webp'],
  ['Accessories', '/assets/unique/home-accessories-occasion-v1.webp'],
]

export default function Home() {
  const navigate = useNavigate()
  const { updateSelection } = useStyle()
  const begin = (gender) => { updateSelection('gender', gender); navigate('/style/body-type') }

  return (
    <>
      <div className="bg-[#FCFBF8] px-3 pb-8 pt-4 sm:px-4 lg:px-8"><InteractiveWardrobe /></div>

      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-12 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.25em] text-amber-700">The store directory</p><h2 className="mt-2 text-2xl font-black tracking-tight">55 stores. One fitting room.</h2></div><button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-sm font-bold text-amber-700">SHOP THEM ALL <ArrowRight size={16} /></button></div>
          <div className="closet-shelf mt-7 flex gap-3 overflow-x-auto pb-7">
            {retailerNames.filter((retailer) => !luxuryRetailers.includes(retailer)).map((retailer) => <button key={retailer} onClick={() => navigate(`/shop?q=${encodeURIComponent(retailer)}`)} className="shrink-0 rounded-full border border-neutral-200 bg-[#FCFBF8] px-5 py-3 text-xs font-bold transition hover:border-amber-600 hover:text-amber-800">{retailer}</button>)}
          </div>
          <p className="mt-6 text-xs text-neutral-500">Fits Me Right is an independent discovery experience. Retailer names identify where sample products can be purchased.</p>
        </div>
      </section>

      <section className="bg-[#F3EFE7] text-neutral-950">
        <div className="mx-auto max-w-[1440px] px-4 py-14 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[.25em] text-amber-700">The luxury room</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><h2 className="text-3xl font-black tracking-tight">Twenty iconic houses, together.</h2><button onClick={() => navigate('/shop?tier=Luxury')} className="flex items-center gap-2 text-sm font-bold text-amber-800">EXPLORE LUXURY <ArrowRight size={16} /></button></div>
          <div className="closet-shelf mt-8 flex gap-3 overflow-x-auto pb-7">
            {luxuryRetailers.map((retailer) => <button key={retailer} onClick={() => navigate(`/shop?q=${encodeURIComponent(retailer)}`)} className="min-h-14 shrink-0 rounded-full border border-neutral-300 bg-white/70 px-6 text-sm font-bold transition hover:border-amber-600 hover:text-amber-800">{retailer}</button>)}
          </div>
        </div>
      </section>

      <section className="wardrobe-room mx-auto my-8 max-w-[1440px] px-4 py-16 lg:px-8 lg:py-20">
        <div className="mb-8 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-amber-600">Find your moment</p><h2 className="mt-2 text-3xl font-black tracking-tight">Shop by occasion</h2></div><button onClick={() => navigate('/style/gender')} className="hidden items-center gap-2 text-sm font-bold sm:flex">START THE EDIT <ArrowRight size={16} /></button></div>
        <div className="wardrobe-rail mb-7 flex items-center gap-3" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-[#9C7A50]" /><span className="h-px flex-1 bg-[#9C7A50]" /><span className="h-2 w-2 rounded-full bg-[#9C7A50]" /></div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {categories.map(([label, image], index) => <button key={label} onClick={() => navigate('/style/gender')} className="wardrobe-bay group text-left"><div className="aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100"><img src={image} style={{ objectPosition: `${18 + index * 13}% center` }} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" loading="lazy" /></div><p className="mt-3 text-sm font-bold">{label}</p></button>)}
        </div>
      </section>

      <section className="px-4 py-8 lg:px-8">
        <div className="wardrobe-shell mx-auto grid max-w-[1440px] overflow-hidden rounded-[2rem] bg-[#EFE8DB] md:grid-cols-2">
          <div className="flex flex-col justify-center px-7 py-16 md:px-12 lg:px-20">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Your concierge is ready</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight lg:text-5xl">Great style begins with self acceptance.</h2>
            <p className="mt-5 max-w-lg leading-7 text-neutral-700">Our guided edit considers your body, budget, and destination—then searches across the marketplace for you.</p>
            <button onClick={() => navigate('/style/gender')} className="mt-8 flex w-fit items-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-bold text-white transition hover:bg-amber-700">START YOUR STYLE EDIT <ArrowRight size={17} /></button>
          </div>
          <div className="wardrobe-window min-h-[460px]"><img src="/assets/unique/home-self-acceptance-v1.webp" alt="Three friends with varied body types sharing a joyful boutique fitting moment" className="h-full w-full object-cover" loading="lazy" /></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-20 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <button onClick={() => navigate('/cobbler-corner')} className="group relative min-h-[470px] overflow-hidden rounded-[2rem] text-left text-white"><img src="/assets/unique/home-cobbler-feature-v1.webp" alt="Original editorial arrangement of contemporary shoes" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-8"><p className="text-xs font-bold uppercase tracking-widest text-amber-300">Shoes across the market</p><h2 className="mt-2 text-3xl font-black">Cobbler Corner</h2><p className="mt-4 font-bold">SHOP NOW →</p></div></button>
          <button onClick={() => navigate('/creative-corner')} className="group relative min-h-[470px] overflow-hidden rounded-[2rem] text-left text-white"><img src="/assets/unique/home-creative-feature-v1.webp" alt="Black independent designer creating a dress in her studio" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-8"><p className="text-xs font-bold uppercase tracking-widest text-amber-300">Independent by design</p><h2 className="mt-2 text-3xl font-black">Creative Corner</h2><p className="mt-4 font-bold">DISCOVER MORE →</p></div></button>
        </div>
      </section>
    </>
  )
}
