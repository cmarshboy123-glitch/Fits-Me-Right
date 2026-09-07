import { ArrowRight, Heart, Ruler, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const promises = [
  { icon: Search, title: 'We search, you choose', copy: 'One search box reaches dozens of stores and brands at once, so you can compare instead of hopping between tabs.' },
  { icon: Ruler, title: 'Fit comes first', copy: 'Body type, size, and budget shape every result — not just what a retailer wants to sell you.' },
  { icon: Heart, title: 'Every body, every store tier', copy: 'From everyday brands to independent designers to luxury houses, the same concierge experience applies to all of it.' },
]

export default function About() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-widest text-[#D3A11E]">About Fits Me Right</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">Our fit promise.</h1>
      <p className="mt-5 max-w-2xl leading-7 text-neutral-600">Fits Me Right is an independent discovery experience, not a retailer. We help you search clothing, shoes, and accessories across the market by how they fit and feel — then send you to the exact store to complete your purchase.</p>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {promises.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-7">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[#F5F1E9]"><Icon size={20} /></div>
            <h2 className="mt-6 text-xl font-black">{title}</h2>
            <p className="mt-3 leading-6 text-neutral-600">{copy}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-[2rem] bg-[#F5F1E9] p-8 lg:p-12">
        <h2 className="text-2xl font-black">How this actually works</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <p className="leading-7 text-neutral-700">Every item you see links out to a real retailer. Where we’ve confirmed the exact product page, we say so and note when it was last checked. Where we haven’t, we open a live search at that store for the same item instead of leaving you with a dead end.</p>
          <p className="leading-7 text-neutral-700">Prices, sizes, and stock always belong to the retailer — we show a snapshot to help you compare, but the store has the final word. We don’t process payments, hold your card details, or take a cut at checkout.</p>
        </div>
      </div>

      <div className="mt-14 rounded-[2rem] bg-black p-8 text-white lg:p-12">
        <h2 className="text-2xl font-black">No account required</h2>
        <p className="mt-4 max-w-2xl leading-7 text-white/70">Wishlist items and saved style profiles live in your browser on this device — there’s no sign-up, no password, and nothing shared with us or anyone else.</p>
        <Link to="/style/gender" className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#D3A11E] px-7 py-4 text-sm font-black text-black">START YOUR STYLE EDIT <ArrowRight size={17} /></Link>
      </div>
    </section>
  )
}
