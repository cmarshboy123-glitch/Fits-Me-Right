import { useEffect, useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import { getProducts } from '../services/catalogService'

const tabs = ['Women', 'Men', 'Children']

export default function CobblerCorner() {
  const [active, setActive] = useState('Women')
  const [products, setProducts] = useState([])
  useEffect(() => { getProducts().then((items) => setProducts(items.filter((item) => item.category === 'Shoes'))) }, [])
  const filtered = products.filter((item) => item.gender === active)

  return (
    <>
      <section className="relative mx-4 mt-6 min-h-[480px] overflow-hidden rounded-[2rem] text-white lg:mx-8">
        <img src="/assets/unique/cobbler-corner-hero-v1.webp" alt="A gallery of distinct contemporary shoes across categories" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[480px] max-w-[1440px] items-end px-6 pb-12 lg:px-12"><div><p className="text-xs font-bold uppercase tracking-widest">Shoes across the market</p><h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">Cobbler Corner</h1><p className="mt-4 max-w-md leading-7">Compare the right pair across leading retailers, then step directly into the store.</p></div></div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-12 lg:px-8">
        <div className="mb-8 flex border-b border-neutral-200">{tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`flex-1 border-b-2 px-3 py-4 text-sm font-bold sm:flex-none sm:px-10 ${active === tab ? 'border-black' : 'border-transparent text-neutral-500'}`}>{tab.toUpperCase()}</button>)}</div>
        <div className="mb-6 flex items-end justify-between"><h2 className="text-2xl font-bold">{active}’s shoes</h2><span className="text-xs font-bold">{filtered.length} ITEMS</span></div>
        {filtered.length ? <ProductGrid products={filtered} /> : <div className="rounded-2xl bg-neutral-100 py-20 text-center"><h2 className="text-2xl font-bold">New steps are coming soon.</h2><p className="mt-2 text-neutral-600">Our cobblers are putting on the finishing touches.</p></div>}
      </section>
    </>
  )
}
