import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ResponseProvider } from './context/ResponseContext.tsx'
import { OrgProvider } from './context/OrgContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <OrgProvider>
    <ResponseProvider>
    <App />
    </ResponseProvider>
    </OrgProvider>
    </BrowserRouter>

  </StrictMode>,
)
