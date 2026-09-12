import { DoorOpen, Gem, Search, Shirt, ShoppingBag, Store, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStyle } from '../context/StyleContext'

const destinations = [
  { label: 'Women', icon: Shirt, className: 'wardrobe-hotspot-women', action: 'Women' },
  { label: 'Men', icon: Shirt, className: 'wardrobe-hotspot-men', action: 'Men' },
  { label: 'Cobbler Corner', icon: ShoppingBag, className: 'wardrobe-hotspot-shoes', path: '/cobbler-corner' },
  { label: 'Just Jewels', icon: Gem, className: 'wardrobe-hotspot-jewels', path: '/just-jewels' },
]

export default function InteractiveWardrobe() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { updateSelection } = useStyle()

  const go = (destination) => {
    if (destination.action) {
      updateSelection('gender', destination.action)
      navigate('/style/body-type')
      return
    }
    navigate(destination.path)
  }

  return (
    <section className={`literal-wardrobe ${isOpen ? 'is-open' : ''}`} aria-label="Interactive Fits Me Right wardrobe">
      <img src="/assets/wardrobe-interior-v1.png" alt="An original warm walnut walk-in wardrobe filled with clothing, shoes, and accessories" className="wardrobe-interior" />
      <div className="wardrobe-light" aria-hidden="true" />

      <div className="wardrobe-welcome">
        <p>Your Fashion Concierge</p>
        <h1>Step inside<br />your wardrobe.</h1>
        <button onClick={() => navigate('/shop')}><Search size={17} /> SEARCH EVERY STORE</button>
      </div>

      <div className="wardrobe-destinations">
        {destinations.map((destination) => {
          const Icon = destination.icon
          return <button key={destination.label} onClick={() => go(destination)} className={`wardrobe-hotspot ${destination.className}`}><Icon size={17} /><span>{destination.label}</span></button>
        })}
      </div>

      <button onClick={() => navigate('/thrifty-shopper')} className="wardrobe-drawer wardrobe-drawer-one"><span>THRIFT &amp; VINTAGE</span><span className="wardrobe-handle" /></button>
      <button onClick={() => navigate('/creative-corner')} className="wardrobe-drawer wardrobe-drawer-two"><span>CREATIVE CORNER</span><span className="wardrobe-handle" /></button>
      <button onClick={() => navigate('/shop')} className="wardrobe-center-cta"><Store size={18} /> ENTER THE MARKETPLACE</button>

      <div className="wardrobe-door wardrobe-door-left" aria-hidden="true"><div className="wardrobe-door-panels"><span /><span /></div><span className="wardrobe-knob" /></div>
      <div className="wardrobe-door wardrobe-door-right" aria-hidden="true"><div className="wardrobe-door-panels"><span /><span /></div><span className="wardrobe-knob" /></div>

      <div className="wardrobe-entry">
        <p>FITS ME RIGHT</p>
        <h2>Your closet.<br />Every store.</h2>
        <span>Open the doors and choose where to begin.</span>
        <button onClick={() => setIsOpen(true)} aria-expanded={isOpen}><DoorOpen size={19} /> OPEN MY WARDROBE</button>
      </div>

      {isOpen && <button onClick={() => setIsOpen(false)} className="wardrobe-close" aria-label="Close wardrobe"><X size={19} /></button>}
    </section>
  )
}
