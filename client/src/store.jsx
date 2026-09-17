import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { api, setToken } from './api.js'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vg_user') || 'null') } catch { return null }
  })
  const [toasts, setToasts] = useState([])
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [unreadDMs, setUnreadDMs] = useState(0)
  // global modals
  const [createMode, setCreateMode] = useState(null) // 'post' | 'reel' | 'story' | null
  const [storyView, setStoryView] = useState(null) // {groups, index}
  const [postModalId, setPostModalId] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const toastId = useRef(0)

  const toast = useCallback((msg, ms = 2600) => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ms)
  }, [])

  const login = useCallback((token, u) => {
    setToken(token)
    localStorage.setItem('vg_user', JSON.stringify(u))
    setUser(u)
  }, [])

  const updateUser = useCallback((u) => {
    localStorage.setItem('vg_user', JSON.stringify(u))
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem('vg_user')
    setUser(null)
    setUnreadDMs(0)
    setUnreadNotifs(0)
  }, [])

  // poll unread counts
  useEffect(() => {
    if (!user) return
    let alive = true
    async function poll() {
      try {
        const n = await api('/notifications')
        if (!alive) return
        setUnreadNotifs(n.unread || 0)
        const m = await api('/messages')
        if (!alive) return
        setUnreadDMs((m.threads || []).reduce((a, t) => a + (t.unread || 0), 0))
      } catch (e) { /* ignore */ }
    }
    poll()
    const iv = setInterval(poll, 7000)
    return () => { alive = false; clearInterval(iv) }
  }, [user])

  const openCreate = useCallback((mode = 'post') => setCreateMode(mode), [])
  const closeCreate = useCallback(() => setCreateMode(null), [])
  const openStories = useCallback((groups, index) => setStoryView({ groups, index }), [])
  const closeStories = useCallback(() => setStoryView(null), [])
  const openPost = useCallback((postId) => setPostModalId(postId), [])
  const closePost = useCallback(() => setPostModalId(null), [])

  const value = {
    user, login, logout, updateUser, toast, toasts,
    unreadNotifs, unreadDMs, setUnreadDMs,
    createMode, openCreate, closeCreate,
    storyView, openStories, closeStories,
    postModalId, openPost, closePost,
    searchOpen, setSearchOpen,
  }
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
