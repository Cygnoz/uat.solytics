import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ResponseProvider } from './context/ResponseContext.tsx'
import { OrgProvider } from './context/OrgContext.tsx'
import { SocketProvider } from './context/SocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <OrgProvider>
    <ResponseProvider>
    <SocketProvider>
    <App />
    </SocketProvider>
    </ResponseProvider>
    </OrgProvider>
    </BrowserRouter>

  </StrictMode>,
)
