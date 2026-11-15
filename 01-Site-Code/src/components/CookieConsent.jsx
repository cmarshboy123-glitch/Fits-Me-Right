import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useConsent } from '../context/ConsentContext'

const outlineButton = 'min-h-11 flex-1 border border-neutral-950 px-4 text-[11px] font-semibold uppercase tracking-[.14em] text-neutral-950 transition hover:bg-neutral-100 sm:flex-none sm:px-6'
const solidButton = 'min-h-11 flex-1 bg-neutral-950 px-4 text-[11px] font-semibold uppercase tracking-[.14em] text-white transition hover:bg-neutral-700 sm:flex-none sm:px-6'

// Slim banner along the bottom until a choice is made. It never blocks the page.
function Banner() {
  const { needsChoice, acceptAll, rejectNonEssential, openSettings } = useConsent()
  if (!needsChoice) return null
  return (
    <div role="region" aria-label="Cookie choices" className="fixed inset-x-0 bottom-0 z-[90] border-t border-neutral-300 bg-white px-4 py-4 shadow-[0_-8px_24px_rgba(0,0,0,.06)] sm:px-6">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-3xl text-[13px] leading-5 text-neutral-700">
          We keep a few things in your browser so your wishlist and Look Book work. We don’t use analytics or advertising cookies today, and if we ever do they stay off unless you allow them.{' '}
          <Link to="/privacy" className="underline underline-offset-4">How we handle your data</Link>.
        </p>
        <div className="flex flex-wrap gap-2 lg:shrink-0">
          <button type="button" onClick={acceptAll} className={solidButton}>Accept all</button>
          <button type="button" onClick={rejectNonEssential} className={outlineButton}>Reject non-essential</button>
          <button type="button" onClick={openSettings} className={`${outlineButton} basis-full sm:basis-auto`}>Manage cookies</button>
        </div>
      </div>
    </div>
  )
}

function Switch({ id, checked, onChange, disabled = false, label }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 border transition ${checked ? 'border-neutral-950 bg-neutral-950' : 'border-neutral-400 bg-white'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 transition-all ${checked ? 'left-[1.625rem] bg-white' : 'left-0.5 bg-neutral-400'}`} />
    </button>
  )
}

// The cookie settings dialog: opened by "Manage cookies" and by "Cookie settings" in the footer.
function Settings() {
  const { settingsOpen, choice, closeSettings, save, acceptAll, rejectNonEssential } = useConsent()
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const dialog = useRef(null)
  const opener = useRef(null)

  // Start from the saved choice each time it opens.
  useEffect(() => {
    if (!settingsOpen) return undefined
    setAnalytics(Boolean(choice?.analytics))
    setMarketing(Boolean(choice?.marketing))
    opener.current = document.activeElement
    dialog.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') { closeSettings(); return }
      if (event.key !== 'Tab' || !dialog.current) return
      const focusable = [...dialog.current.querySelectorAll('button:not([disabled]), a[href]')]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (opener.current && opener.current.focus) opener.current.focus()
    }
  }, [settingsOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!settingsOpen) return null

  const rows = [
    ['Strictly necessary', 'Keeps your wishlist, Look Book and saved style profiles on this device, and remembers this choice. Always on, and never sent to us.', true, true, () => {}, 'cookie-necessary'],
    ['Analytics', 'Would count visits so we can see what to improve. None is in use today. If we add it, it stays off unless you turn it on here.', analytics, false, setAnalytics, 'cookie-analytics'],
    ['Advertising and affiliate', 'Would let store and affiliate partners recognise that you came from us. None is in use today. If we add it, it stays off unless you turn it on here.', marketing, false, setMarketing, 'cookie-marketing'],
  ]

  return (
    <div className="fixed inset-0 z-[100] grid place-items-end bg-black/50 sm:place-items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSettings() }}>
      <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" className="max-h-[92vh] w-full overflow-y-auto bg-white p-5 outline-none sm:max-w-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="cookie-settings-title" className="font-serif text-2xl">Cookie settings</h2>
          <button type="button" onClick={closeSettings} aria-label="Close cookie settings" className="-mr-2 -mt-2 grid h-11 w-11 place-items-center"><X size={20} strokeWidth={1.5} /></button>
        </div>
        <p className="mt-2 text-[13px] leading-5 text-neutral-600">Choose what Fits Me Right may remember in your browser. You can change this any time with “Cookie settings” at the bottom of every page. Details are in our <Link to="/privacy" onClick={closeSettings} className="underline underline-offset-4">privacy page</Link>.</p>

        <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
          {rows.map(([title, text, on, locked, setter, id]) => (
            <li key={id} className="flex items-start justify-between gap-4 py-5">
              <div>
                <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[.18em] text-neutral-950">{title}{locked ? ' (always on)' : ''}</label>
                <p className="mt-2 text-[13px] leading-5 text-neutral-600">{text}</p>
              </div>
              <Switch id={id} checked={on} onChange={setter} disabled={locked} label={`${title}${locked ? ', always on' : ''}`} />
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={() => save({ analytics, marketing })} className={solidButton}>Save my choices</button>
          <button type="button" onClick={acceptAll} className={outlineButton}>Accept all</button>
          <button type="button" onClick={rejectNonEssential} className={outlineButton}>Reject non-essential</button>
        </div>
      </div>
    </div>
  )
}

export default function CookieConsent() {
  return (
    <>
      <Banner />
      <Settings />
    </>
  )
}
