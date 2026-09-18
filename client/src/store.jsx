import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { auth } from './firebase.js'
import {
  watchAuth, finishRedirect, signOutNow, getUser, loadFollowing,
  subscribeNotifications, subscribeThreads, seedDemoContentIfEmpty, ensureBotsVerified } from './fb.js'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

function cachedProfile(uid) {
  try { return JSON.parse(localStorage.getItem('vg_profile_' + uid) || 'null') } catch { return null }
}
function cacheProfile(u) {
  try { localStorage.setItem('vg_profile_' + u.id, JSON.stringify(u)) } catch {}
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [toasts, setToasts] = useState([])
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [unreadDMs, setUnreadDMs] = useState(0)
  const [createMode, setCreateMode] = useState(null)
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

  // firebase auth watcher — built for SPEED: cache-first paint, parallel loads
  useEffect(() => {
    finishRedirect()
    const unsub = watchAuth(async (u) => {
      unsubs.current.forEach((fn) => { try { fn() } catch {} })
      unsubs.current = []
      if (!u) {
        setUser(null)
        setUnreadDMs(0)
        setUnreadNotifs(0)
        ensureBotsVerified()
      setAuthReady(true)
        return
      }

      // 1) INSTANT: paint cached profile (if any) so the app opens immediately
      const cached = cachedProfile(u.uid)
      if (cached) {
        setUser({ ...cached, email: cached.email || u.email })
        setAuthReady(true)
      }

      // 2) seed check only once per device (meta doc guards multi-device)
      if (!localStorage.getItem('vg_seeded')) {
        try { await seedDemoContentIfEmpty() } catch {}
        localStorage.setItem('vg_seeded', '1')
      }

      // 3) fresh profile (single read) — parallel with followings + badges
      const profilePromise = cached ? Promise.resolve(cached) : Promise.resolve().then(() => getUser(u.uid))
      const followPromise = loadFollowing(u.uid).catch(() => {})
      try {
        unsubs.current.push(
          subscribeNotifications(u.uid, (list) => setUnreadNotifs(list.filter((n) => !n.read).length)),
          subscribeThreads(u.uid, (threads) => setUnreadDMs(threads.reduce((a, t) => a + (t.unread || 0), 0)))
        )
      } catch {}

      let profile = null
      let loadError = null
      try {
        profile = await profilePromise
      } catch (e) {
        loadError = String(e?.message || e)
      }

      if (!profile && !loadError) {
        // new Google user → auto-username from email, then read again
        const prefix = String(u.email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 15) || 'user'
        const candidate = /^[a-z0-9._]{3,24}$/.test(prefix) ? prefix : 'user' + Math.floor(1000 + Math.random() * 9000)
        try {
          const { claimUsername } = await import('./fb.js')
          await claimUsername(u.uid, u.email || '', candidate, u.displayName || candidate)
          profile = await getUser(u.uid)
        } catch {}
      }

      if (profile) {
        const merged = {
          id: profile.id,
          username: profile.username,
          name: profile.name || u.displayName || profile.username,
          email: profile.email || u.email,
          avatar: profile.avatar || u.photoURL || null,
          bio: profile.bio || '',
          followersCount: profile.followersCount || 0,
          followingCount: profile.followingCount || 0,
          loadError,
        }
        cacheProfile(merged)
        setUser(merged)
      } else {
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
      followPromise.finally(() => {})
      setAuthReady(true)
    })
    return unsub
  }, [])

  const refreshUser = useCallback(async () => {
    const u = auth?.currentUser
    if (!u) return
    try {
      const profile = await getUser(u.uid)
      if (profile) {
        const merged = { ...profile, email: profile.email || u.email }
        cacheProfile(merged)
        setUser(merged)
      }
    } catch {}
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
