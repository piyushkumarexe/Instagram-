import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useParams, useNavigate } from 'react-router-dom'
import { AppProvider, useApp } from './store.jsx'
import Sidebar, { SearchPanel } from './components/Sidebar.jsx'
import MobileNav from './components/MobileNav.jsx'
import CreateModal from './components/CreateModal.jsx'
import StoryViewer from './components/StoryViewer.jsx'
import PostModal from './components/PostModal.jsx'
import Home from './pages/Home.jsx'
import Explore from './pages/Explore.jsx'
import Reels from './pages/Reels.jsx'
import Messages from './pages/Messages.jsx'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'
import Connections from './pages/Connections.jsx'
import EditProfile from './pages/EditProfile.jsx'
import Settings from './pages/Settings.jsx'
import Login, { UsernameSetup } from './pages/Login.jsx'
import { getPost } from './fb.js'

function Shell({ children }) {
  const app = useApp()
  const location = useLocation()
  if (!app.user) return children
  return (
    <div className="shell">
      <Sidebar />
      <SearchPanel />
      <main className={'main' + (/^\/(reels|messages)/.test(location.pathname) ? ' full' : '')}>
        {children}
      </main>
      <MobileNav />
    </div>
  )
}

function Protected({ children }) {
  const app = useApp()
  if (!app.authReady) {
    return (
      <div className="boot-screen">
        <img src="/logo.png" width="72" style={{ borderRadius: 16 }} alt="" />
        <p>Loading VibeGram…</p>
        <span className="made-by">Made by Piyush</span>
      </div>
    )
  }
  if (!app.user) return <Navigate to="/accounts/login" replace />
  return (
    <Shell>
      {app.user.loadError && (
        <div className="db-banner">
          <span>
            ⚠️ Data could not load: {app.user.loadError}. Check Firebase Console → Firestore Database → Rules (test mode). Also check your internet.
          </span>
          <button onClick={() => location.reload()}>Reload</button>
        </div>
      )}
      {children}
    </Shell>
  )
}

function PostPage() {
  const app = useApp()
  const { id } = useParams()
  useEffect(() => {
    if (id) getPost(id).then((p) => p && app.openPost(id)).catch(() => {})
  }, [id])
  return <Protected><Home /></Protected>
}

// Android hardware back: modal close → history back → exit (real app behaviour)
function BackHandler() {
  const app = useApp()
  const nav = useNavigate()
  useEffect(() => {
    if (!window.Capacitor?.isNativePlatform?.()) return
    let handle = null
    let cancelled = false
    import('@capacitor/app').then(({ App: CapApp }) => {
      if (cancelled) return
      CapApp.addListener('backButton', () => {
        if (app.postModalId) return app.closePost()
        if (app.storyView) return app.closeStories()
        if (app.createMode) return app.closeCreate()
        if (app.searchOpen) return app.setSearchOpen(false)
        const idx = (window.history.state && window.history.state.idx) || 0
        if (idx > 0) window.history.back()
        else CapApp.exitApp()
      }).then((h) => { if (cancelled) h.remove(); else handle = h })
    }).catch(() => {})
    return () => {
      cancelled = true
      if (handle) handle.remove()
    }
  }, [app, nav])
  return null
}

function BadgeSync() {
  const app = useApp()
  useEffect(() => {
    if (!window.Capacitor?.isNativePlatform?.() || !app.user) return
    import('@capawesome/capacitor-badge').then(({ Badge }) => {
      const n = app.unreadDMs || 0
      if (n > 0) Badge.set({ count: n }).catch(() => {})
      else Badge.clear().catch(() => {})
    }).catch(() => {})
  }, [app.unreadDMs, app.user?.id])
  return null
}

function Presence() {
  const app = useApp()
  useEffect(() => {
    if (!app.user?.id) return
    let iv = null
    import('./fb.js').then(({ touchPresence }) => {
      const tick = () => { if (document.visibilityState === 'visible') touchPresence(app.user.id) }
      tick()
      iv = setInterval(tick, 55000)
      document.addEventListener('visibilitychange', tick)
    }).catch(() => {})
    return () => {
      if (iv) clearInterval(iv)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [app.user?.id])
  return null
}

function Toasts() {
  const app = useApp()
  return (
    <div className="toasts">
      {app.toasts.map((t) => (
        <div key={t.id} className="toast">{t.msg}</div>
      ))}
    </div>
  )
}

function Modals() {
  return (
    <>
      <CreateModal />
      <StoryViewer />
      <PostModal />
      <UsernameSetup />
      <Toasts />
    </>
  )
}

export default function App() {
  // React is alive — retire the static boot overlay
  useEffect(() => {
    document.getElementById('boot')?.remove()
  }, [])
  return (
    <AppProvider>
      <Routes>
        <Route path="/accounts/login" element={<Login />} />
        <Route path="/accounts/signup" element={<Login />} />
        <Route path="/accounts/edit" element={<Protected><EditProfile /></Protected>} />
        <Route path="/settings" element={<Protected><Settings /></Protected>} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/explore" element={<Protected><Explore /></Protected>} />
        <Route path="/reels" element={<Protected><Reels /></Protected>} />
        <Route path="/messages" element={<Protected><Messages /></Protected>} />
        <Route path="/messages/:username" element={<Protected><Messages /></Protected>} />
        <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
        <Route path="/p/:id" element={<PostPage />} />
        <Route path="/:username" element={<Protected><Profile /></Protected>} />
        <Route path="/:username/followers" element={<Protected><Connections /></Protected>} />
        <Route path="/:username/following" element={<Protected><Connections /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BackHandler />
      <BadgeSync />
      <Presence />
      <Modals />
    </AppProvider>
  )
}
