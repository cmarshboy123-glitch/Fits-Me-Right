import { Outlet, useLocation } from 'react-router-dom'
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import RouteLoader from './RouteLoader'
import { getPageTitle } from '../utils/pageTitle'

export default function Layout() {
  const location = useLocation()
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const previousRoute = useRef(location.key)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    document.title = getPageTitle(location.pathname)
  }, [location.pathname])

  useLayoutEffect(() => {
    if (previousRoute.current === location.key) {
      return undefined
    }

    previousRoute.current = location.key
    setIsRouteLoading(true)
    const timer = window.setTimeout(() => setIsRouteLoading(false), 900)
    return () => window.clearTimeout(timer)
  }, [location.key])

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-black focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white">Skip to main content</a>
      <RouteLoader active={isRouteLoading} />
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
