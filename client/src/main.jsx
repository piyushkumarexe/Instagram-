import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

// swap the static boot loader for the app
const boot = document.getElementById('boot')
if (boot) boot.remove()

// global crash guard — never show a silent white screen
function showFatalError(message) {
  const el = document.createElement('div')
  el.id = 'fatal'
  el.innerHTML = `
    <div style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:30px;text-align:center;z-index:99999">
      <img src="/logo.png" style="width:64px;height:64px;border-radius:14px" />
      <h2 style="margin:0;font-size:18px;color:#262626">Kuch galat ho gaya</h2>
      <p id="fatal-msg" style="color:#8e8e8e;font-size:13px;max-width:320px;margin:0;word-break:break-word">${message}</p>
      <button onclick="location.reload()" style="margin-top:6px;background:#0095f6;color:#fff;border:none;border-radius:8px;padding:10px 28px;font-weight:700;font-size:14px">Reload</button>
    </div>`
  document.body.appendChild(el)
}

window.addEventListener('error', (e) => {
  console.error(e.error || e.message)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled:', e.reason)
})

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
} catch (err) {
  showFatalError(String(err?.message || err))
}
