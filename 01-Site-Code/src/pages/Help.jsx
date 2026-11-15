import { Link } from 'react-router-dom'
import SupportPage from '../components/SupportPage'
import { useConsent } from '../context/ConsentContext'
import { AFFILIATES_ACTIVE } from '../utils/affiliate'

const groups = [
  {
    title: 'Shopping',
    items: [
      {
        q: 'Does Fits Me Right sell anything directly?',
        a: AFFILIATES_ACTIVE
          ? 'No. Every product links out to the retailer that actually sells it. We don’t process payments or hold your card details. Some links are affiliate links, marked on the card, which means the store may pay us a commission if you buy.'
          : 'No. Every product links out to the retailer that actually sells it. We don’t process payments, hold your card details, or take a cut of the sale.',
      },
      {
        q: 'Why do some items say “View at” a store and others say “Search at” a store?',
        a: '“View at” links straight to the exact page we confirmed at that store, and the card says the date we checked it. When we haven’t confirmed an exact link yet, “Search at” opens a live search at that retailer for the same item instead of a dead end.',
      },
      {
        q: 'How current are the prices and sizes shown?',
        a: 'Prices and size availability are snapshots meant to help you compare. The retailer always has the final, live price and stock — we note the date a listing was last checked where we can.',
      },
      {
        q: 'Where do the listings come from, and do you earn money from them?',
        a: `Most are real products from stores’ own public product pages and feeds. A smaller set are sample listings (an example name and price, not a specific item in stock). They are hidden unless you turn them on in the shop’s filters. ${AFFILIATES_ACTIVE ? 'Some links are affiliate links and may earn us a commission, and they are marked.' : 'We don’t earn anything when you click or buy.'} The full explanation is on our How our listings work page.`,
        link: ['/disclosures', 'How our listings work'],
      },
      {
        q: 'Who handles delivery, returns and sizing questions about an order?',
        a: 'The store you bought from. We never take orders, so we can’t see or change one.',
        link: ['/delivery-returns', 'Delivery & returns'],
      },
      {
        q: 'Do you offer sizing and style advice?',
        a: 'Our Fit Guide collects published stylist tips by body type, and the Style Edit narrows the shop to your body type, budget and occasion. For a question about one item, write to us and we’ll do our best.',
        link: ['/fit-guide', 'Open the Fit Guide'],
      },
      {
        q: 'Can I sell my own clothes on Fits Me Right?',
        a: 'Not directly. We don’t take listings, hold items or handle payments. Thrift Corner points you to resale marketplaces that do, with a few simple steps for getting your clothes ready to sell.',
        link: ['/thrift-corner', 'Visit Thrift Corner'],
      },
    ],
  },
  {
    title: 'Your saved items',
    items: [
      {
        q: 'Do I need an account?',
        a: 'No. Wishlist items, your Look Book and saved style profiles are stored in your browser on this device — there’s no sign-up, login, or password.',
      },
      {
        q: 'What is the Look Book?',
        a: 'A place to pull items you’ve saved into named looks, like “cousin’s wedding”, and keep your own notes on each piece: the size you chose, how it fits, and how it looks on you. Like the wishlist, it is saved only in this browser. We never see it, and clearing your browser data or switching devices clears it.',
        link: ['/look-book', 'Open your Look Book'],
      },
      {
        q: 'Will my wishlist follow me to another device?',
        a: 'Not yet — it’s saved locally in this browser only. Clearing your browser data or switching devices will clear it too.',
      },
    ],
  },
  {
    title: 'Privacy and cookies',
    items: [
      {
        q: 'Do you use cookies?',
        a: 'Not for analytics or advertising. We keep a few things in your browser so the site works (your wishlist, Look Book, saved profiles and your cookie choice). If we ever add analytics or advertising cookies, they stay off unless you allow them.',
        link: ['/privacy', 'Read the privacy page'],
      },
      {
        q: 'How do I change my cookie choice?',
        cookieButton: true,
      },
    ],
  },
  {
    title: 'Problems',
    items: [
      {
        q: 'I found a broken link or wrong price. What do I do?',
        a: 'Tell us which item and which store. We rely on reports like this to keep the marketplace accurate.',
        link: ['/contact', 'Contact us'],
      },
      {
        q: 'Do you have a phone line or live chat?',
        a: 'No. We’re reachable by email, and the contact page makes it quick to write.',
        link: ['/contact', 'Contact us'],
      },
    ],
  },
]

export default function Help() {
  const { openSettings } = useConsent()
  const shaped = groups.map((group) => ({
    ...group,
    items: group.items.map((item) => (item.cookieButton
      ? { q: item.q, children: <p>Use “Cookie settings” at the bottom of any page, or <button type="button" onClick={openSettings} className="text-black underline underline-offset-4">open it here</button>. You can allow or turn off the optional categories whenever you like.</p> }
      : item)),
  }))

  return (
    <SupportPage
      title="Help & FAQs."
      intro="Answers to what we hear most. Can’t find yours? Write to us."
      groups={shaped}
    >
      <nav aria-label="Customer care" className="mt-10 grid grid-cols-2 gap-px border border-neutral-300 bg-neutral-300 text-center sm:grid-cols-4">
        {[['Contact us', '/contact'], ['Delivery & returns', '/delivery-returns'], ['Accessibility', '/accessibility'], ['Privacy', '/privacy']].map(([label, to]) => (
          <Link key={to} to={to} className="flex min-h-14 items-center justify-center bg-white px-3 text-[11px] font-semibold uppercase tracking-[.14em] transition hover:bg-neutral-50">{label}</Link>
        ))}
      </nav>
    </SupportPage>
  )
}
