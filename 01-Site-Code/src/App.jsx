import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

const GuidedFlow = lazy(() => import('./pages/GuidedFlow'))
const CobblerCorner = lazy(() => import('./pages/CobblerCorner'))
const JustJewels = lazy(() => import('./pages/JustJewels'))
const NewCreatives = lazy(() => import('./pages/NewCreatives'))
const Shop = lazy(() => import('./pages/Shop'))
const FastDelivery = lazy(() => import('./pages/FastDelivery'))
const FitGuide = lazy(() => import('./pages/FitGuide'))
const ThriftyShopper = lazy(() => import('./pages/ThriftyShopper'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Profiles = lazy(() => import('./pages/Profiles'))
const About = lazy(() => import('./pages/About'))
const Help = lazy(() => import('./pages/Help'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="style/:step" element={<GuidedFlow />} />
        <Route path="cobbler-corner" element={<CobblerCorner />} />
        <Route path="just-jewels" element={<JustJewels />} />
        <Route path="thrifty-shopper" element={<ThriftyShopper />} />
        <Route path="creative-corner" element={<NewCreatives />} />
        <Route path="creative-feature" element={<Navigate to="/creative-corner" replace />} />
        <Route path="new-creatives" element={<Navigate to="/creative-corner" replace />} />
        <Route path="shop" element={<Shop />} />
        <Route path="fast" element={<FastDelivery />} />
        <Route path="fit-guide" element={<FitGuide />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="profiles" element={<Profiles />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
