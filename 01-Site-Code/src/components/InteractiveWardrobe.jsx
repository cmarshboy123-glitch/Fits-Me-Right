import { Gem, Search, Shirt, ShoppingBag, Store } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStyle } from '../context/StyleContext'

const destinations = [
  { label: 'Women', icon: Shirt, className: 'wardrobe-hotspot-women', action: 'Women' },
  { label: 'Men', icon: Shirt, className: 'wardrobe-hotspot-men', action: 'Men' },
  { label: 'Cobbler Corner', icon: ShoppingBag, className: 'wardrobe-hotspot-shoes', path: '/cobbler-corner' },
  { label: 'Just Jewels', icon: Gem, className: 'wardrobe-hotspot-jewels', path: '/just-jewels' },
]

export default function InteractiveWardrobe() {
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
    <section className="literal-wardrobe is-open" aria-label="Fits Me Right wardrobe">
      <video
        className="wardrobe-interior"
        src="/assets/wardrobe-motion-v1.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="wardrobe-light" aria-hidden="true" />

      <div className="wardrobe-welcome">
        <p>Your Fashion Concierge</p>
        <h1>Your closet.<br />Every store.</h1>
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
    </section>
  )
}
