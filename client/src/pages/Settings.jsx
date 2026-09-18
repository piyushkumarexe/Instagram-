import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { setPrivate } from '../fb.js'
import Avatar from '../components/Avatar.jsx'
import { IcBack } from '../components/Icons.jsx'

export function applyTheme(t) {
  const root = document.documentElement
  if (t === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', t)
  if (window.Capacitor?.isNativePlatform?.()) {
    import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
      const dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {})
      StatusBar.setBackgroundColor({ color: dark ? '#000000' : '#ffffff' }).catch(() => {})
    }).catch(() => {})
  }
}

export default function Settings() {
  const app = useApp()
  const nav = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('vg_theme') || 'system')
  const [priv, setPriv] = useState(!!app.user.isPrivate)

  function pick(t) {
    setTheme(t)
    localStorage.setItem('vg_theme', t)
    applyTheme(t)
  }

  async function logout() {
    if (!window.confirm('Log out of VibeGram?')) return
    await app.logout()
  }

  return (
    <div className="settings-page">
      <header className="conn-head">
        <button className="icon-btn" onClick={() => nav(-1)}><IcBack size={24} /></button>
        <strong>Settings and privacy</strong>
      </header>

      <button className="settings-row" onClick={() => nav('/accounts/edit')}>
        <Avatar user={app.user} size={52} />
        <div className="settings-row-meta">
          <strong>{app.user.name}</strong>
          <span className="muted">{app.user.username} · Edit profile</span>
        </div>
        <span className="muted" style={{ fontSize: 20 }}>›</span>
      </button>

      <div className="settings-group-label">Appearance</div>
      <div className="settings-card">
        {['system', 'light', 'dark'].map((t) => (
          <button key={t} className="settings-item" onClick={() => pick(t)}>
            <span>{t === 'system' ? '🖥️ System default' : t === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
            {theme === t && <span className="settings-check">✓</span>}
          </button>
        ))}
      </div>

      <div className="settings-group-label">Privacy</div>
      <div className="settings-card">
        <button className="settings-item" onClick={async () => {
          const nv = !priv
          setPriv(nv)
          try {
            await setPrivate(app.user.id, nv)
            app.setUser((p) => ({ ...p, isPrivate: nv }))
            app.toast(nv ? 'Account is now private 🔒' : 'Account is now public 🌍')
          } catch (e) {
            setPriv(!nv)
            app.toast(e.message)
          }
        }}>
          <span>🔒 Private account</span>
          <span className="muted" style={{ fontSize: 13, maxWidth: 180 }}>{priv ? 'Only followers can see your posts' : 'Anyone can see your posts'}</span>
        </button>
      </div>

      <div className="settings-group-label">Account</div>
      <div className="settings-card">
        <div className="settings-item static"><span>Email</span><span className="muted">{app.user.email || '—'}</span></div>
        <button className="settings-item" onClick={logout}><span className="danger-text">Log out</span></button>
      </div>

      <div className="settings-foot muted">VibeGram · Made by Piyush</div>
    </div>
  )
}
