import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { StyleProvider } from './context/StyleContext'
import { WishlistProvider } from './context/WishlistContext'
import '@fontsource-variable/inter'
import './index.css'

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
