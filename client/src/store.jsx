import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { auth } from './firebase.js'
import {
  watchAuth, finishRedirect, signOutNow, getUser, loadFollowing,
  subscribeNotifications, subscribeThreads, seedDemoContentIfEmpty,
} from './fb.js'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)          // merged profile {id, username, ...}
  const [authReady, setAuthReady] = useState(false)
  const [toasts, setToasts] = useState([])
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [unreadDMs, setUnreadDMs] = useState(0)
  // global modals
  const [createMode, setCreateMode] = useState(null) // 'post' | 'reel' | 'story' | null
  const [storyView, setStoryView] = useState(null)
  const [postModalId, setPostModalId] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const toastId = useRef(0)
  const unsubs = useRef([])

  const toast = useCallback((msg, ms = 3000) => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ms)
  }, [])

  // firebase auth watcher
  useEffect(() => {
    finishRedirect()
    const unsub = watchAuth(async (u) => {
      unsubs.current.forEach((fn) => { try { fn() } catch {} })
      unsubs.current = []
      if (!u) {
        setUser(null)
        setUnreadDMs(0)
        setUnreadNotifs(0)
        setAuthReady(true)
        return
      }
      try {
        await seedDemoContentIfEmpty()
        const profile = await getUser(u.uid)
        if (profile) {
          await loadFollowing(u.uid)
          setUser({ ...profile, email: profile.email || u.email })
          // realtime badges
          unsubs.current.push(
            subscribeNotifications(u.uid, (list) => setUnreadNotifs(list.filter((n) => !n.read).length)),
            subscribeThreads(u.uid, (threads) => setUnreadDMs(threads.reduce((a, t) => a + (t.unread || 0), 0)))
          )
        } else {
          // authenticated but no username chosen yet
          setUser({ id: u.uid, username: null, name: u.displayName || '', email: u.email, avatar: u.photoURL, needsUsername: true })
        }
      } catch (e) {
        console.error(e)
        toast('Failed to load profile: ' + e.message)
      }
      setAuthReady(true)
    })
    return unsub
  }, [])

  const refreshUser = useCallback(async () => {
    const u = auth?.currentUser
    if (!u) return
    const profile = await getUser(u.uid)
    if (profile) setUser({ ...profile, email: profile.email || u.email })
  }, [])

  const logout = useCallback(async () => {
    unsubs.current.forEach((fn) => { try { fn() } catch {} })
    unsubs.current = []
    await signOutNow()
    setUser(null)
    setUnreadDMs(0)
    setUnreadNotifs(0)
  }, [])

  const openCreate = useCallback((mode = 'post') => setCreateMode(mode), [])
  const closeCreate = useCallback(() => setCreateMode(null), [])
  const openStories = useCallback((groups, index) => setStoryView({ groups, index }), [])
  const closeStories = useCallback(() => setStoryView(null), [])
  const openPost = useCallback((postId) => setPostModalId(postId), [])
  const closePost = useCallback(() => setPostModalId(null), [])

  const value = {
    user, setUser, refreshUser, logout, toast, toasts, authReady,
    unreadNotifs, unreadDMs,
    createMode, openCreate, closeCreate,
    storyView, openStories, closeStories,
    postModalId, openPost, closePost,
    searchOpen, setSearchOpen,
  }
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
