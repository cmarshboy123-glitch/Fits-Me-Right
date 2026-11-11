import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'
import { OPERATOR_NAME } from '../data/legalPages'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-neutral-200 bg-[#F7F5F0]">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-14 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <BrandMark />
          <p className="mt-5 max-w-md text-sm leading-6 text-neutral-600">Your fashion concierge and independent marketplace—thoughtful finds for every body, every plan, and every version of you.</p>
        </div>
        <div><p className="text-xs font-bold uppercase tracking-[.16em]">Shop</p><div className="mt-3 flex flex-col text-sm text-neutral-600 [&>a]:py-2.5"><Link to="/shop">All Stores</Link><Link to="/style/gender">Your Style Edit</Link><Link to="/fast">Need It Fast</Link><Link to="/fit-guide">Fit Guide</Link><Link to="/cobbler-corner">Cobbler Corner</Link><Link to="/just-jewels">Just Jewels</Link><Link to="/thrifty-shopper">Thrifty Shopper</Link><Link to="/thrift-corner">Thrift Corner: Sell Your Stuff</Link><Link to="/wishlist">Your Wishlist</Link></div></div>
        <div><p className="text-xs font-bold uppercase tracking-[.16em]">About</p><div className="mt-3 flex flex-col text-sm text-neutral-600 [&>a]:py-2.5"><Link to="/creative-corner">Creative Corner</Link><Link to="/about">Our Fit Promise</Link><Link to="/help">Help & Contact</Link></div></div>
      </div>
      <div className="border-t border-neutral-200 px-4 py-5 text-center text-xs text-neutral-500"><div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"><span>© {year} {OPERATOR_NAME || 'Fits Me Right'}. All rights reserved.</span><Link to="/privacy" className="py-3 underline">Privacy</Link><Link to="/terms" className="py-3 underline">Terms</Link><Link to="/disclosures" className="py-3 underline">How our listings work</Link></div></div>
    </footer>
  )
}
