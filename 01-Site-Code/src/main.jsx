import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { StyleProvider } from './context/StyleContext'
import { WishlistProvider } from './context/WishlistContext'
import '@fontsource-variable/inter'
import './index.css'

// After a new deploy, a tab that was open before it can ask for a page file that no
// longer exists. Reload once to pick up the new version instead of showing a blank page.
window.addEventListener('vite:preloadError', () => {
  if (!sessionStorage.getItem('fmr-reloaded-for-update')) {
    sessionStorage.setItem('fmr-reloaded-for-update', '1')
    window.location.reload()
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StyleProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </StyleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
