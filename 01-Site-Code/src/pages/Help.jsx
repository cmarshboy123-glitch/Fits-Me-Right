import { ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const faqs = [
  {
    q: 'Does Fits Me Right sell anything directly?',
    a: 'No. Every product links out to the retailer that actually sells it. We don’t process payments, hold your card details, or take a cut of the sale.',
  },
  {
    q: 'Why do some items say “Verified retailer item” and others say “Shop this look”?',
    a: 'A verified item links straight to the exact page we confirmed at that store. When we haven’t confirmed an exact link yet, we open a live search at that retailer for the same item instead of a dead end.',
  },
  {
    q: 'How current are the prices and sizes shown?',
    a: 'Prices and size availability are snapshots meant to help you compare. The retailer always has the final, live price and stock — we note the date a listing was last checked where we can.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. Wishlist items and saved style profiles are stored in your browser on this device — there’s no sign-up, login, or password.',
  },
  {
    q: 'Will my wishlist follow me to another device?',
    a: 'Not yet — it’s saved locally in this browser only. Clearing your browser data or switching devices will clear it too.',
  },
  {
    q: 'I found a broken link or wrong price. What do I do?',
    a: 'Tell us — see the contact details below. We rely on reports like this to keep the marketplace accurate.',
  },
]

export default function Help() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-700">Support</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Help &amp; contact.</h1>
      <p className="mt-5 max-w-xl leading-7 text-neutral-600">Answers to what we hear most, and a way to reach us for everything else.</p>

      <div className="mt-12 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {faqs.map(({ q, a }) => (
          <details key={q} className="group p-6 open:bg-paper">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold marker:content-none">
              {q}
              <span className="shrink-0 text-xl leading-none text-neutral-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-6 text-neutral-600">{a}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-[2rem] bg-gold-50 p-8 lg:p-12">
        <h2 className="text-2xl font-black">Still need something?</h2>
        <p className="mt-3 max-w-lg leading-7 text-neutral-700">Reach out and we’ll get back to you as soon as we can.</p>
        <a href="mailto:hello@fitsmeright.com" className="mt-6 inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-black text-white"><Mail size={17} /> HELLO@FITSMERIGHT.COM</a>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 text-sm font-bold">
        <Link to="/about" className="flex items-center gap-2 text-neutral-700 hover:text-black">READ OUR FIT PROMISE <ArrowRight size={15} /></Link>
        <Link to="/shop" className="flex items-center gap-2 text-neutral-700 hover:text-black">BACK TO SHOPPING <ArrowRight size={15} /></Link>
      </div>
    </section>
  )
}
