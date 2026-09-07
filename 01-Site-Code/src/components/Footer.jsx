import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-200 bg-[#F7F5F0]">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-14 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <BrandMark />
          <p className="mt-5 max-w-md text-sm leading-6 text-neutral-600">Your fashion concierge and independent marketplace—thoughtful finds for every body, every plan, and every version of you.</p>
        </div>
        <div><p className="text-xs font-bold uppercase tracking-[.16em]">Shop</p><div className="mt-5 flex flex-col gap-3 text-sm text-neutral-600"><Link to="/shop">All Stores</Link><Link to="/style/gender">Your Style Edit</Link><Link to="/cobbler-corner">Cobbler Corner</Link><Link to="/just-jewels">Just Jewels</Link><Link to="/thrifty-shopper">Thrifty Shopper</Link><Link to="/wishlist">Your Wishlist</Link></div></div>
        <div><p className="text-xs font-bold uppercase tracking-[.16em]">About</p><div className="mt-5 flex flex-col gap-3 text-sm text-neutral-600"><Link to="/creative-corner">Creative Corner</Link><Link to="/about">Our Fit Promise</Link><Link to="/help">Help & Contact</Link></div></div>
      </div>
      <div className="border-t border-neutral-200 px-4 py-5 text-center text-xs text-neutral-500">© 2026 Fits Me Right. Style, considered.</div>
    </footer>
  )
}
