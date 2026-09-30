import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ComingSoon from './ComingSoon.jsx'

const comingSoonEnabled = import.meta.env.VITE_COMING_SOON !== 'false'

const root = createRoot(document.getElementById('root'))

if (comingSoonEnabled) {
  document.title = 'Eastern Western | Coming Soon'
  root.render(
    <StrictMode>
      <ComingSoon />
    </StrictMode>,
  )
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
