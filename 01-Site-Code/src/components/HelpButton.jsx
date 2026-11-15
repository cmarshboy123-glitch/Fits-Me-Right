import { LifeBuoy } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useConsent } from '../context/ConsentContext'

// A small "Help" button that stays in the corner of every page, like a boutique's help tab.
// It opens the contact page. It steps aside on the support pages themselves, while the cookie
// banner is showing, and on a phone's shop page, where the filter button needs that corner.
export default function HelpButton() {
  const { pathname } = useLocation()
  const { needsChoice, settingsOpen } = useConsent()
  if (needsChoice || settingsOpen || ['/contact', '/help'].includes(pathname)) return null
  return (
    <Link
      to="/contact"
      aria-label="Help and contact"
      className={`fixed bottom-4 right-4 z-40 h-12 items-center gap-2 bg-neutral-950 px-4 text-[11px] font-semibold uppercase tracking-[.14em] text-white shadow-[0_6px_20px_rgba(0,0,0,.25)] transition hover:bg-neutral-700 sm:flex ${pathname === '/shop' ? 'hidden' : 'flex'}`}
    >
      <LifeBuoy size={17} strokeWidth={1.6} aria-hidden="true" /> Help
    </Link>
  )
}
