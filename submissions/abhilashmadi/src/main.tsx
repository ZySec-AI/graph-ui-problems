import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@css/globals.css'
import App from '@/App'
import GraphyContext from "./context/graphy-context"
import { ThemeProvider } from "./context/theme-provider"
import { TooltipProvider } from "@radix-ui/react-tooltip"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <GraphyContext>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </GraphyContext>
    </ThemeProvider>
  </StrictMode>,
)
