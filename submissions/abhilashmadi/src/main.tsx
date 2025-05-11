import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/css/globals.css'
import App from '@/app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
