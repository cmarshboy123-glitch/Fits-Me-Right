import { Mail } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../data/legalPages'

const topics = [
  ['A wrong price or a broken link', 'Tell us which item and which store, and where you saw the problem.'],
  ['Help finding something', 'Describe what you’re after: the kind of item, the occasion, your budget and your sizes.'],
  ['Fit and sizing questions', 'Tell us the item or the body type you’re shopping for. Our Fit Guide has stylist tips too.'],
  ['Adding a store or a designer', 'Send the store’s website. We only list items whose real price and page we can read.'],
  ['Privacy or my saved items', 'Ask about this page’s privacy policy, or how your wishlist and Look Book are stored.'],
  ['Something else', 'Anything else we can help with.'],
]

const field = 'min-h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-900'
const label = 'mb-1.5 block text-[10px] font-semibold uppercase tracking-[.18em] text-neutral-500'

export default function Contact() {
  const [topic, setTopic] = useState(topics[0][0])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const hint = topics.find(([title]) => title === topic)?.[1]

  // The form does not send anything itself. It opens the visitor's own email app with the message
  // filled in, so they can read it and press send; nothing leaves their device until then.
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Fits Me Right: ${topic}`)}&body=${encodeURIComponent(`${message}${name ? `\n\n${name}` : ''}`)}`

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[.22em] text-neutral-500">Customer care</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Contact us.</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">Questions about finding the right piece, a price that looks off, a link that doesn’t work, or how your saved items are kept: write to us and we’ll help where we can. Fits Me Right doesn’t sell anything, so for an order you’ve already placed, please contact the store you bought from.</p>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.2em]">Write to us</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-[6px]"><Mail size={16} /> {CONTACT_EMAIL}</a>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[.2em]">Before you write</p>
          <ul className="mt-3 space-y-2 text-[13px] leading-5 text-neutral-600">
            <li>Our <Link to="/help" className="underline underline-offset-4">FAQs</Link> answer the questions we hear most.</li>
            <li>Orders, delivery and returns are handled by each store. See <Link to="/delivery-returns" className="underline underline-offset-4">Delivery &amp; returns</Link>.</li>
            <li>We don’t have a phone line or live chat. Email is the way to reach us.</li>
          </ul>
        </div>

        <form onSubmit={(event) => event.preventDefault()} className="grid gap-4 border border-neutral-300 bg-white p-5 sm:p-6">
          <label><span className={label}>What is this about?</span>
            <select value={topic} onChange={(event) => setTopic(event.target.value)} className={field}>{topics.map(([title]) => <option key={title} value={title}>{title}</option>)}</select>
          </label>
          {hint && <p className="-mt-2 text-xs leading-5 text-neutral-500">{hint}</p>}
          <label><span className={label}>Your name (optional)</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} autoComplete="name" className={field} /></label>
          <label><span className={label}>Your message</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={6} maxLength={2000} className={`${field} py-2.5`} placeholder="Tell us what happened or what you need." /></label>
          <a href={mailto} className="flex min-h-12 items-center justify-center gap-2 bg-neutral-950 px-6 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-neutral-700"><Mail size={16} /> Open in my email app</a>
          <p className="text-[11px] leading-4 text-neutral-500">This opens your own email app with the message filled in. Nothing is sent until you press send there, and nothing you type here is saved or sent to us by this page.</p>
        </form>
      </div>
    </section>
  )
}
