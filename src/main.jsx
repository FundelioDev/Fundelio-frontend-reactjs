import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { clearOldPreviewData } from './utils/previewStorage'

// Clear old preview data on app initialization
clearOldPreviewData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
