import { ArrowRight, Recycle, Search, Store } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const futureDepartments = [
  ['Local thrift', 'Independent neighborhood stores, brought into one search.'],
  ['Curated resale', 'Quality secondhand pieces selected for condition and style.'],
  ['Vintage finds', 'One-of-one clothing and accessories from every era.'],
]

export default function ThriftyShopper() {
  const navigate = useNavigate()

  return (
    <div className="bg-paper px-4 pb-16 pt-6 lg:px-8">
      <section className="mx-auto grid min-h-[580px] max-w-[1440px] overflow-hidden rounded-[2rem] bg-[#F5F0E7] lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col justify-center px-6 py-16 lg:px-14">
          <p className="text-[11px] font-black uppercase tracking-[.28em] text-gold-800">A new marketplace is coming</p>
          <h1 className="mt-7 max-w-2xl text-5xl font-black leading-[.92] tracking-[-.05em] sm:text-7xl">Thrifty<br />Shopper.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-700">Soon, Fits Me Right will make it easier to discover thrift, vintage, and resale stores through the same fit-first shopping experience.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={() => navigate('/style/gender')} className="flex items-center gap-3 rounded-full bg-black px-6 py-4 text-xs font-black text-white">BUILD YOUR STYLE EDIT <ArrowRight size={16} /></button>
            <button onClick={() => navigate('/shop')} className="rounded-full border border-neutral-300 bg-white/70 px-6 py-4 text-xs font-black">SHOP CURRENT STORES</button>
          </div>
        </div>
        <div className="grid place-items-center bg-[#D7A928] px-6 py-16">
          <div className="relative grid h-72 w-72 place-items-center rounded-full border-2 border-black sm:h-96 sm:w-96">
            <div className="absolute inset-5 rounded-full border border-dashed border-black/50" />
            <Recycle className="h-28 w-28" strokeWidth={1.3} aria-hidden="true" />
            <span className="absolute bottom-12 text-[10px] font-black uppercase tracking-[.28em]">Wear it again</span>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-[1440px] rounded-[2rem] bg-white px-5 py-14 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[.24em] text-gold-800">What to expect</p><h2 className="mt-3 text-3xl font-black">Secondhand, made easier to find.</h2></div><Search className="hidden h-8 w-8 sm:block" /></div>
        <div className="grid gap-4 md:grid-cols-3">
          {futureDepartments.map(([title, description], index) => <article key={title} className="min-h-56 rounded-2xl border border-neutral-200 bg-paper p-7"><div className="flex items-center justify-between"><Store size={22} /><span className="text-xs font-black">0{index + 1}</span></div><h3 className="mt-12 text-xl font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p></article>)}
        </div>
      </section>
    </div>
  )
}
