import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { StyleProvider } from './context/StyleContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StyleProvider>
        <App />
      </StyleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
