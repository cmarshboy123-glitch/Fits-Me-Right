import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import GuidedFlow from './pages/GuidedFlow'
import CobblerCorner from './pages/CobblerCorner'
import JustJewels from './pages/JustJewels'
import NewCreatives from './pages/NewCreatives'
import Shop from './pages/Shop'
import ThriftyShopper from './pages/ThriftyShopper'
import Wishlist from './pages/Wishlist'
import Profiles from './pages/Profiles'
import About from './pages/About'
import Help from './pages/Help'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

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
