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

  // firebase auth watcher — fail-soft: UI hamesha render hota hai, errors screen pe dikhte hain
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
      // best-effort demo seed; never blocks login
      try { await seedDemoContentIfEmpty() } catch {}

      let profile = null
      let loadError = null
      try {
        profile = await getUser(u.uid)
      } catch (e) {
        loadError = String(e?.message || e)
      }

      // brand-new Google user → auto-claim a username from their email
      if (!profile && !loadError) {
        const prefix = String(u.email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 15) || 'user'
        const candidate = /^[a-z0-9._]{3,24}$/.test(prefix) ? prefix : 'user' + Math.floor(1000 + Math.random() * 9000)
        try {
          const { claimUsername } = await import('./fb.js')
          await claimUsername(u.uid, u.email || '', candidate, u.displayName || candidate)
          profile = await getUser(u.uid)
        } catch (e) {
          // username taken / invalid → onboarding modal will ask
        }
      }

      if (profile) {
        try { await loadFollowing(u.uid) } catch {}
        setUser({
          id: profile.id,
          username: profile.username,
          name: profile.name || u.displayName || profile.username,
          email: profile.email || u.email,
          avatar: profile.avatar || u.photoURL || null,
          bio: profile.bio || '',
          followersCount: profile.followersCount || 0,
          followingCount: profile.followingCount || 0,
          loadError: loadError || undefined,
        })
        // realtime badges
        try {
          unsubs.current.push(
            subscribeNotifications(u.uid, (list) => setUnreadNotifs(list.filter((n) => !n.read).length)),
            subscribeThreads(u.uid, (threads) => setUnreadDMs(threads.reduce((a, t) => a + (t.unread || 0), 0)))
          )
        } catch {}
      } else {
        // couldn't read/create the profile — still let the app render,
        // needsUsername flows (or error banners) take over from here
        setUser({
          id: u.uid,
          username: null,
          name: u.displayName || '',
          email: u.email,
          avatar: u.photoURL || null,
          needsUsername: !loadError,
          loadError,
        })
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
