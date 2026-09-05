import { Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStyle } from '../context/StyleContext'
import BrandMark from './BrandMark'

const nav = [
  ['Cobbler Corner', '/cobbler-corner'],
  ['Just Jewels', '/just-jewels'],
  ['Thrifty Shopper', '/thrifty-shopper'],
  ['Creative Corner', '/creative-corner'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { updateSelection } = useStyle()

  const startFor = (gender) => {
    updateSelection('gender', gender)
    navigate('/style/body-type')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-6 px-4 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="Fits Me Right home"><BrandMark /></Link>
        <div className="hidden h-full items-center gap-6 md:flex">
          <button onClick={() => startFor('Women')} className="text-sm font-semibold text-neutral-700 transition hover:text-black">Women</button>
          <button onClick={() => startFor('Men')} className="text-sm font-semibold text-neutral-700 transition hover:text-black">Men</button>
          {nav.map(([label, path]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `text-xs font-semibold transition ${isActive ? 'text-black' : 'text-neutral-500 hover:text-black'}`}>{label}</NavLink>
          ))}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); navigate(`/shop?q=${encodeURIComponent(query)}`) }} className="ml-auto hidden max-w-sm flex-1 items-center rounded-full border border-neutral-200 bg-[#F7F5F0] px-4 py-2.5 lg:flex">
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search every store" aria-label="Search" />
          <button aria-label="Submit search"><Search size={19} /></button>
        </form>
        <div className="ml-auto flex items-center gap-4 text-neutral-700 lg:ml-0">
          <button aria-label="Search" onClick={() => navigate('/shop')} className="lg:hidden"><Search size={21} /></button>
          <button aria-label="Wishlist" className="hidden sm:block"><Heart size={21} /></button>
          <button aria-label="Account" className="hidden sm:block"><UserRound size={21} /></button>
          <button aria-label="Shopping bag"><ShoppingBag size={21} /></button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="md:hidden">{open ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </div>
      {open && (
        <div className="border-t border-neutral-200 bg-white px-4 py-6 md:hidden">
          <div className="flex flex-col gap-5 text-sm font-bold">
            <button className="text-left" onClick={() => startFor('Women')}>Women</button>
            <button className="text-left" onClick={() => startFor('Men')}>Men</button>
            {nav.map(([label, path]) => <Link key={path} to={path} onClick={() => setOpen(false)}>{label}</Link>)}
          </div>
        </div>
      )}
    </header>
  )
}

