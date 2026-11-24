import { Check, Copy, ExternalLink, Minus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Faq } from '../components/SupportPage'
import { getRealProducts } from '../services/catalogService'
import { affiliateUrl, outboundRel } from '../utils/affiliate'
import { buildRequest, describeRequest, hasRequirements, rankProducts } from '../utils/matchEngine'
import { buildPrompt } from '../utils/matchPrompt'
import { shoppingCategories, shoppingColors } from '../utils/searchIntent'

const empty = { description: '', category: '', gender: '', brand: '', color: '', material: '', fit: '', style: '', details: '', minPrice: '', maxPrice: '', size: '', store: '' }

const field = 'min-h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-900'
const label = 'mb-1.5 block text-[10px] font-semibold uppercase tracking-[.18em] text-neutral-500'

const money = (product) => `${product.currency === 'GBP' ? '£' : product.currency === 'NGN' ? '₦' : '$'}${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const dateOf = (iso) => (iso ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`)) : null)

function Field({ name, text, form, set, placeholder, type = 'text', inputMode }) {
  return (
    <label><span className={label}>{text}</span>
      <input value={form[name]} onChange={(event) => set(name, event.target.value)} placeholder={placeholder} type={type} inputMode={inputMode} maxLength={120} className={field} />
    </label>
  )
}

function Result({ result, rank }) {
  const { product, score, matched, differences, listedSizes, exact } = result
  const date = dateOf(product.verifiedAt)
  return (
    <li className="grid gap-5 border-t border-neutral-300 py-8 sm:grid-cols-[170px_1fr] md:grid-cols-[210px_1fr]">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F3F2EF]">
        {product.imageUrl && <img src={product.imageUrl} alt={`${product.brand || product.vendor} ${product.name}`} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain p-3 mix-blend-multiply" />}
        <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[11px] font-semibold tracking-wide">#{rank}</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-2xl font-semibold tabular-nums">{score}%</p>
          <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-neutral-500">match score</p>
          <p className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-[.14em] ${exact ? 'bg-neutral-950 text-white' : 'border border-neutral-400 text-neutral-700'}`}>{exact ? 'Matches everything we can check' : 'Close alternative'}</p>
        </div>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[.16em] text-neutral-500">{product.vendor}{product.brand && product.brand !== product.vendor ? ` · ${product.brand}` : ''}</p>
        <h3 className="mt-1 text-base font-medium leading-snug">{product.name}</h3>
        <p className="mt-1.5 text-sm font-semibold">{money(product)} {date && <span className="text-[10px] font-normal uppercase tracking-wide text-neutral-500">price as of {date}</span>}</p>
        <p className="mt-1.5 text-xs leading-5 text-neutral-600">{listedSizes.length ? `Sizes listed in our data: ${listedSizes.join(' · ')}. Confirm at the store.` : 'No sizes listed in our data. Check the store.'}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.18em]">What matches</p>
            <ul className="mt-2 space-y-1.5 text-[13px] leading-5 text-neutral-700">
              {matched.length ? matched.map((line) => <li key={line} className="flex gap-2"><Check size={14} className="mt-1 shrink-0" aria-hidden="true" />{line}</li>) : <li className="text-neutral-500">Nothing specific beyond the words you used.</li>}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.18em]">Differences</p>
            <ul className="mt-2 space-y-1.5 text-[13px] leading-5 text-neutral-700">
              {differences.length ? differences.map((line) => <li key={line} className="flex gap-2"><Minus size={14} className="mt-1 shrink-0 text-neutral-400" aria-hidden="true" />{line}</li>) : <li className="text-neutral-500">None we could find in the listing.</li>}
            </ul>
          </div>
        </div>

        <a href={affiliateUrl(product.productUrl)} target="_blank" rel={outboundRel(product.productUrl)} className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.14em] underline decoration-neutral-300 underline-offset-[6px] transition hover:decoration-neutral-950">View at {product.vendor} <ExternalLink size={12} /></a>
      </div>
    </li>
  )
}

export default function Match() {
  const [form, setForm] = useState(empty)
  const [catalog, setCatalog] = useState(null)
  const [outcome, setOutcome] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => { getRealProducts().then(setCatalog) }, [])

  const set = (name, value) => setForm((current) => ({ ...current, [name]: value }))
  const stores = useMemo(() => (catalog ? [...new Set(catalog.map((product) => product.vendor))].sort() : []), [catalog])
  const prompt = useMemo(() => buildPrompt(form), [form])

  const find = (event) => {
    event.preventDefault()
    const request = buildRequest(form)
    if (!hasRequirements(request)) { setOutcome({ request, results: [], empty: true }); return }
    setShowAll(false)
    setOutcome({ request, results: rankProducts(catalog || [], request, 12) })
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 2500) } catch { setCopied(false) }
  }

  const shown = outcome ? (showAll ? outcome.results : outcome.results.slice(0, 5)) : []
  const anyExact = outcome?.results.some((result) => result.exact)

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[.22em] text-neutral-500">Describe it, we’ll find it</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Find my match.</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">Describe the exact piece you have in mind. We compare it with real products in our marketplace and rank the closest ones, saying what matches and what doesn’t. Fill in only what you know.</p>
      </div>

      <form onSubmit={find} className="mt-10 grid gap-4 border border-neutral-300 bg-white p-5 sm:p-8">
        <label><span className={label}>In your own words</span>
          <textarea value={form.description} onChange={(event) => set('description', event.target.value)} rows={3} maxLength={400} placeholder="e.g. a cream cropped tweed jacket with gold buttons and a round neckline" className={`${field} py-2.5`} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label><span className={label}>Item</span>
            <select value={form.category} onChange={(event) => set('category', event.target.value)} className={field}>
              <option value="">Any kind of item</option>
              {shoppingCategories.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label><span className={label}>For</span>
            <select value={form.gender} onChange={(event) => set('gender', event.target.value)} className={field}>
              {[['', 'Anyone'], ['Women', 'Women'], ['Men', 'Men'], ['Children', 'Children']].map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
          </label>
          <Field name="brand" text="Brand" form={form} set={set} placeholder="Preferred brand, if any" />
          <label><span className={label}>Color or shade</span>
            <input value={form.color} onChange={(event) => set('color', event.target.value)} list="match-colors" placeholder="e.g. ivory, navy, olive" maxLength={40} className={field} />
            <datalist id="match-colors">{shoppingColors.map((color) => <option key={color.value} value={color.label} />)}</datalist>
          </label>
          <Field name="material" text="Material" form={form} set={set} placeholder="Cotton, silk, wool, leather…" />
          <Field name="fit" text="Fit" form={form} set={set} placeholder="Slim, oversized, relaxed, tailored…" />
          <Field name="style" text="Style" form={form} set={set} placeholder="Minimalist, classic, vintage…" />
          <Field name="details" text="Design details" form={form} set={set} placeholder="Neckline, sleeves, buttons, pockets, print…" />
          <Field name="size" text="Size" form={form} set={set} placeholder="e.g. M, 8, 32" />
          <Field name="minPrice" text="Lowest price ($)" form={form} set={set} placeholder="0" inputMode="decimal" />
          <Field name="maxPrice" text="Highest price ($)" form={form} set={set} placeholder="500" inputMode="decimal" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={!catalog} className="min-h-12 bg-neutral-950 px-8 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-neutral-700 disabled:opacity-50">{catalog ? 'Find my matches' : 'Loading the marketplace…'}</button>
          <button type="button" onClick={() => { setForm(empty); setOutcome(null) }} className="min-h-12 px-4 text-xs font-semibold uppercase tracking-[.14em] underline underline-offset-4">Clear</button>
        </div>
      </form>

      {outcome && (
        <div className="mt-12" aria-live="polite">
          <h2 className="text-2xl">{outcome.empty ? 'Tell us a little more.' : outcome.results.length ? (anyExact ? 'Your closest matches.' : 'No exact match, but here are the closest.') : 'No suitable match found.'}</h2>
          {outcome.empty ? (
            <p className="mt-3 text-sm leading-6 text-neutral-600">Add at least one detail, like the kind of item, a color or a price, and we’ll look.</p>
          ) : (
            <>
              <p className="mt-3 text-sm leading-6 text-neutral-600">You asked for: {describeRequest(outcome.request).join(' · ')}.</p>
              {outcome.results.length === 0 && <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">Nothing in our marketplace fits those details closely enough, and we won’t show something that doesn’t. Try fewer or broader details, a wider price range, or <Link to={`/shop?q=${encodeURIComponent([form.description, form.category, form.color].filter(Boolean).join(' '))}`} className="underline underline-offset-4">search the shop</Link> or the wider web from there.</p>}
              <ol className="mt-6">{shown.map((result, index) => <Result key={result.product.id} result={result} rank={index + 1} />)}</ol>
              {!showAll && outcome.results.length > 5 && <button type="button" onClick={() => setShowAll(true)} className="mt-2 min-h-12 border border-neutral-900 px-6 text-xs font-semibold uppercase tracking-[.14em] transition hover:bg-neutral-950 hover:text-white">Show {outcome.results.length - 5} more</button>}
              {outcome.results.length > 0 && <p className="mt-6 max-w-2xl text-[11px] leading-5 text-neutral-500">Scores compare your words with each listing’s name, color, brand and listed sizes. We can’t compare photos and we can’t see stock, so we never claim an item is available: the store confirms live price, sizes and availability.</p>}
            </>
          )}
        </div>
      )}

      <div className="mt-16 border-t border-neutral-300 pt-10">
        <h2 className="text-2xl">Want an AI assistant to hunt for you?</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">This is the same description as a ready-to-paste prompt, built from what you filled in above. Add the store’s name, copy it, and paste it into any AI shopping assistant. Building and copying it happens on your device; nothing is sent to us.</p>
        <div className="mt-5 grid gap-4 sm:max-w-md">
          <label><span className={label}>Store website (optional)</span>
            <input value={form.store} onChange={(event) => set('store', event.target.value)} list="match-stores" placeholder="e.g. Zara" maxLength={60} className={field} />
            <datalist id="match-stores">{stores.map((name) => <option key={name} value={name} />)}</datalist>
          </label>
        </div>
        <textarea readOnly value={prompt} rows={14} aria-label="Prompt to copy" className="mt-4 w-full border border-neutral-300 bg-neutral-50 p-4 font-mono text-xs leading-5 outline-none" />
        <button type="button" onClick={copy} className="mt-3 inline-flex min-h-12 items-center gap-2 bg-neutral-950 px-6 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-neutral-700"><Copy size={15} /> {copied ? 'Copied' : 'Copy the prompt'}</button>
      </div>

      <div className="mt-14">
        <h3 className="text-[11px] font-semibold uppercase tracking-[.2em]">How matching works</h3>
        <div className="mt-2 border-t border-neutral-300">
          <Faq q="Where do the results come from?" a="Only real products in our marketplace, each with a real store page and the price we read from the store, shown with its date. We never make up a product, a price or a link." />
          <Faq q="How is the score worked out?" a="Only the details you filled in count. Each is checked against the listing: the kind of item, color or shade, brand, material, fit, style, design details, price range and size. The score is how much of what you asked for the listing confirms." />
          <Faq q="What does “matches everything we can check” mean?" a="Every detail you gave lines up with what the listing says. A detail the listing never mentions, like a material, can’t be confirmed, so that item is shown as a close alternative instead." />
          <Faq q="Do you compare photos?" a="Not yet. We compare the written listing. Look at each store’s photos before you buy, because they show what words can’t." />
          <Faq q="Is the item in stock?" a="We can’t tell. The store has the live price, sizes and stock." link={['/delivery-returns', 'Delivery & returns']} />
        </div>
      </div>
    </section>
  )
}
