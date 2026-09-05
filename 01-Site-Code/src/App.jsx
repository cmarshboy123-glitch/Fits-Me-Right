import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import GuidedFlow from './pages/GuidedFlow'
import CobblerCorner from './pages/CobblerCorner'
import JustJewels from './pages/JustJewels'
import NewCreatives from './pages/NewCreatives'
import Shop from './pages/Shop'
import ThriftyShopper from './pages/ThriftyShopper'

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
