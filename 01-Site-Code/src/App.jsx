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
const ThriftCorner = lazy(() => import('./pages/ThriftCorner'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Profiles = lazy(() => import('./pages/Profiles'))
const LookBook = lazy(() => import('./pages/LookBook'))
const Match = lazy(() => import('./pages/Match'))
const About = lazy(() => import('./pages/About'))
const Help = lazy(() => import('./pages/Help'))
const Contact = lazy(() => import('./pages/Contact'))
const DeliveryReturns = lazy(() => import('./pages/DeliveryReturns'))
const Accessibility = lazy(() => import('./pages/Accessibility'))
const Legal = lazy(() => import('./pages/Legal'))
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
        <Route path="thrift-corner" element={<ThriftCorner />} />
        <Route path="creative-corner" element={<NewCreatives />} />
        <Route path="creative-feature" element={<Navigate to="/creative-corner" replace />} />
        <Route path="new-creatives" element={<Navigate to="/creative-corner" replace />} />
        <Route path="shop" element={<Shop />} />
        <Route path="fast" element={<FastDelivery />} />
        <Route path="fit-guide" element={<FitGuide />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="profiles" element={<Profiles />} />
        <Route path="look-book" element={<LookBook />} />
        <Route path="match" element={<Match />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route path="contact" element={<Contact />} />
        <Route path="delivery-returns" element={<DeliveryReturns />} />
        <Route path="accessibility" element={<Accessibility />} />
        <Route path="privacy" element={<Legal page="privacy" />} />
        <Route path="terms" element={<Legal page="terms" />} />
        <Route path="disclosures" element={<Legal page="disclosures" />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
