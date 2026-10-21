import { ArrowRight, Clock, ExternalLink, MapPin, Search, Store, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doorDashSearchUrl, FAST_DELIVERY_CHECKED, fastDeliveryRetailers, fastDeliverySources, mapsSearchUrl } from '../utils/fastDelivery'

const occasions = [
  ['Tuxedo or black-tie look', 'tuxedo'],
  ['A suit for tomorrow', 'suit'],
  ['A dress for tonight', 'dress'],
  ['Dress shoes', 'dress shoes'],
  ['A blazer', 'blazer'],
  ['Last-minute jeans & tops', 'jeans'],
]

const timeframes = [
  {
    id: 'hours',
    label: 'In the next few hours',
    steps: [
      { title: 'Same-day delivery apps', body: 'DoorDash delivers from participating stores, in some areas in as little as an hour. What you can order depends on your address, so search for the item and see what is near you.', action: 'doordash' },
      { title: 'Buy online, pick up in store', body: 'Many stores will have an item ready to collect the same day. Men’s Wearhouse says you can order a suit online and pick it up at one of its 600+ stores, often the same day.', link: ['Men’s Wearhouse suits and tuxedos', 'https://www.menswearhouse.com/c/mens-clothing/mens-suits'] },
      { title: 'Walk in somewhere nearby', body: 'For a tuxedo or suit you need today, an off-the-rack purchase at a store close to you is the surest route.', action: 'maps' },
    ],
  },
  {
    id: 'days',
    label: 'In 1 to 3 days',
    steps: [
      { title: 'Rush or express shipping', body: 'Most retailers sell a 1–3 day shipping upgrade at checkout. Choose it before you pay, and check the delivery date shown for your address.' },
      { title: 'Buy, don’t rent', body: 'Rentals usually need more lead time than buying. If the date is close, buying a tuxedo or suit off the rack is faster.' },
    ],
  },
  {
    id: 'week',
    label: 'A week or more',
    steps: [
      { title: 'Tuxedo rental', body: 'Jos. A. Bank rentals are picked up in store, need at least 7 days for one person (14 for a group), and add a $30 rush fee on shorter notice.', link: ['Jos. A. Bank rental FAQ', 'https://tuxedo.josbank.com/faq'] },
      { title: 'Rental delivered to your door', body: 'Generation Tux ships to your address about 14 days before your event in the U.S.', link: ['Generation Tux', 'https://generationtux.com'] },
    ],
  },
]

export default function FastDelivery() {
  const navigate = useNavigate()
  const [need, setNeed] = useState('')
  const [when, setWhen] = useState('hours')
  const timeframe = timeframes.find((item) => item.id === when)
  const query = need.trim()

  const actionLink = (action) => {
    if (action === 'doordash') return { label: `Search DoorDash${query ? ` for “${query}”` : ''}`, url: doorDashSearchUrl(query || 'clothing') }
    if (action === 'maps') return { label: `Find ${query || 'clothing stores'} near me`, url: mapsSearchUrl(query) }
    return null
  }

  return (
    <>
      <section className="mx-4 mt-6 overflow-hidden rounded-[2rem] bg-[#1C1711] text-white lg:mx-8">
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.24em] text-gold-300"><Zap size={15} /> Need it fast</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">Need it today? Here&rsquo;s the fastest way to get it.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">Tuxedo for tonight, a dress for tomorrow&rsquo;s interview. We don&rsquo;t deliver anything ourselves &mdash; we point you to the real same-day delivery and pickup options and tell you honestly what&rsquo;s possible.</p>

          <form
            onSubmit={(event) => { event.preventDefault(); navigate(`/shop?q=${encodeURIComponent(query)}&fast=1`) }}
            role="search"
            className="mt-9 max-w-2xl"
          >
            <label htmlFor="fast-need" className="text-[11px] font-black uppercase tracking-[.2em] text-white/60">What do you need?</label>
            <div className="mt-2 flex items-center gap-2 rounded-full bg-white px-5 text-black">
              <Search size={18} aria-hidden="true" />
              <input id="fast-need" value={need} onChange={(event) => setNeed(event.target.value)} placeholder="tuxedo, black dress, dress shoes…" className="min-h-[54px] w-full bg-transparent text-base outline-none" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={doorDashSearchUrl(query || 'clothing')} target="_blank" rel="noreferrer" className="flex min-h-12 items-center gap-2 rounded-full bg-gold-400 px-6 text-xs font-black text-black transition hover:bg-gold-300">SEARCH DOORDASH{query ? ` FOR “${query.toUpperCase()}”` : ''} <ExternalLink size={14} /></a>
              <button type="submit" className="flex min-h-12 items-center gap-2 rounded-full border border-white/40 px-6 text-xs font-black transition hover:bg-white/10">SEE MATCHES FROM FAST-DELIVERY STORES <ArrowRight size={14} /></button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[.22em] text-gold-700">How soon?</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">What&rsquo;s realistic for your deadline</h2>
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="When do you need it">
          {timeframes.map((item) => (
            <button key={item.id} role="tab" aria-selected={when === item.id} onClick={() => setWhen(item.id)} className={`flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-bold transition ${when === item.id ? 'bg-black text-white' : 'border border-neutral-300 bg-white hover:border-black'}`}>
              <Clock size={15} /> {item.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3" role="tabpanel">
          {timeframe.steps.map((step) => {
            const action = actionLink(step.action)
            return (
              <article key={step.title} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6">
                <h3 className="text-lg font-black">{step.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">{step.body}</p>
                {action && <a href={action.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-black text-black underline">{action.label} {step.action === 'maps' ? <MapPin size={13} /> : <ExternalLink size={13} />}</a>}
                {step.link && <a href={step.link[1]} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-black text-black underline">{step.link[0]} <ExternalLink size={13} /></a>}
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-black uppercase tracking-[.22em] text-gold-700">Start with an occasion</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Shop what the fast stores carry</h2>
          <p className="mt-3 max-w-2xl text-neutral-600">These searches only show items from stores that offer same-day delivery. If none match, you can search DoorDash directly for what&rsquo;s near you.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {occasions.map(([label, search]) => (
              <Link key={label} to={`/shop?q=${encodeURIComponent(search)}&fast=1`} className="flex min-h-28 flex-col justify-between rounded-2xl border border-neutral-200 bg-[#FAF9F6] p-4 transition hover:border-black">
                <span className="font-bold leading-snug">{label}</span>
                <span className="mt-4 flex items-center gap-1 text-[11px] font-black text-gold-800">SHOP <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[.22em] text-gold-700">Same-day delivery</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Stores that deliver through DoorDash</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(fastDeliveryRetailers).map(([retailer, info]) => (
            <article key={retailer} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-gold-800"><Store size={13} /> {info.provider}</p>
              <h3 className="mt-3 text-2xl font-black">{retailer}</h3>
              <p className="mt-2 text-sm text-neutral-600">{info.coverage}, {info.speed}.</p>
              <p className="mt-1 text-xs text-neutral-400">On DoorDash since {info.since}</p>
              <div className="mt-6 flex flex-1 flex-col justify-end gap-2">
                <Link to={`/shop?store=${encodeURIComponent(retailer)}`} className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-4 text-xs font-black text-white transition hover:bg-gold-700">BROWSE {retailer.toUpperCase()} <ArrowRight size={13} /></Link>
                <a href={doorDashSearchUrl(retailer)} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 text-xs font-black transition hover:border-black">ORDER ON DOORDASH <ExternalLink size={13} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-6 lg:px-8">
        <div className="mx-auto max-w-[1440px] rounded-[2rem] bg-[#F4EEE2] p-8 lg:p-12">
          <h2 className="text-2xl font-black">The fine print</h2>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
            <li>Fits Me Right doesn&rsquo;t sell or deliver anything. Orders, fees, delivery times and returns are handled by the store or delivery app you choose.</li>
            <li>Delivery depends on your address and what each nearby store has in stock. A store listed here may not deliver to you, and the app will tell you.</li>
            <li>Last checked {FAST_DELIVERY_CHECKED}. Sources: {fastDeliverySources.map((source, index) => (
              <span key={source.url}>{index > 0 && '; '}<a href={source.url} target="_blank" rel="noreferrer" className="underline">{source.label}</a></span>
            ))}.</li>
          </ul>
        </div>
      </section>
    </>
  )
}
