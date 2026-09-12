import { useEffect, useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import { getProducts } from '../services/catalogService'

export default function JustJewels() {
  const [products, setProducts] = useState([])
  useEffect(() => { getProducts().then((items) => setProducts(items.filter((item) => ['Jewelry', 'Accessories'].includes(item.category)))) }, [])
  return (
    <>
      <section className="mx-4 mt-6 grid max-w-[1440px] overflow-hidden rounded-[2rem] md:grid-cols-2 lg:mx-auto">
        <div className="flex min-h-[440px] flex-col justify-center bg-[#181818] px-6 py-16 text-white md:px-12 lg:px-20"><p className="text-xs font-bold uppercase tracking-widest text-gold-400">The finishing touch</p><h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">Just Jewels</h1><p className="mt-5 max-w-md leading-7 text-neutral-300">Quiet statements, bold gestures, and the small details that make an outfit yours.</p></div>
        <div className="min-h-[440px]"><img src="/assets/unique/just-jewels-hero-v1.webp" alt="Original arrangement of distinct sculptural jewelry and accessories" className="h-full w-full object-cover" /></div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-14 lg:px-8"><div className="mb-8 flex items-end justify-between border-b border-neutral-200 pb-6"><div><p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Curated objects</p><h2 className="mt-2 text-3xl font-bold">Wear it your way</h2></div><span className="text-xs font-bold">{products.length} ITEMS</span></div><ProductGrid products={products} /></section>
    </>
  )
}
