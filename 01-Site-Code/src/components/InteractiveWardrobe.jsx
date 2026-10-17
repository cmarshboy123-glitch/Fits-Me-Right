import { Gem, Search, Shirt, ShoppingBag, Store } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useStyle } from '../context/StyleContext'

const destinations = [
  { label: 'Women', icon: Shirt, className: 'wardrobe-hotspot-women', gender: 'Women' },
  { label: 'Men', icon: Shirt, className: 'wardrobe-hotspot-men', gender: 'Men' },
  { label: 'Cobbler Corner', icon: ShoppingBag, className: 'wardrobe-hotspot-shoes', path: '/cobbler-corner' },
  { label: 'Just Jewels', icon: Gem, className: 'wardrobe-hotspot-jewels', path: '/just-jewels' },
]

export default function InteractiveWardrobe() {
  const navigate = useNavigate()
  const { updateSelection } = useStyle()

  const startFor = (gender) => {
    updateSelection('gender', gender)
    navigate('/style/body-type')
  }

  return (
    <section className="literal-wardrobe is-open" aria-label="Fits Me Right wardrobe">
      <img
        className="wardrobe-interior"
        src="/assets/wardrobe-interior-v1.webp"
        fetchPriority="high"
        alt=""
        aria-hidden="true"
      />
      <div className="wardrobe-light" aria-hidden="true" />

      <div className="wardrobe-welcome">
        <p>Your Fashion Concierge</p>
        <h1>Your closet.<br />Every store.</h1>
        <Link to="/shop"><Search size={17} /> SEARCH EVERY STORE</Link>
      </div>

      <div className="wardrobe-destinations">
        {destinations.map(({ label, icon: Icon, className, gender, path }) => (
          gender ? (
            <button key={label} onClick={() => startFor(gender)} className={`wardrobe-hotspot ${className}`}><Icon size={17} /><span>{label}</span></button>
          ) : (
            <Link key={label} to={path} className={`wardrobe-hotspot ${className}`}><Icon size={17} /><span>{label}</span></Link>
          )
        ))}
      </div>

      <Link to="/thrifty-shopper" className="wardrobe-drawer wardrobe-drawer-one"><span>THRIFT &amp; VINTAGE</span><span className="wardrobe-handle" /></Link>
      <Link to="/creative-corner" className="wardrobe-drawer wardrobe-drawer-two"><span>CREATIVE CORNER</span><span className="wardrobe-handle" /></Link>
      <Link to="/shop" className="wardrobe-center-cta"><Store size={18} /> ENTER THE MARKETPLACE</Link>
    </section>
  )
}
