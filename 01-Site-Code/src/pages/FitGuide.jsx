import { ArrowRight, Check, ExternalLink, Minus } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { fitGuide, fitSources } from '../data/fitGuide'

const genders = Object.keys(fitGuide)

export default function FitGuide() {
  const [searchParams, setSearchParams] = useSearchParams()
  const gender = genders.includes(searchParams.get('gender')) ? searchParams.get('gender') : 'Women'
  const entries = fitGuide[gender]
  const entry = entries.find((item) => item.type === searchParams.get('type')) || entries[0]
  const collection = gender === 'Women' ? 'Women' : 'Men'

  const select = (nextGender, type) => setSearchParams({ gender: nextGender, type }, { replace: true })
  const shopLink = (search) => `/shop?gender=${collection}&q=${encodeURIComponent(search)}`

  return (
    <>
      <section className="mx-4 mt-6 overflow-hidden rounded-[2rem] bg-[#1C1711] text-white lg:mx-8">
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20">
          <p className="text-xs font-black uppercase tracking-[.24em] text-gold-300">Fit guide</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">What stylists suggest for your build.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">We read published advice from stylists and fashion editors and boiled it down to short tips for each body type on the site, each with a shortcut into the shop. It&rsquo;s opinion, not science: wear what makes you feel good.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 lg:px-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Collection">
          {genders.map((value) => (
            <button key={value} role="tab" aria-selected={gender === value} onClick={() => select(value, fitGuide[value][0].type)} className={`min-h-12 rounded-full px-6 text-sm font-bold transition ${gender === value ? 'bg-black text-white' : 'border border-neutral-300 bg-white hover:border-black'}`}>{value}</button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Body type">
          {entries.map((item) => (
            <button key={item.type} role="tab" aria-selected={entry.type === item.type} onClick={() => select(gender, item.type)} className={`min-h-11 rounded-full px-5 text-sm font-bold transition ${entry.type === item.type ? 'bg-gold-400 text-black' : 'border border-neutral-300 bg-white hover:border-black'}`}>{item.type}</button>
          ))}
        </div>

        <article className="mt-8 grid gap-8 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr]" aria-live="polite">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[.22em] text-gold-800">{gender} &middot; {entry.also}</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">{entry.type}</h2>
            <p className="mt-4 leading-7 text-neutral-700">{entry.blurb}</p>
            <p className="mt-6 rounded-2xl bg-[#FBF3E4] p-4 text-sm leading-6 text-neutral-800"><span className="font-black">Good to know: </span>{entry.tip}</p>

            <h3 className="mt-8 text-[11px] font-black uppercase tracking-[.2em] text-neutral-500">Shop the ideas</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {entry.shop.map(([label, search]) => (
                <Link key={label} to={shopLink(search)} className="flex min-h-12 items-center justify-between gap-3 rounded-full border border-neutral-300 px-5 text-sm font-bold transition hover:border-black hover:bg-[#FFF1C7]">{label} <ArrowRight size={15} aria-hidden="true" /></Link>
              ))}
            </div>
          </div>

          <div className="grid content-start gap-6">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[.2em] text-gold-800">Often suggested</h3>
              <ul className="mt-3 grid gap-3">
                {entry.lookFor.map((line) => <li key={line} className="flex gap-3 text-[15px] leading-6"><Check size={18} className="mt-0.5 shrink-0 text-gold-700" aria-hidden="true" />{line}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[.2em] text-neutral-500">Often cautioned against</h3>
              <ul className="mt-3 grid gap-3">
                {entry.goEasy.map((line) => <li key={line} className="flex gap-3 text-[15px] leading-6 text-neutral-700"><Minus size={18} className="mt-0.5 shrink-0 text-neutral-400" aria-hidden="true" />{line}</li>)}
              </ul>
            </div>
            <div className="border-t border-neutral-200 pt-5">
              <h3 className="text-[11px] font-black uppercase tracking-[.2em] text-neutral-500">Where this comes from</h3>
              <ul className="mt-3 grid gap-2 text-sm">
                {entry.sources.map((key) => (
                  <li key={key}><a href={fitSources[key].url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 font-bold underline">{fitSources[key].label} <ExternalLink size={13} className="mt-1 shrink-0" aria-hidden="true" /></a> <span className="text-neutral-500">{fitSources[key].by}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <div className="mt-10 grid gap-6 rounded-3xl border border-neutral-200 bg-[#FAF9F6] p-6 text-sm leading-6 text-neutral-700 sm:p-8 md:grid-cols-2">
          <div>
            <h2 className="text-base font-black text-black">Read this first</h2>
            <p className="mt-2">These are common suggestions from published guides, not rules, and the guides don&rsquo;t always agree. Some are years old, and several of the writers say outright that shape &ldquo;rules&rdquo; are arbitrary and that tailoring matters more than the category you fall into. Our body types are simple groupings, so use whichever tips suit you.</p>
          </div>
          <div>
            <h2 className="text-base font-black text-black">How we put it together</h2>
            <p className="mt-2">Written from the guides linked above. A few of the sources (Who What Wear, Marie Claire and the University of Kentucky guide) we could only read in part, so we use them for general direction only. The shop shortcuts search for the garments mentioned; stores don&rsquo;t publish how an item fits a body type, so results aren&rsquo;t filtered by body shape.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/style/gender" className="flex min-h-12 items-center gap-2 rounded-full bg-black px-6 text-xs font-black text-white transition hover:bg-gold-700">BUILD MY STYLE EDIT <ArrowRight size={14} /></Link>
          <Link to={`/shop?gender=${collection}`} className="flex min-h-12 items-center gap-2 rounded-full border border-neutral-300 px-6 text-xs font-black transition hover:border-black">BROWSE ALL {collection.toUpperCase()}&rsquo;S</Link>
        </div>
      </section>
    </>
  )
}
