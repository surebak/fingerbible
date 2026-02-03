import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { SettingsProvider } from './contexts/SettingsContext'
import { MultiWindowProvider } from './contexts/MultiWindowContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider>
      <MultiWindowProvider>
        <App />
      </MultiWindowProvider>
    </SettingsProvider>
  </StrictMode>,
)
