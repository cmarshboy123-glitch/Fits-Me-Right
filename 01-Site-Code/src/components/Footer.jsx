import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'
import { useConsent } from '../context/ConsentContext'
import { OPERATOR_NAME } from '../data/legalPages'

// Quiet boutique footer: small-caps column headings, small plain links, the logo centered at the bottom.
const columns = [
  ['Shop', [['All stores', '/shop'], ['Your style edit', '/style/gender'], ['Tuxedos', '/shop?collection=tuxedos'], ['Find my match', '/match'], ['Need it fast', '/fast'], ['Fit guide', '/fit-guide']]],
  ['Discover', [['Cobbler Corner', '/cobbler-corner'], ['Just Jewels', '/just-jewels'], ['Thrifty Shopper', '/thrifty-shopper'], ['Thrift Corner: sell your stuff', '/thrift-corner'], ['Creative Corner', '/creative-corner']]],
  ['Your things', [['Your wishlist', '/wishlist'], ['Your Look Book', '/look-book'], ['Style profiles', '/profiles'], ['Our fit promise', '/about']]],
  ['Customer care', [['Contact us', '/contact'], ['Help & FAQs', '/help'], ['Delivery & returns', '/delivery-returns'], ['Accessibility', '/accessibility']]],
  ['The small print', [['How our listings work', '/disclosures'], ['Privacy', '/privacy'], ['Terms', '/terms']]],
]

const linkClass = 'block py-2.5 text-left text-[13px] text-neutral-600 transition hover:text-black hover:underline hover:underline-offset-4'

export default function Footer() {
  const year = new Date().getFullYear()
  const { openSettings } = useConsent()
  return (
    <footer className="mt-24 border-t border-neutral-300 bg-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 lg:grid-cols-5 lg:px-8">
        {columns.map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-neutral-950">{title}</p>
            <ul className="mt-4">
              {links.map(([label, to]) => (
                <li key={to}><Link to={to} className={linkClass}>{label}</Link></li>
              ))}
              {title === 'The small print' && <li><button type="button" onClick={openSettings} className={`${linkClass} w-full`}>Cookie settings</button></li>}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-neutral-200 px-4 py-12 text-center">
        <Link to="/" aria-label="Fits Me Right home" className="inline-block"><BrandMark /></Link>
        <p className="mx-auto mt-5 max-w-md text-[13px] leading-6 text-neutral-600">Your fashion concierge and independent marketplace: thoughtful finds for every body, every plan, and every version of you.</p>
        <p className="mt-6 text-[11px] uppercase tracking-[.14em] text-neutral-500">© {year} {OPERATOR_NAME || 'Fits Me Right'}. All rights reserved.</p>
      </div>
    </footer>
  )
}
