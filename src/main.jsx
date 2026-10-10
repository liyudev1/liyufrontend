import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Tell Telegram the Mini App is ready (some clients only fully populate
// initDataUnsafe — including the user's username/chat id — after this),
// and expand to full height instead of opening half-height.
// Optional chaining: no-op outside Telegram (window.Telegram is undefined
// in a regular browser tab), so this never breaks the normal web app.
window.Telegram?.WebApp?.ready();
window.Telegram?.WebApp?.expand();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
