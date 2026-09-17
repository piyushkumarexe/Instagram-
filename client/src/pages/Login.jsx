import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { authGoogle, authEmailPass, registerEmailPass, claimUsername, getUserByUsername } from '../fb.js'

const SHOWCASE = ['/uploads/seed-posts-trek.jpg', '/uploads/seed-posts-chaat.jpg', '/uploads/seed-posts-palace.jpg']

function friendlyError(e) {
  const code = e?.code || ''
  const msg = e?.message || String(e)
  if (code === 'auth/unauthorized-domain') {
    const host = window.location.hostname
    return `Google sign-in is not enabled for this domain (${host}). Fix: Firebase Console → Authentication → Settings → Authorized domains → add "${host}". (The Android APK works without this.) Or use email login below.`
  }
  if (code === 'auth/operation-not-allowed') return 'This sign-in method is disabled. Enable it in Firebase Console → Authentication → Sign-in method.'
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') return 'Sorry, your credentials were incorrect. Please double-check and try again.'
  if (code === 'auth/email-already-in-use') return 'An account with that email already exists — try logging in.'
  if (code === 'auth/weak-password') return 'Password should be at least 6 characters.'
  if (code === 'auth/network-request-failed') return 'Network error — check your internet connection.'
  return msg.replace('Firebase: ', '')
}

export default function Login() {
  const app = useApp()
  const nav = useNavigate()
  const loc = useLocation()
  const [mode, setMode] = useState(loc.pathname === '/accounts/signup' ? 'signup' : 'login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    if (app.user?.username) nav('/', { replace: true })
  }, [app.user])

  useEffect(() => {
    const iv = setInterval(() => setSlide((s) => (s + 1) % SHOWCASE.length), 3000)
    return () => clearInterval(iv)
  }, [])

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'signup') {
        const cred = await registerEmailPass(email, password, name)
        await claimUsername(cred.user.uid, email, username.toLowerCase(), name)
        await app.refreshUser()
        nav('/', { replace: true })
      } else {
        await authEmailPass(email, password)
      }
    } catch (e2) {
      setError(friendlyError(e2))
    } finally {
      setBusy(false)
    }
  }

  async function googleLogin() {
    setBusy(true)
    setError('')
    try {
      await authGoogle()
      // watcher picks it up; if new, UsernameSetup modal appears automatically
    } catch (e2) {
      setError(friendlyError(e2))
    } finally {
      setBusy(false)
    }
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
          <h2 className="auth-tag">Sign in to see photos and videos from your friends.</h2>

          <button className="btn btn-google w-full" onClick={googleLogin} disabled={busy}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.7-.2-2.5H12v4.8h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5h-4v3.1C3.2 21.3 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6h-4C.5 8.2 0 10.1 0 12s.5 3.8 1.3 5.4l4-3.1z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8L20 3.1C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"/></svg>
            Continue with Google
          </button>

          <div className="auth-or"><span>OR</span></div>

          <form onSubmit={submit} className="auth-form">
            {mode === 'signup' && (
              <>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
                <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} placeholder="Username (letters, numbers, . _)" autoCapitalize="none" required />
              </>
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" autoCapitalize="none" required />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
            {error && <div className="auth-error">{error}</div>}
            <button className="btn btn-blue w-full" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'signup' ? 'Sign up' : 'Log in'}
            </button>
          </form>
          <p className="auth-switch">
            {mode === 'signup' ? (
              <>Have an account? <button type="button" className="blue-link" onClick={() => { setMode('login'); setError('') }}>Log in</button></>
            ) : (
              <>Don't have an account? <button type="button" className="blue-link" onClick={() => { setMode('signup'); setError('') }}>Sign up</button></>
            )}
          </p>
        </div>
        <p className="auth-footer">Powered by Firebase · Secure sign-in</p>
      </div>
    </div>
  )
}

// Username onboarding for fresh Google sign-ins
export function UsernameSetup() {
  const app = useApp()
  const nav = useNavigate()
  const [uname, setUname] = useState('')
  const [name, setName] = useState(app.user?.name || '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (!app.user || !app.user.needsUsername) return null

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const taken = await getUserByUsername(uname)
      if (taken && taken.id !== app.user.id) throw new Error('That username is already taken')
      await claimUsername(app.user.id, app.user.email, uname, name || uname)
      await app.refreshUser()
      nav('/', { replace: true })
    } catch (e2) {
      setError(e2?.message?.replace('Firebase: ', '') || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="ulist-modal">
        <header className="ulist-head"><strong>Pick a username</strong></header>
        <div style={{ textAlign: 'center', padding: '18px 20px 4px' }}>
          <img src="/logo.png" alt="" width="64" height="64" style={{ borderRadius: 14 }} />
          <p className="muted" style={{ margin: '10px 0 0' }}>Welcome {name || 'aboard'}! 👋 Choose your unique username.</p>
        </div>
        <form onSubmit={submit} className="auth-form" style={{ padding: '14px 20px 20px' }}>
          <input value={uname} onChange={(e) => setUname(e.target.value.toLowerCase())} placeholder="username" autoCapitalize="none" required />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          {error && <div className="auth-error">{error}</div>}
          <button className="btn btn-blue w-full" disabled={busy || !uname}>{busy ? 'Setting up…' : 'Create my account'}</button>
        </form>
      </div>
    </div>
  )
}
