import { BookOpen, ExternalLink, Plus, Star, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLookBook } from '../context/LookBookContext'
import { useWishlist } from '../context/WishlistContext'
import { affiliateUrl, outboundRel } from '../utils/affiliate'
import { formatPrice, isDollar } from '../utils/currency'

const occasions = ['Everyday', 'Work', 'Weekend', 'Date night', 'Wedding guest', 'Black tie', 'Travel', 'Other']
const fitOptions = [['', 'How does it fit?'], ['true', 'True to size'], ['small', 'Runs small'], ['large', 'Runs large'], ['unsure', 'Not sure yet']]
const ratingWords = ['Not rated', 'Not for me', 'It’s okay', 'Good', 'Great', 'Love it']

const money = (item) => formatPrice(item)
const dateOf = (iso) => (iso ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`)) : null)

const field = 'min-h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-900'
const smallLabel = 'mb-1.5 block text-[10px] font-semibold uppercase tracking-[.18em] text-neutral-500'

function Rating({ value, onChange, label }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(value === n ? 0 : n)} aria-pressed={value >= n} aria-label={`${n} of 5: ${ratingWords[n]}`} className="grid h-11 w-9 place-items-center">
          <Star size={20} strokeWidth={1.4} fill={value >= n ? '#111' : 'none'} stroke="#111" />
        </button>
      ))}
      <span className="ml-2 text-xs text-neutral-500">{ratingWords[value]}</span>
    </div>
  )
}

function LookItem({ item, lookId }) {
  const { removeItem, updateItem } = useLookBook()
  const { product } = item
  const date = dateOf(product.verifiedAt)
  const patch = (changes) => updateItem(lookId, product.id, changes)
  return (
    <article className="min-w-0">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F3F2EF]">
        {product.imageUrl && <img src={product.imageUrl} alt={`${product.brand || product.vendor} ${product.name}`} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain p-4 mix-blend-multiply" />}
        <button type="button" onClick={() => removeItem(lookId, product.id)} aria-label={`Remove ${product.name} from this look`} className="absolute right-1 top-1 grid h-11 w-11 place-items-center"><X size={19} strokeWidth={1.4} /></button>
      </div>
      <p className="mt-3 truncate text-[10px] font-semibold uppercase tracking-[.16em] text-neutral-500">{product.vendor}</p>
      <h3 className="mt-1.5 text-[13px] font-medium leading-snug">{product.name}</h3>
      <p className="mt-1.5 text-[13px] font-semibold">{money(product)} {date && <span className="block text-[10px] font-normal uppercase tracking-wide text-neutral-500 sm:inline sm:pl-1">price as of {date}</span>}</p>
      {product.productUrl && (
        <a href={affiliateUrl(product.productUrl)} target="_blank" rel={outboundRel(product.productUrl)} className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.14em] underline decoration-neutral-300 underline-offset-[6px] transition hover:decoration-neutral-950">View at {product.vendor} <ExternalLink size={12} /></a>
      )}

      <div className="mt-2 grid gap-3 border-t border-neutral-200 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <label><span className={smallLabel}>Size I chose</span><input value={item.size} onChange={(event) => patch({ size: event.target.value })} placeholder="e.g. M, 32, 8" maxLength={20} className={field} /></label>
          <label><span className={smallLabel}>Fit</span>
            <select value={item.fit} onChange={(event) => patch({ fit: event.target.value })} className={field}>{fitOptions.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select>
          </label>
        </div>
        <div><span className={smallLabel}>How it looks on me</span><Rating value={item.rating} onChange={(rating) => patch({ rating })} label={`How ${product.name} looks on me`} /></div>
        <label><span className={smallLabel}>My notes</span><textarea value={item.note} onChange={(event) => patch({ note: event.target.value })} rows={3} maxLength={500} placeholder="Colour, length, what to wear it with…" className={`${field} py-2.5`} /></label>
      </div>
    </article>
  )
}

function WishlistPicker({ look, onClose }) {
  const { items: saved } = useWishlist()
  const { addItems } = useLookBook()
  const inLook = new Set(look.items.map((item) => item.product.id))
  const available = saved.filter((product) => !inLook.has(product.id))
  const [picked, setPicked] = useState([])
  const toggle = (product) => setPicked((current) => (current.some((p) => p.id === product.id) ? current.filter((p) => p.id !== product.id) : [...current, product]))

  return (
    <div className="mt-6 border border-neutral-300 bg-white p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[.2em]">Add from your wishlist</p>
        <button type="button" onClick={onClose} className="min-h-11 px-2 text-xs font-semibold uppercase tracking-[.14em] underline underline-offset-4">Close</button>
      </div>
      {available.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          {saved.length === 0 ? 'Your wishlist is empty. Tap the heart on items while you browse, then add them here.' : 'Everything on your wishlist is already in this look.'}
          {' '}<Link to="/shop" className="font-semibold underline underline-offset-4">Browse the shop</Link>
        </p>
      ) : (
        <>
          <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {available.map((product) => {
              const on = picked.some((p) => p.id === product.id)
              return (
                <li key={product.id}>
                  <button type="button" onClick={() => toggle(product)} aria-pressed={on} className={`block w-full border text-left ${on ? 'border-neutral-950 ring-1 ring-neutral-950' : 'border-neutral-200'}`}>
                    <span className="block aspect-[3/4] bg-[#F3F2EF]">{product.imageUrl && <img src={product.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain p-2 mix-blend-multiply" />}</span>
                    <span className="block truncate px-2 py-2 text-[11px] font-medium">{product.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <button type="button" disabled={picked.length === 0} onClick={() => { addItems(look.id, picked); onClose() }} className="mt-5 min-h-12 bg-black px-6 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40">
            {picked.length > 0 ? `Add ${picked.length} to this look` : 'Pick items to add'}
          </button>
        </>
      )}
    </div>
  )
}

function Look({ look }) {
  const { updateLook, deleteLook } = useLookBook()
  const [adding, setAdding] = useState(look.items.length === 0)

  // Pound prices are not added into a dollar total.
  const total = look.items.reduce((sum, item) => (isDollar(item.product) ? sum + item.product.price : sum), 0)
  const hasPounds = look.items.some((item) => !isDollar(item.product))
  const rated = look.items.filter((item) => item.rating > 0)
  const average = rated.length ? rated.reduce((sum, item) => sum + item.rating, 0) / rated.length : 0

  return (
    <section className="border-t border-neutral-300 py-10">
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="grid gap-4">
          <label><span className={smallLabel}>Look name</span><input value={look.name} onChange={(event) => updateLook(look.id, { name: event.target.value })} maxLength={60} className={`${field} font-serif text-xl`} /></label>
          <label><span className={smallLabel}>About this look</span><textarea value={look.note} onChange={(event) => updateLook(look.id, { note: event.target.value })} rows={2} maxLength={500} placeholder="Where it’s for, the mood, what you want to remember…" className={`${field} py-2.5`} /></label>
        </div>
        <div className="grid content-start gap-4">
          <label><span className={smallLabel}>Occasion</span>
            <select value={look.occasion} onChange={(event) => updateLook(look.id, { occasion: event.target.value })} className={field}>
              <option value="">Choose one</option>
              {occasions.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <button type="button" onClick={() => { if (window.confirm(`Delete the look “${look.name}”? This can’t be undone.`)) deleteLook(look.id) }} className="flex min-h-11 items-center gap-2 text-left text-xs font-semibold uppercase tracking-[.14em] text-neutral-500 transition hover:text-black"><Trash2 size={15} /> Delete this look</button>
        </div>
      </div>

      {look.items.length > 0 && (
        <p className="mt-6 text-xs font-semibold uppercase tracking-[.14em]">
          {look.items.length} {look.items.length === 1 ? 'item' : 'items'} · {hasPounds ? 'dollar items total ' : 'total '}${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {average > 0 && <span className="text-neutral-500"> · average rating {average.toFixed(1)} of 5</span>}
        </p>
      )}
      {look.items.length > 0 && <p className="mt-1 text-[11px] leading-4 text-neutral-500">Totals add up the prices shown on each item, as of the dates shown. The stores confirm live prices.{hasPounds ? ' Prices in other currencies (pounds, naira) are not included in the total.' : ''}</p>}

      {look.items.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {look.items.map((item) => <LookItem key={item.product.id} item={item} lookId={look.id} />)}
        </div>
      )}

      {adding ? <WishlistPicker look={look} onClose={() => setAdding(false)} /> : (
        <button type="button" onClick={() => setAdding(true)} className="mt-8 flex min-h-12 items-center gap-2 border border-neutral-900 px-6 text-xs font-semibold uppercase tracking-[.14em] transition hover:bg-neutral-950 hover:text-white"><Plus size={16} /> Add items from your wishlist</button>
      )}
    </section>
  )
}

export default function LookBook() {
  const { looks, createLook } = useLookBook()
  const [name, setName] = useState('')
  const [occasion, setOccasion] = useState('')
  const sorted = useMemo(() => looks, [looks])

  const submit = (event) => {
    event.preventDefault()
    createLook({ name, occasion })
    setName('')
    setOccasion('')
  }

  return (
    <section className="mx-auto min-h-[70vh] max-w-[1440px] px-4 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[.22em] text-neutral-500">Saved by you</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Your Look Book.</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">Pull the pieces you love into looks, then keep your own notes on each one: the size you chose, how it fits, and how it looks on you. It all stays on this device. We never see it.</p>
      </div>

      <form onSubmit={submit} className="mx-auto mt-10 grid max-w-3xl gap-3 border border-neutral-300 bg-white p-4 sm:grid-cols-[1fr_200px_auto] sm:items-end sm:p-5">
        <label><span className={smallLabel}>New look</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} placeholder="e.g. Cousin’s wedding" className={field} /></label>
        <label><span className={smallLabel}>Occasion</span>
          <select value={occasion} onChange={(event) => setOccasion(event.target.value)} className={field}>
            <option value="">Choose one</option>
            {occasions.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <button type="submit" className="flex min-h-11 items-center justify-center gap-2 bg-black px-6 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-neutral-800"><Plus size={16} /> Start look</button>
      </form>

      {sorted.length === 0 ? (
        <div className="mx-auto mt-12 max-w-md text-center">
          <BookOpen size={36} strokeWidth={1.2} className="mx-auto text-neutral-400" />
          <h2 className="mt-4 text-2xl">No looks yet.</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">Heart a few items while you browse, name a look above, then add them here.</p>
          <Link to="/shop" className="mt-5 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[.14em] underline underline-offset-[6px]">Browse the shop</Link>
        </div>
      ) : (
        <div className="mt-12">{sorted.map((look) => <Look key={look.id} look={look} />)}</div>
      )}
    </section>
  )
}
