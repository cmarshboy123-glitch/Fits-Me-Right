import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import RouteLoader from './RouteLoader'

export default function Layout() {
  const location = useLocation()
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const previousRoute = useRef(location.key)

  useEffect(() => {
    window.scrollTo(0, 0)
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

  return <><RouteLoader active={isRouteLoading} /><Header /><main><Outlet /></main><Footer /></>
}
