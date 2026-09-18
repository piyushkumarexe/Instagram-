import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { getFeed } from '../fb.js'
import PostCard from '../components/PostCard.jsx'
import StoryBar from '../components/StoryBar.jsx'
import Suggestions from '../components/Suggestions.jsx'
import { MobileTopBar } from '../components/MobileNav.jsx'

const FEED_CACHE = 'vg_feed_cache'

function readCache() {
  try { return JSON.parse(localStorage.getItem(FEED_CACHE) || 'null') } catch { return null }
}
function writeCache(posts) {
  try {
    // strip volatile fields, keep it small
    localStorage.setItem(FEED_CACHE, JSON.stringify(posts.slice(0, 12).map((p) => ({
      id: p.id, caption: p.caption, media: p.media, mediaType: p.mediaType, type: p.type,
      createdAt: p.createdAt, likes: p.likes, commentsCount: p.commentsCount,
      user: p.user, likedByMe: p.likedByMe, savedByMe: p.savedByMe, comments: p.comments || [],
    }))))
  } catch {}
}

export default function Home() {
  const app = useApp()
  const nav = useNavigate()
  const [posts, setPosts] = useState([])
  const [cursor, setCursor] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const sentinel = useRef(null)
  const loadingMore = useRef(false)

  const load = useCallback(async (cur) => {
    try {
      const r = await getFeed({ cursor: cur })
      setPosts((p) => {
        const next = cur ? [...p, ...r.posts] : r.posts
        writeCache(next)
        return next
      })
      setCursor(r.cursor)
    } catch (e) {
      if (!cur) setLoading(false)
      if (!readCache()) app.toast(e.message)
    } finally {
      if (!cur) setLoading(false)
      loadingMore.current = false
    }
  }, [])

  useEffect(() => {
    // cache-first: instant paint, fresh data in background
    const cached = readCache()
    if (cached?.length) {
      setPosts(cached)
      setLoading(false)
      load()
    } else {
      load()
    }
    const h = () => load()
    window.addEventListener('vg:refresh-feed', h)
    return () => window.removeEventListener('vg:refresh-feed', h)
  }, [])

  useEffect(() => {
    if (!sentinel.current) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor && !loadingMore.current) {
        loadingMore.current = true
        load(cursor)
      }
    }, { rootMargin: '600px' })
    obs.observe(sentinel.current)
    return () => obs.disconnect()
  }, [cursor, load])

  function patch(id, p) {
    setPosts((list) => {
      const next = list.map((x) => (x.id === id ? p : x))
      writeCache(next)
      return next
    })
  }

  return (
    <div className="home-page">
      <MobileTopBar />
      <div className="home-cols">
        <div className="home-main">
          <StoryBar />
          {loading && !posts.length && <div className="feed-skeleton"><div className="skeleton-card" /><div className="skeleton-card" /></div>}
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onChange={(np) => patch(p.id, np)} onDeleted={() => setPosts((l) => l.filter((x) => x.id !== p.id))} />
          ))}
          {!loading && posts.length === 0 && (
            <div className="feed-empty card">
              <span className="big-emoji">📸</span>
              <h3>Welcome to VibeGram!</h3>
              <p>Follow people to see their photos and videos here — or tap + to create your first post.</p>
              <button className="btn btn-blue" onClick={() => nav('/explore')}>Find people</button>
            </div>
          )}
          {cursor === null && posts.length > 0 && (
            <div className="feed-end">
              <span className="big-emoji">✅</span>
              <h3>You're all caught up</h3>
              <p className="muted">You've seen all new posts.</p>
            </div>
          )}
          <div ref={sentinel} />
        </div>
        <Suggestions />
      </div>
    </div>
  )
}
