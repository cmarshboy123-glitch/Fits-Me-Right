import { ArrowRight, Camera, ExternalLink, FileText, Package, Shirt, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AFFILIATES_ACTIVE, affiliateUrl, outboundRel } from '../utils/affiliate'

// Fits Me Right doesn't take listings, hold items or handle payments, so "selling" here means
// pointing people to the resale marketplaces that do. Each description is kept general on purpose:
// fees, payouts and what each site accepts change often, and the page says to read their terms.
const marketplaces = [
  ['Poshmark', 'https://poshmark.com', 'Everyday and designer fashion', 'A resale marketplace built around clothing, shoes and accessories. You photograph and list each item yourself.'],
  ['Depop', 'https://www.depop.com', 'Vintage, streetwear and one-of-a-kind pieces', 'A social resale app that suits vintage finds and trend-driven clothes.'],
  ['ThredUp', 'https://www.thredup.com', 'Clearing out a whole closet', 'Rather than listing every item, you can send in a bag of clothes and let the company do the listing. Check which brands and conditions it accepts.'],
  ['The RealReal', 'https://www.therealreal.com', 'Designer and luxury pieces', 'A luxury consignment site that authenticates items before they are sold.'],
  ['Vestiaire Collective', 'https://www.vestiairecollective.com', 'Pre-owned designer fashion', 'A global marketplace for pre-owned designer clothing, bags and accessories.'],
  ['Grailed', 'https://www.grailed.com', 'Menswear and streetwear', 'A marketplace focused on menswear, sneakers and streetwear.'],
  ['Mercari', 'https://www.mercari.com', 'Quick, simple listings', 'A general marketplace where clothing, shoes and more can be listed in a few taps.'],
  ['eBay', 'https://www.ebay.com', 'Vintage and hard-to-find items', 'A general marketplace with auctions and fixed-price listings, popular for vintage and collectible pieces.'],
]

const steps = [
  [Shirt, 'Sort your closet', 'Pull out what you no longer wear. Set aside anything stained or damaged, and keep brands and labels for the pieces most likely to sell.'],
  [Camera, 'Take clear photos', 'Use natural light and a plain background. Show the front, the back, the tag and any flaws, so buyers know exactly what they are getting.'],
  [FileText, 'Describe it honestly', 'Include the brand, size, color, material and measurements, and mention wear or flaws. Honest listings get fewer returns and better reviews.'],
  [Tag, 'Set a fair price', 'Search for the same item that has already sold and price close to that, rather than to the original retail price.'],
  [Package, 'Pack and ship quickly', 'Ship soon after a sale, with sturdy packaging and tracking. Fast, careful sellers earn the best ratings.'],
]

export default function ThriftCorner() {
  return (
    <>
      <section className="mx-auto mt-6 grid max-w-[1440px] overflow-hidden rounded-[2rem] bg-[#F5F0E7] px-4 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div className="flex flex-col justify-center px-2 py-14 lg:px-10 lg:py-16">
          <p className="text-[11px] font-black uppercase tracking-[.28em] text-gold-800">Sell your stuff</p>
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[.95] tracking-[-.03em] sm:text-6xl">Thrift<br />Corner.</h1>
          <p className="mt-6 max-w-xl leading-7 text-neutral-700">Give your clothes a second life and clear space for what you love. Pick a marketplace below, follow a few simple steps, and turn what you no longer wear into cash.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#where-to-sell" className="flex items-center gap-3 rounded-full bg-black px-6 py-4 text-xs font-black text-white">WHERE TO SELL <ArrowRight size={16} /></a>
            <Link to="/thrifty-shopper" className="rounded-full border border-neutral-300 bg-white/70 px-6 py-4 text-xs font-black">LOOKING TO BUY SECONDHAND?</Link>
          </div>
        </div>
        <div className="flex items-center justify-center px-2 pb-12 lg:py-16">
          <ul className="w-full max-w-md space-y-3 text-sm font-bold text-neutral-800">
            {['Sort and photograph', 'List on a marketplace', 'Ship it and get paid'].map((label, index) => (
              <li key={label} className="flex items-center gap-4 rounded-2xl bg-white/80 px-5 py-4 shadow-soft"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-sm font-black text-white">{index + 1}</span>{label}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="where-to-sell" className="mx-auto max-w-[1440px] scroll-mt-24 px-4 py-16 lg:px-8 lg:py-20">
        <p className="text-xs font-black uppercase tracking-[.22em] text-gold-700">Where to sell</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Pick the marketplace that fits what you’re selling.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {marketplaces.map(([name, url, bestFor, about]) => (
            <article key={name} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-gold-700">{bestFor}</p>
              <h3 className="mt-3 text-xl font-black">{name}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">{about}</p>
              <a href={affiliateUrl(url)} target="_blank" rel={outboundRel(url)} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 text-[11px] font-bold text-white transition hover:bg-gold-600">START SELLING AT {name.toUpperCase()} <ExternalLink size={13} /></a>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-5 text-neutral-500">
          Fits Me Right doesn’t take listings, hold your items or handle payments. These are separate companies with their own fees, payout rules and seller terms, which change often, so read them before you list. {AFFILIATES_ACTIVE ? 'Some of these links are affiliate links and may earn us a commission.' : 'We earn nothing from these links today.'}
        </p>
      </section>

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-black uppercase tracking-[.22em] text-gold-300">How to sell</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Five steps from closet to sold.</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {steps.map(([Icon, title, copy], index) => (
              <li key={title} className="rounded-2xl border border-white/15 bg-white/[.05] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-400 text-black"><Icon size={20} /></div>
                <p className="mt-5 text-[10px] font-black uppercase tracking-[.2em] text-white/50">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[2rem] bg-gold-50 p-8 md:flex-row md:items-center lg:p-12">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Want to buy secondhand instead?</h2>
            <p className="mt-2 max-w-xl leading-7 text-neutral-700">Browse one-of-one vintage and resale pieces in Thrifty Shopper.</p>
          </div>
          <Link to="/thrifty-shopper" className="flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-black px-7 text-xs font-black text-white">GO TO THRIFTY SHOPPER <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  )
}
