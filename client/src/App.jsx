import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
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
import EditProfile from './pages/EditProfile.jsx'
import Login from './pages/Login.jsx'

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
  if (!app.user) return <Navigate to="/accounts/login" replace />
  return <Shell>{children}</Shell>
}

function PostPage() {
  const app = useApp()
  const { id } = useParams()
  useEffect(() => {
    if (id) app.openPost(id)
  }, [id])
  return <Protected><Home /></Protected>
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
  const app = useApp()
  return (
    <>
      <CreateModal />
      <StoryViewer />
      <PostModal />
      <Toasts />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/accounts/login" element={<Login />} />
        <Route path="/accounts/signup" element={<Login />} />
        <Route path="/accounts/edit" element={<Protected><EditProfile /></Protected>} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/explore" element={<Protected><Explore /></Protected>} />
        <Route path="/reels" element={<Protected><Reels /></Protected>} />
        <Route path="/messages" element={<Protected><Messages /></Protected>} />
        <Route path="/messages/:username" element={<Protected><Messages /></Protected>} />
        <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
        <Route path="/p/:id" element={<PostPage />} />
        <Route path="/:username" element={<Protected><Profile /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Modals />
    </AppProvider>
  )
}
