import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { installLogCapture } from './logs.js'
import './styles.css'

installLogCapture()

// native feel: browser long-press context menu band
document.addEventListener('contextmenu', (e) => e.preventDefault())

// saved theme (Settings se) boot pe apply
try {
  const saved = localStorage.getItem('vg_theme')
  if (saved === 'light' || saved === 'dark') document.documentElement.setAttribute('data-theme', saved)
} catch {}

// App content status bar ke NEECHE rahe (na overlap, na size issue)
if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
  import('@capacitor/status-bar').then(async ({ StatusBar, Style }) => {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false })
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light })
      await StatusBar.setBackgroundColor({ color: dark ? '#000000' : '#ffffff' })
    } catch (e) { console.warn('statusbar', e) }
  })
}

// NOTE: the static boot overlay (index.html #boot) is NOT removed here.
// App removes it once React has actually mounted — so between page load
// and first paint there is never a white screen.

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  )
} catch (err) {
  // mount-time crash — show it via plain DOM
  const boot = document.getElementById('boot')
  if (boot) {
    boot.innerHTML = `
      <img src="/logo.png" alt="" />
      <p style="color:#ed4956;max-width:300px;text-align:center;word-break:break-word">Start error: ${String(err?.message || err)}</p>
      <button onclick="location.reload()" style="background:#0095f6;color:#fff;border:none;border-radius:8px;padding:10px 28px;font-weight:700">Reload</button>`
  }
}
