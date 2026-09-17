import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { api, isNative, serverBase, setServerBase } from '../api.js'
import { useApp } from '../store.jsx'

const SHOWCASE = ['/uploads/seed-posts-trek.jpg', '/uploads/seed-posts-chaat.jpg', '/uploads/seed-posts-palace.jpg']

export default function Login() {
  const app = useApp()
  const nav = useNavigate()
  const loc = useLocation()
  const isSignup = loc.pathname === '/accounts/signup'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [slide, setSlide] = useState(0)
  const native = isNative()
  const [server, setServer] = useState(serverBase())

  useEffect(() => {
    if (app.user) nav('/', { replace: true })
  }, [app.user])

  useEffect(() => {
    const iv = setInterval(() => setSlide((s) => (s + 1) % SHOWCASE.length), 3000)
    return () => clearInterval(iv)
  }, [])

  async function doLogin(u, p) {
    setBusy(true)
    setError('')
    try {
      const r = await api('/auth/login', { method: 'POST', body: { username: u, password: p } })
      app.login(r.token, r.user)
      nav('/', { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function submit(e) {
    e.preventDefault()
    if (isSignup) {
      setBusy(true)
      setError('')
      try {
        const r = await api('/auth/signup', { method: 'POST', body: { username, name, email, password } })
        app.login(r.token, r.user)
        nav('/', { replace: true })
      } catch (e2) {
        setError(e2.message)
      } finally {
        setBusy(false)
      }
    } else {
      doLogin(username, password)
    }
  }

  async function demoLogin() {
    await doLogin('demo', 'demo123')
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="phone-mockup">
          <div className="phone-screen">
            <img src={SHOWCASE[slide]} alt="VibeGram" className="phone-shot" />
            <div className="phone-chrome">
              <img src="/logo.png" alt="" width="26" height="26" style={{ borderRadius: 6 }} />
              <span>VibeGram</span>
            </div>
          </div>
        </div>
        <h1>Share your world,<br />one vibe at a time. ✨</h1>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/logo.png" alt="VibeGram" width="72" height="72" style={{ borderRadius: 16 }} />
            <span className="auth-wordmark">VibeGram</span>
          </div>
          <h2 className="auth-tag">
            {isSignup ? 'Sign up to see photos and videos from your friends.' : 'Sign in to see photos and videos from your friends.'}
          </h2>
          <form onSubmit={submit} className="auth-form">
            {isSignup && (
              <>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
              </>
            )}
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" autoCapitalize="none" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            {error && <div className="auth-error">{error}</div>}
            <button className="btn btn-blue w-full" disabled={busy || !username || !password}>
              {busy ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
            </button>
          </form>
          <div className="auth-or"><span>OR</span></div>
          <button className="btn btn-demo w-full" onClick={demoLogin} disabled={busy}>
            ⚡ Try the demo account
          </button>
          {native && (
            <div className="auth-server">
              <label htmlFor="vg-server">VibeGram server URL</label>
              <input
                id="vg-server"
                value={server}
                onChange={(e) => { setServer(e.target.value); setServerBase(e.target.value) }}
                placeholder="http://192.168.1.5:3001"
                autoCapitalize="none"
                spellCheck={false}
              />
              <p>App connects to the built-in demo server automatically. Run your own? <code>npm run dev</code> on a PC and enter its address, e.g. <code>http://192.168.1.5:3001</code> (Android emulator: <code>http://10.0.2.2:3001</code>).</p>
            </div>
          )}
          <p className="auth-demo-hint">demo / demo123 — comes pre-loaded with posts, stories & chats</p>
        </div>
        <div className="auth-card small">
          {isSignup ? (
            <p>Have an account? <Link to="/accounts/login" className="blue-link">Log in</Link></p>
          ) : (
            <p>Don't have an account? <Link to="/accounts/signup" className="blue-link">Sign up</Link></p>
          )}
        </div>
        <p className="auth-footer">Get the app — soon on the App Store & Play Store (this is a demo 😉)</p>
      </div>
    </div>
  )
}
